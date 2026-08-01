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
model = genai.GenerativeModel("gemini-2.5-flash")

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