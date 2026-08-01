from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import shutil
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_json(raw):
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:].strip()
    return raw


EXTRACTION_PROMPT_TEMPLATE = """You are a document extraction agent. Given the raw text of a contract or invoice, extract the following fields and return ONLY valid JSON, no markdown, no explanation:

{{
  "doc_type": "contract" or "invoice",
  "vendor_name": string or null,
  "price_per_unit": number or null,
  "quantity": number or null,
  "total_amount": number or null,
  "sla_terms": [list of strings],
  "renewal_date": string or null,
  "notice_clause": string or null
}}

IMPORTANT for notice_clause: capture ALL distinct notice-related requirements found in the document, not just one. Many contracts contain multiple separate notice rules (e.g. one for price changes, a different one for renewal/non-renewal). If there are multiple distinct notice requirements, combine them into a single string separated by semicolons, rather than only capturing the first one you find.

Document text:
{text}
"""

AUDIT_PROMPT_TEMPLATE = """You are a meticulous but fair procurement auditor. Compare this contract data and invoice data.

CRITICAL RULE: Only flag something as a mismatch if it represents a REAL difference in meaning, obligation, or amount — not a difference in wording or phrasing. If the invoice states the same commitment as the contract using different words, this is NOT a mismatch, even if the sentences look different. Judge based on semantic meaning, not exact text.

Examples of what NOT to flag:
- Contract says "guaranteed 24-hour response time" and invoice says "24-hour support response time" — these mean the same thing, do NOT flag this.
- Contract says "30 days notice for non-renewal" and invoice says "30 days notice for price changes" — if the contract's notice_clause ALSO separately mentions a 30-day price-change notice requirement, then the invoice is correctly restating one part of the contract, NOT a mismatch. Only flag this if the invoice's stated obligation genuinely contradicts or is absent from anything in the contract.
- Any case where the invoice references, restates, or summarizes a contract clause without contradicting it.

Examples of what TO flag:
- Different prices, quantities, or totals.
- A completely missing SLA or notice term with no reference to it at all anywhere in the invoice.
- Terms that actively contradict each other (e.g. contract says 24-hour response, invoice says 48-hour response).

Before flagging a notice_clause or sla_terms mismatch, carefully check whether the contract's value contains MULTIPLE distinct clauses (separated by semicolons or "and"). If the invoice's value matches ANY ONE of those clauses, do not flag it as a mismatch — the invoice is correctly citing part of a multi-part contract term.

For anything genuinely missing (not just referenced differently or partially), mark it appropriately. For anything that's just a paraphrase or partial restatement of the same clause, do not include it as a mismatch at all.

List every REAL mismatch you find — price differences, quantity differences, missing SLA terms (only if truly absent, not just paraphrased), and give severity (high/medium/low) and a one-sentence explanation for each.

Return ONLY valid JSON, no markdown, no explanation:
{{
  "mismatches": [
    {{"field": string, "contract_value": string, "invoice_value": string, "severity": "high" or "medium" or "low", "explanation": string}}
  ],
  "estimated_cost_impact": number
}}

Contract data:
{contract_json}

Invoice data:
{invoice_json}
"""


