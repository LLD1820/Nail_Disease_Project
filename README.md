# Nail Disease Project

This repository contains:
- `mobile_app/`: React Native mobile app for offline nail disease detection and optional explainability.
- `backend/`: Flask API that returns Grad-CAM-like overlays (true Grad-CAM when a Keras model is provided).

## Run Frontend
1. Install Node.js + React Native CLI
2. `cd mobile_app`
3. `npm install`
4. `npx react-native run-android`

## Run Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python app.py`

## Model Files
Place provided files at:
- `mobile_app/assets/nail_disease_model.tflite`
- `mobile_app/assets/labels.txt`

Model is consumed as-is (no retraining/modification).
