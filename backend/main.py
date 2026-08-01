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