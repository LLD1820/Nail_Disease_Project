import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5000';

export const fetchGradCam = async imageAsset => {
  const formData = new FormData();

  formData.append('image', {
    uri: imageAsset.uri,
    type: imageAsset.type || 'image/jpeg',
    name: imageAsset.fileName || 'nail_input.jpg',
  });

  const response = await axios.post(`${API_BASE_URL}/gradcam`, formData, {
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 20000,
  });

  return response.data;
};
