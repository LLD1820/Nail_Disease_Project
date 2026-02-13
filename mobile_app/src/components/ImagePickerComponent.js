import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const pickerConfig = {
  mediaType: 'photo',
  quality: 1,
  includeExtra: true,
};

const ImagePickerComponent = ({onImageSelected}) => {
  const handleResult = response => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Image Error', response.errorMessage || 'Unable to load image.');
      return;
    }

    const asset = response.assets?.[0];
    if (asset) {
      onImageSelected(asset);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => launchCamera(pickerConfig, handleResult)}>
        <Text style={styles.buttonText}>Capture with Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => launchImageLibrary(pickerConfig, handleResult)}>
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImagePickerComponent;
