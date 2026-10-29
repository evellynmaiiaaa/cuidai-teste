import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotaoSecundario({ titulo, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.botao, style]} onPress={onPress}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E40AF', // Azul padrão
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  texto: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});