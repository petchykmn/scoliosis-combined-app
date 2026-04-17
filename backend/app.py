import base64
import os
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'scoliosis_model.pt')
DISPLAY_WIDTH = 800

app = FastAPI(title='Scoliosis AI Backend', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

_model: Optional[YOLO] = None


class AnalyzeResponse(BaseModel):
    success: bool
    severity: str
    raw_label: str
    confidence: float
    degree_range: str
    recommendation: str
    note: str
    analyzed_image_base64: str


def get_model() -> YOLO:
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f'Model file not found: {MODEL_PATH}')
        _model = YOLO(MODEL_PATH)
    return _model


def normalize_severity(label: str) -> str:
    value = (label or '').strip().lower()
    if 'normal' in value:
        return 'normal'
    if 'mild' in value:
        return 'mild'
    if 'moderate' in value:
        return 'moderate'
    if 'severe' in value:
        return 'severe'
    return value or 'unknown'


def degree_range_from_severity(severity: str) -> str:
    mapping = {
        'normal': '< 10°',
        'mild': '10–25°',
        'moderate': '25–40°',
        'severe': '> 40°',
    }
    return mapping.get(severity, 'Unknown range')


def recommendation_from_severity(severity: str) -> str:
    mapping = {
        'normal': 'Normal screening result. Maintain good posture and monitor periodically.',
        'mild': 'Mild curvature class detected. Consider regular monitoring and consult a clinician if symptoms exist.',
        'moderate': 'Moderate curvature class detected. Consultation with a specialist is recommended for further assessment.',
        'severe': 'Severe curvature class detected. Prompt evaluation by an orthopedic specialist is strongly recommended.',
    }
    return mapping.get(severity, 'Unable to determine a recommendation from the model output.')


def color_from_severity(severity: str) -> tuple[int, int, int]:
    mapping = {
        'normal': (0, 255, 0),
        'mild': (0, 255, 255),
        'moderate': (0, 165, 255),
        'severe': (0, 0, 255),
    }
    return mapping.get(severity, (255, 255, 255))


def encode_image_to_data_url(image: np.ndarray) -> str:
    ok, buffer = cv2.imencode('.jpg', image)
    if not ok:
        raise RuntimeError('Failed to encode result image.')
    encoded = base64.b64encode(buffer.tobytes()).decode('utf-8')
    return f'data:image/jpeg;base64,{encoded}'


def draw_analysis(image: np.ndarray, result, best_idx: int, severity: str, raw_label: str, confidence: float) -> np.ndarray:
    h, w = image.shape[:2]
    scale = DISPLAY_WIDTH / max(w, 1)
    display_img = cv2.resize(image, (DISPLAY_WIDTH, int(h * scale)))

    if result.keypoints is not None and result.keypoints.xy is not None:
        keypoints_xy = result.keypoints.xy.cpu().numpy()
        if best_idx < len(keypoints_xy):
            scaled_kpts = (keypoints_xy[best_idx] * scale).astype(np.int32)

            spine = scaled_kpts[0:6]
            valid_spine = [pt for pt in spine if pt[0] > 0 and pt[1] > 0]
            if len(valid_spine) > 1:
                cv2.polylines(display_img, [np.array(valid_spine)], isClosed=False, color=(0, 0, 0), thickness=2)

            for x, y in scaled_kpts:
                if x > 0 and y > 0:
                    cv2.circle(display_img, (x, y), 6, (0, 0, 0), -1)
                    cv2.circle(display_img, (x, y), 4, (255, 255, 255), -1)

    if result.boxes is not None and len(result.boxes) > 0:
        xyxy = result.boxes.xyxy[best_idx].cpu().numpy()
        x1, y1, x2, y2 = (xyxy * scale).astype(np.int32)
        color = color_from_severity(severity)
        cv2.rectangle(display_img, (x1, y1), (x2, y2), color, 2)
        label = f'{raw_label} {confidence:.2f}'
        cv2.putText(
            display_img,
            label,
            (x1, max(0, y1 - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2,
        )

    return display_img


@app.get('/api/health')
def health_check():
    return {'status': 'ok'}


@app.post('/api/analyze', response_model=AnalyzeResponse)
async def analyze_image(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail='No file was uploaded.')

    file_bytes = await image.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail='Uploaded file is empty.')

    np_buffer = np.frombuffer(file_bytes, np.uint8)
    decoded = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)
    if decoded is None:
        raise HTTPException(status_code=400, detail='Unsupported or unreadable image file. Please use JPG or PNG.')

    try:
        model = get_model()
        results = model(decoded, conf=0.4, verbose=False)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Model inference failed: {exc}') from exc

    if not results:
        raise HTTPException(status_code=422, detail='The model did not return any result.')

    result = results[0]
    if result.boxes is None or len(result.boxes) == 0:
        raise HTTPException(status_code=422, detail='No spine region was detected in this image. Please retake the photo following the posture guide.')

    confidences = result.boxes.conf.cpu().numpy()
    best_idx = int(np.argmax(confidences))
    class_id = int(result.boxes.cls[best_idx].item())
    raw_label = str(result.names[class_id])
    severity = normalize_severity(raw_label)
    confidence = float(confidences[best_idx])
    degree_range = degree_range_from_severity(severity)
    recommendation = recommendation_from_severity(severity)
    note = (
        'This model currently predicts a severity class and keypoint overlay from a back photo. '
        'It does not output a medically validated exact Cobb angle value.'
    )

    analyzed = draw_analysis(decoded, result, best_idx, severity, raw_label, confidence)
    analyzed_image_base64 = encode_image_to_data_url(analyzed)

    return AnalyzeResponse(
        success=True,
        severity=severity,
        raw_label=raw_label,
        confidence=round(confidence, 4),
        degree_range=degree_range,
        recommendation=recommendation,
        note=note,
        analyzed_image_base64=analyzed_image_base64,
    )


@app.exception_handler(RuntimeError)
async def runtime_error_handler(_, exc: RuntimeError):
    return JSONResponse(status_code=500, content={'detail': str(exc)})
