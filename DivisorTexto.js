import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Linha horizontal com um texto no meio. Ex.: "ou entre com:" na tela de Login.
export default function DivisorTexto({ texto, style }) {
  return (
    <View style={[styles.linha, style]}>
      <View style={styles.traco} />
      <Text style={styles.texto}>{texto}</Text>
      <View style={styles.traco} />
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  traco: {
    flex: 1,
    height: 2,
    backgroundColor: '#9A9A9A',
  },
  texto: {
    marginHorizontal: 16,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#000000',
  },
});