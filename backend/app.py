from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
from backend.inference import predict_image

app = FastAPI(title="Vehicle Damage Detection API")

# Enable CORS (frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Vehicle Damage Detection API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    os.makedirs("backend/uploads", exist_ok=True)

    file_path = f"backend/uploads/{uuid.uuid4()}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    detections, image_base64 = predict_image(file_path)

    return {
        "detections": detections,
        "image_base64": image_base64
    }
