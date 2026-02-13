import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ResultCard = ({prediction, insight}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Prediction Result</Text>
      <Text style={styles.label}>Disease: {prediction?.label || 'N/A'}</Text>
      <Text style={styles.confidence}>Confidence: {((prediction?.confidence || 0) * 100).toFixed(2)}%</Text>

      <View style={styles.divider} />
      <Text style={styles.subtitle}>Body Health Insight</Text>
      <Text style={styles.insight}>{insight?.summary}</Text>
      <Text style={styles.disclaimer}>{insight?.disclaimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  title: {fontSize: 20, fontWeight: '700', color: '#0f172a'},
  label: {fontSize: 17, fontWeight: '600', color: '#1e293b'},
  confidence: {fontSize: 16, color: '#334155'},
  divider: {height: 1, backgroundColor: '#e2e8f0', marginVertical: 8},
  subtitle: {fontSize: 16, fontWeight: '700', color: '#0f172a'},
  insight: {fontSize: 14, color: '#475569', lineHeight: 20},
  disclaimer: {fontSize: 13, color: '#b91c1c', fontWeight: '600', marginTop: 6},
});

export default ResultCard;
