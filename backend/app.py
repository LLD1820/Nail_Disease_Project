import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from gradcam import GradCamGenerator

app = Flask(__name__)
CORS(app)

KERAS_MODEL_PATH = os.getenv('KERAS_MODEL_PATH', '')
gradcam_generator = GradCamGenerator(model_path=KERAS_MODEL_PATH if KERAS_MODEL_PATH else None)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@app.route('/gradcam', methods=['POST'])
def gradcam():
    if 'image' not in request.files:
        return jsonify({'error': 'Missing image file'}), 400

    image_file = request.files['image']
    image_bytes = image_file.read()
    if not image_bytes:
        return jsonify({'error': 'Empty image'}), 400

    try:
        heatmap_base64, mode = gradcam_generator.generate_overlay(image_bytes)
        return jsonify({'heatmap_base64': heatmap_base64, 'mode': mode})
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
