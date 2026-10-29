import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Seta de voltar + identificação do paciente - por enquanto nome exemplo - pagina ainda não interligada nas outras telas dos coleguinhas.
export default function PatientHeader({ patientName, onBackPress }) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBackPress}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={styles.backButton}
      >
        <Text style={styles.arrow}>‹</Text>
      </Pressable>
      <View style={styles.badge}>
        <Text style={styles.patientName}>{patientName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  arrow: { color: '#1A1A1A', fontSize: 38, lineHeight: 42 },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  patientName: {
    fontFamily: 'Inter',
    color: '#222222',
    fontSize: 11,
    fontWeight: '600',
  },
});
