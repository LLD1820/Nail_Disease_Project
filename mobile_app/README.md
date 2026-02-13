# Nail Disease Detector (React Native)

Production-style React Native Android app for **offline nail disease prediction** + optional **online explainability (Grad-CAM overlay)**.

## Features
- Camera capture and gallery upload
- Single nail and whole-hand image handling (crop hook included)
- On-device TFLite inference (`nail_disease_model.tflite`) for offline use
- Online explainability: sends image to Flask API and overlays returned heatmap
- Rule-based body health insights + medical disclaimer

## Project Structure
```text
mobile_app/
├── assets/
│   ├── nail_disease_model.tflite
│   └── labels.txt
├── src/
│   ├── screens/
│   ├── components/
│   ├── services/
│   └── utils/
├── package.json
└── README.md
```

## Setup
1. Ensure React Native Android environment is configured.
2. Put provided model files in `mobile_app/assets/`:
   - `nail_disease_model.tflite`
   - `labels.txt`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Android app:
   ```bash
   npx react-native run-android
   ```

## Notes
- Offline prediction runs directly on device (no internet).
- XAI requires backend running at `http://10.0.2.2:5000` for Android emulator.
- To improve whole-hand support further, connect a native cropper and finger/nail detector model.