@app.get("/")
def home():
    return {"message": "Backend is working!"}


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""
    with pdfplumber.open(temp_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    prompt = EXTRACTION_PROMPT_TEMPLATE.format(text=text)

    response = model.generate_content(prompt)
    raw_output = clean_json(response.text)

    try:
        extracted_data = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

    return extracted_data


@app.post("/audit")
async def audit(contract: dict, invoice: dict):
    audit_prompt = AUDIT_PROMPT_TEMPLATE.format(
        contract_json=json.dumps(contract),
        invoice_json=json.dumps(invoice),
    )

    response = model.generate_content(audit_prompt)
    raw_output = clean_json(response.text)

    try:
        audit_result = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

    contract_total = contract.get("total_amount") or 0
    invoice_total = invoice.get("total_amount") or 0
    audit_result["estimated_cost_impact"] = invoice_total - contract_total

    return audit_result


@app.post("/negotiate")
async def negotiate(audit_result: dict, vendor_name: str = "the vendor"):
    prompt = f"""Given these procurement audit findings, draft a professional counter-offer email to the vendor addressing the specific mismatches found, and list 2-3 suggested cost-saving actions.

Return ONLY valid JSON, no markdown, no explanation, matching this exact shape:
{{
  "subject": string,
  "body": string,
  "suggested_actions": [string]
}}

Vendor name: {vendor_name}

Audit findings:
{json.dumps(audit_result)}
"""

    response = model.generate_content(prompt)
    raw_output = clean_json(response.text)

    try:
        negotiation = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

    return negotiation


@app.post("/process")
async def process(contract_file: UploadFile = File(...), invoice_file: UploadFile = File(...)):

    async def extract_one(file: UploadFile):
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = ""
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        prompt = EXTRACTION_PROMPT_TEMPLATE.format(text=text)
        response = model.generate_content(prompt)
        raw_output = clean_json(response.text)
        return json.loads(raw_output)

    # Step 1: Extract both documents
    contract_data = await extract_one(contract_file)
    invoice_data = await extract_one(invoice_file)

    # Step 2: Audit — compare the two, judging meaning not wording
    audit_prompt = AUDIT_PROMPT_TEMPLATE.format(
        contract_json=json.dumps(contract_data),
        invoice_json=json.dumps(invoice_data),
    )

    audit_response = model.generate_content(audit_prompt)
    audit_raw = clean_json(audit_response.text)
    try:
        audit_result = json.loads(audit_raw)
    except json.JSONDecodeError:
        audit_response = model.generate_content(audit_prompt)
        audit_raw = clean_json(audit_response.text)
        audit_result = json.loads(audit_raw)

    # Recalculate cost impact ourselves instead of trusting the LLM's arithmetic
    contract_total = contract_data.get("total_amount") or 0
    invoice_total = invoice_data.get("total_amount") or 0
    audit_result["estimated_cost_impact"] = invoice_total - contract_total

    # Step 3: If there are no real mismatches, auto-approve and sync — skip negotiation entirely
    if len(audit_result.get("mismatches", [])) == 0:
        auto_record = {
            "vendor_name": contract_data.get("vendor_name", "Unknown Vendor"),
            "action": "auto_approved_no_issues",
            "status": "approved",
        }

        erp_file = "mock_erp.json"
        if os.path.exists(erp_file):
            with open(erp_file, "r") as f:
                db = json.load(f)
        else:
            db = []
        db.append(auto_record)
        with open(erp_file, "w") as f:
            json.dump(db, f, indent=2)

        return {
            "contract_data": contract_data,
            "invoice_data": invoice_data,
            "audit_result": audit_result,
            "negotiation": None,
            "auto_approved": True
        }

    # Step 4: Negotiation — only reached if there are real mismatches
    vendor_name = contract_data.get("vendor_name", "the vendor")
    negotiation_prompt = f"""Given these procurement audit findings, draft a professional counter-offer email to the vendor addressing the specific mismatches found, and list 2-3 suggested cost-saving actions.

Return ONLY valid JSON:
{{"subject": string, "body": string, "suggested_actions": [string]}}

Vendor name: {vendor_name}
Audit findings: {json.dumps(audit_result)}
"""
    negotiation_response = model.generate_content(negotiation_prompt)
    negotiation_raw = clean_json(negotiation_response.text)
    try:
        negotiation_result = json.loads(negotiation_raw)
    except json.JSONDecodeError:
        negotiation_response = model.generate_content(negotiation_prompt)
        negotiation_raw = clean_json(negotiation_response.text)
        negotiation_result = json.loads(negotiation_raw)

    return {
        "contract_data": contract_data,
        "invoice_data": invoice_data,
        "audit_result": audit_result,
        "negotiation": negotiation_result,
        "auto_approved": False
    }


@app.post("/approve-sync")
async def approve_sync(record: dict):
    erp_file = "mock_erp.json"

    if os.path.exists(erp_file):
        with open(erp_file, "r") as f:
            db = json.load(f)
    else:
        db = []

    db.append(record)

    with open(erp_file, "w") as f:
        json.dump(db, f, indent=2)

    return {"status": "synced", "record": record}