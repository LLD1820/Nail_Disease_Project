import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const XaiScreen = ({route}) => {
  const {image, xaiData} = route.params;

  if (!xaiData || xaiData.error || !xaiData.heatmap_base64) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Grad-CAM unavailable (offline or backend error).</Text>
        {xaiData?.error ? <Text style={styles.subMessage}>{xaiData.error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explainable AI Heatmap</Text>
      <View style={styles.overlayContainer}>
        <Image source={{uri: image?.uri}} style={styles.baseImage} />
        <Image source={{uri: `data:image/png;base64,${xaiData.heatmap_base64}`}} style={styles.heatmap} />
      </View>
      <Text style={styles.caption}>Red/yellow zones indicate model-attended regions.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  overlayContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  baseImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  heatmap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.45,
    resizeMode: 'cover',
  },
  caption: {
    color: '#334155',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  subMessage: {
    color: '#64748b',
    textAlign: 'center',
  },
});

export default XaiScreen;
