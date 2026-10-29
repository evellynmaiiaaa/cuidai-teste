// Tela provisória para itens do menu que ainda não têm tela criada.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TelaComVoltar from './TelaComVoltar';

export default function TelaEmConstrucao({ titulo, onBack }) {
  return (
    <TelaComVoltar onBack={onBack}>
      <View style={styles.centro}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>Esta tela ainda será construída.</Text>
      </View>
    </TelaComVoltar>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#1A3C34', marginBottom: 8 },
  texto: { fontSize: 15, color: '#555' },
});
