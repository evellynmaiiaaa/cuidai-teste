import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Cabecalho({ titulo, acaoVoltar }) {
  return (
    <View style={styles.container}>
      {/* Botão de voltar simples (pode ser substituído por um ícone depois) */}
      <TouchableOpacity onPress={acaoVoltar} style={styles.botaoVoltar}>
        <Text style={styles.textoVoltar}>{"< Voltar"}</Text>
      </TouchableOpacity>
      
      <Text style={styles.titulo}>{titulo}</Text>
      
      {/* View vazia para manter o título centralizado */}
      <View style={styles.espacoDireita} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 20,
  },
  botaoVoltar: {
    padding: 5,
    width: 60,
  },
  textoVoltar: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  espacoDireita: {
    width: 60, 
  },
});