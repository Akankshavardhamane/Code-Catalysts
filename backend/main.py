from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import shutil
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()  # reads your .env file

app = FastAPI()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is working!"}

@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    # Save the uploaded file temporarily so pdfplumber can read it
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read text out of the PDF
    text = ""
    with pdfplumber.open(temp_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    # Ask Gemini to turn the raw text into structured JSON
    prompt = f"""You are a document extraction agent. Given the raw text of a contract or invoice, extract the following fields and return ONLY valid JSON, no markdown, no explanation, no extra text:

{{
  "doc_type": "contract" or "invoice",
  "vendor_name": string or null,
  "price_per_unit": number or null,
  "quantity": number or null,
  "total_amount": number or null,
  "sla_terms": [list of SLA-related clauses as strings],
  "renewal_date": string or null,
  "notice_clause": string or null
}}

Document text:
{text}
"""

    response = model.generate_content(prompt)
    raw_output = response.text.strip()

    # Gemini sometimes wraps JSON in ```json ... ``` — strip that if present
    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:].strip()

    try:
        extracted_data = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

    return extracted_data

@app.post("/audit")
async def audit(contract: dict, invoice: dict):
    prompt = f"""Compare this contract data and invoice data. List every mismatch you find — price differences, missing SLA terms, unusual quantities, upcoming renewal risks. For each, give severity (high/medium/low) and a one-sentence explanation.

Also estimate the annual dollar cost impact if a price mismatch exists (price difference * quantity, or a reasonable estimate).

Return ONLY valid JSON, no markdown, no explanation, matching this exact shape:
{{
  "mismatches": [
    {{"field": string, "contract_value": string, "invoice_value": string, "severity": "high" or "medium" or "low", "explanation": string}}
  ],
  "estimated_cost_impact": number
}}

Contract data:
{json.dumps(contract)}

Invoice data:
{json.dumps(invoice)}
"""

    response = model.generate_content(prompt)
    raw_output = response.text.strip()

    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:].strip()

    try:
        audit_result = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

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
    raw_output = response.text.strip()

    if raw_output.startswith("```"):
        raw_output = raw_output.strip("`")
        if raw_output.startswith("json"):
            raw_output = raw_output[4:].strip()

    try:
        negotiation = json.loads(raw_output)
    except json.JSONDecodeError:
        return {"error": "Could not parse JSON from model", "raw_output": raw_output}

    return negotiation

@app.post("/approve-sync")
async def approve_sync(record: dict):
    erp_file = "mock_erp.json"

    # Load existing records, or start fresh if file doesn't exist yet
    if os.path.exists(erp_file):
        with open(erp_file, "r") as f:
            db = json.load(f)
    else:
        db = []

    db.append(record)

    with open(erp_file, "w") as f:
        json.dump(db, f, indent=2)

    return {"status": "synced", "record": record}

@app.post("/process")
async def process(contract_file: UploadFile = File(...), invoice_file: UploadFile = File(...)):
    # Helper function to extract text + structured data from one PDF
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

        prompt = f"""You are a document extraction agent. Given the raw text of a contract or invoice, extract the following fields and return ONLY valid JSON, no markdown, no explanation:

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

Document text:
{text}
"""
        response = model.generate_content(prompt)
        raw_output = response.text.strip()
        if raw_output.startswith("```"):
            raw_output = raw_output.strip("`")
            if raw_output.startswith("json"):
                raw_output = raw_output[4:].strip()
        return json.loads(raw_output)

    # Step 1: Extract both documents
    contract_data = await extract_one(contract_file)
    invoice_data = await extract_one(invoice_file)

    # Step 2: Audit — compare the two
    audit_prompt = f"""Compare this contract data and invoice data. List every mismatch you find — price differences, missing SLA terms, unusual quantities, upcoming renewal risks. For each, give severity (high/medium/low) and a one-sentence explanation.

Also estimate the annual dollar cost impact if a price mismatch exists.

Return ONLY valid JSON:
{{
  "mismatches": [{{"field": string, "contract_value": string, "invoice_value": string, "severity": string, "explanation": string}}],
  "estimated_cost_impact": number
}}

Contract data: {json.dumps(contract_data)}
Invoice data: {json.dumps(invoice_data)}
"""
    def clean_json(raw):
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.startswith("json"):
                raw = raw[4:].strip()
        return raw

    audit_response = model.generate_content(audit_prompt)
    audit_raw = clean_json(audit_response.text)
    try:
        audit_result = json.loads(audit_raw)
    except json.JSONDecodeError:
        # Retry once — LLM output isn't always perfectly formatted first try
        audit_response = model.generate_content(audit_prompt)
        audit_raw = clean_json(audit_response.text)
        audit_result = json.loads(audit_raw)
        
    # Recalculate cost impact ourselves instead of trusting the LLM's arithmetic
    contract_total = contract_data.get("total_amount") or 0
    invoice_total = invoice_data.get("total_amount") or 0
    audit_result["estimated_cost_impact"] = invoice_total - contract_total

    # Step 3: Negotiation — draft the counter-offer email
    vendor_name = contract_data.get("vendor_name", "the vendor")
    negotiation_prompt = f"""Given these procurement audit findings, draft a professional counter-offer email to the vendor addressing the specific mismatches found, and list 2-3 suggested cost-saving actions.

Return ONLY valid JSON:
{{"subject": string, "body": string, "suggested_actions": [string]}}

Vendor name: {vendor_name}
Audit findings: {json.dumps(audit_result)}
"""
    negotiation_response = model.generate_content(negotiation_prompt)
    negotiation_raw = negotiation_response.text.strip()
    if negotiation_raw.startswith("```"):
        negotiation_raw = negotiation_raw.strip("`")
        if negotiation_raw.startswith("json"):
            negotiation_raw = negotiation_raw[4:].strip()
    negotiation_result = json.loads(negotiation_raw)

    # Step 4: Return everything together
    return {
        "contract_data": contract_data,
        "invoice_data": invoice_data,
        "audit_result": audit_result,
        "negotiation": negotiation_result
    }