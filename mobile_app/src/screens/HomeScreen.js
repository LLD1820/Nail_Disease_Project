import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePickerComponent from '../components/ImagePickerComponent';
import {isWholeHandCandidate, preprocessImage} from '../utils/imageProcessing';
import {loadModel, runInference} from '../services/tfliteService';
import {fetchGradCam} from '../services/apiService';
import {buildHealthInsight} from '../utils/healthInsights';

const HomeScreen = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    loadModel()
      .then(() => setModelReady(true))
      .catch(error => Alert.alert('Model Error', error.message));
  }, []);

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Input Required', 'Please capture or select an image first.');
      return;
    }
    if (!modelReady) {
      Alert.alert('Model Loading', 'Model is still loading, please wait.');
      return;
    }

    setLoading(true);
    try {
      if (isWholeHandCandidate(selectedImage)) {
        Alert.alert('Whole Hand Image', 'A full hand image was detected. Nail-region auto/manual crop placeholder is enabled in preprocessing.');
      }

      const processedUri = await preprocessImage(selectedImage.uri);
      const inference = await runInference(processedUri);
      const insight = buildHealthInsight(inference?.topPrediction?.label);

      const networkState = await NetInfo.fetch();
      let xaiData = null;

      if (networkState.isConnected) {
        try {
          xaiData = await fetchGradCam(selectedImage);
        } catch (xaiError) {
          xaiData = {error: xaiError.message};
        }
      }

      navigation.navigate('Result', {
        image: selectedImage,
        prediction: inference.topPrediction,
        allPredictions: inference.allPredictions,
        insight,
        xaiData,
      });
    } catch (error) {
      Alert.alert('Analysis Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Real-Time Nail Disease Detection</Text>
      <Text style={styles.subheading}>Works offline for prediction, and online for explainability.</Text>

      <ImagePickerComponent onImageSelected={setSelectedImage} />

      {selectedImage?.uri ? <Image source={{uri: selectedImage.uri}} style={styles.preview} /> : null}

      <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>Analyze Nail Image</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subheading: {
    fontSize: 15,
    color: '#475569',
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: '#cbd5e1',
  },
  analyzeButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  analyzeText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;
