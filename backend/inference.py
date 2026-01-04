from ultralytics import YOLO
import cv2
import base64

# Load model ONCE
MODEL_PATH = "backend/best.pt"
model = YOLO(MODEL_PATH)

def predict_image(image_path):
    # Run inference
    results = model(image_path, conf=0.33)

    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist()
            })

    # Get annotated image (numpy array)
    annotated_img = results[0].plot()

    # Encode image to Base64
    success, buffer = cv2.imencode(".jpg", annotated_img)
    if not success:
        raise RuntimeError("Failed to encode image")

    image_base64 = base64.b64encode(buffer).decode("utf-8")

    return detections, image_base64
