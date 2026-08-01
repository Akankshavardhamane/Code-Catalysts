from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# This allows your friend's frontend (running on a different port) to talk to this backend
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
    contents = await file.read()
    return {
        "filename": file.filename,
        "size_bytes": len(contents)
    }