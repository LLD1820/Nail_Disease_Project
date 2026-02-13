import Tflite from 'react-native-tflite';

const tflite = new Tflite();
let loadedLabels = [];
let modelLoaded = false;

const LABELS_PATH = 'labels.txt';
const MODEL_PATH = 'nail_disease_model.tflite';

const parseLabels = async () => {
  // react-native-tflite returns labels from model output index if labels file is bundled.
  // We keep this fallback list for demo resilience.
  return loadedLabels;
};

export const loadModel = () =>
  new Promise((resolve, reject) => {
    if (modelLoaded) {
      resolve(true);
      return;
    }

    tflite.loadModel(
      {
        model: MODEL_PATH,
        labels: LABELS_PATH,
      },
      (err, res) => {
        if (err) {
          reject(new Error(`Model loading failed: ${err}`));
          return;
        }

        modelLoaded = true;
        if (Array.isArray(res)) {
          loadedLabels = res;
        }
        resolve(true);
      },
    );
  });

export const runInference = imageUri =>
  new Promise((resolve, reject) => {
    tflite.runModelOnImage(
      {
        path: imageUri,
        imageMean: 0,
        imageStd: 255,
        numResults: 3,
        threshold: 0.05,
      },
      async (err, result) => {
        if (err) {
          reject(new Error(`Inference error: ${err}`));
          return;
        }

        const labels = await parseLabels();
        const top = result?.[0] || null;
        resolve({
          topPrediction: top
            ? {
                label: top.label || labels[top.index] || `Class ${top.index}`,
                confidence: top.confidence,
              }
            : null,
          allPredictions: result || [],
        });
      },
    );
  });
