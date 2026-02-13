import base64
import io
import os
from typing import Tuple

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image


class GradCamGenerator:
    """
    Produces Grad-CAM from a Keras model when available.
    Falls back to a lightweight attention map approximation if only TFLite is available.
    """

    def __init__(self, model_path: str = None):
      self.keras_model = None
      self.last_conv_layer_name = None

      if model_path and os.path.exists(model_path):
          self.keras_model = tf.keras.models.load_model(model_path)
          self.last_conv_layer_name = self._find_last_conv_layer()

    def _find_last_conv_layer(self):
        for layer in reversed(self.keras_model.layers):
            if len(layer.output_shape) == 4:
                return layer.name
        return None

    @staticmethod
    def _decode_image(image_bytes: bytes) -> np.ndarray:
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return np.array(pil_img)

    @staticmethod
    def _encode_png_b64(image_array: np.ndarray) -> str:
        success, buffer = cv2.imencode('.png', cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR))
        if not success:
            raise ValueError('Failed to encode heatmap image.')
        return base64.b64encode(buffer).decode('utf-8')

    def _true_gradcam(self, image_rgb: np.ndarray, class_idx: int = None) -> np.ndarray:
        resized = cv2.resize(image_rgb, (224, 224)).astype(np.float32) / 255.0
        x = np.expand_dims(resized, axis=0)

        grad_model = tf.keras.models.Model(
            [self.keras_model.inputs],
            [self.keras_model.get_layer(self.last_conv_layer_name).output, self.keras_model.output],
        )

        with tf.GradientTape() as tape:
            conv_output, predictions = grad_model(x)
            if class_idx is None:
                class_idx = tf.argmax(predictions[0])
            class_channel = predictions[:, class_idx]

        grads = tape.gradient(class_channel, conv_output)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_output = conv_output[0]

        heatmap = conv_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = np.uint8(255 * heatmap.numpy())
        heatmap = cv2.resize(heatmap, (image_rgb.shape[1], image_rgb.shape[0]))
        return cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)[:, :, ::-1]

    def _fallback_heatmap(self, image_rgb: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (0, 0), 3)
        edges = cv2.Laplacian(blurred, cv2.CV_32F)
        edges = np.abs(edges)
        norm = (255 * (edges / (np.max(edges) + 1e-8))).astype(np.uint8)
        return cv2.applyColorMap(norm, cv2.COLORMAP_JET)[:, :, ::-1]

    def generate_overlay(self, image_bytes: bytes, alpha: float = 0.45) -> Tuple[str, str]:
        image_rgb = self._decode_image(image_bytes)

        if self.keras_model is not None and self.last_conv_layer_name is not None:
            heatmap_rgb = self._true_gradcam(image_rgb)
            mode = 'gradcam'
        else:
            heatmap_rgb = self._fallback_heatmap(image_rgb)
            mode = 'fallback-attention'

        overlay = cv2.addWeighted(image_rgb, 1 - alpha, heatmap_rgb, alpha, 0)
        return self._encode_png_b64(overlay), mode
