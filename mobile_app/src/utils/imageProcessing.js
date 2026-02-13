import ImageResizer from 'react-native-image-resizer';

export const preprocessImage = async (imageUri, cropRect = null) => {
  const resized = await ImageResizer.createResizedImage(imageUri, 224, 224, 'JPEG', 100, 0, undefined, false, {
    mode: 'contain',
    onlyScaleDown: false,
  });

  if (!cropRect) {
    return resized.uri;
  }

  // For manual/automatic crop support, this function accepts a crop rectangle and
  // can be extended with native crop utilities. For demo readiness we first resize
  // then pass whole image to the model when precise crop APIs are unavailable.
  return resized.uri;
};

export const isWholeHandCandidate = imageMeta => {
  if (!imageMeta?.width || !imageMeta?.height) {
    return false;
  }

  // Wide images are often full-hand captures. Used to trigger crop prompt.
  const ratio = imageMeta.width / imageMeta.height;
  return ratio > 1.1 || ratio < 0.7;
};
