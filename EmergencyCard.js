import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionButton from './ActionButton';

// Cartão do SAMU, não tem como Editar e nem Excluir.
export default function EmergencyCard({ title, number, onCallPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.number}>{number}</Text>
      </View>
      <ActionButton title="Ligar" onPress={onCallPress} variant="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#C0392B',
    borderRadius: 12,
  },
  info: { flex: 1 },
  title: { fontFamily: 'Inter', color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  number: { fontFamily: 'Inter', color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
});
