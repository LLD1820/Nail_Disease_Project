import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ResultCard from '../components/ResultCard';

const ResultScreen = ({route, navigation}) => {
  const {image, prediction, insight, xaiData} = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{uri: image?.uri}} style={styles.preview} />
      <ResultCard prediction={prediction} insight={insight} />

      <View style={styles.row}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.actionText}>Analyze Another</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondary]}
          onPress={() => navigation.navigate('Explainability', {image, xaiData})}>
          <Text style={styles.actionText}>View XAI</Text>
        </TouchableOpacity>
      </View>

      {!xaiData ? <Text style={styles.note}>Offline mode: XAI skipped gracefully.</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  preview: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    backgroundColor: '#cbd5e1',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#7c3aed',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  note: {
    color: '#64748b',
  },
});

export default ResultScreen;
