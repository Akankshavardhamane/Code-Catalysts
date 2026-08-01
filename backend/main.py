from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import shutil

app = FastAPI()

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

    # Read the text out of the PDF
    text = ""
    with pdfplumber.open(temp_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    return {
        "filename": file.filename,
        "extracted_text_preview": text[:500]  # just first 500 characters for now
    }