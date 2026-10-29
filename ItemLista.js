    import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemLista({ titulo, subtitulo, acao }) {
  return (
    <TouchableOpacity style={styles.container} onPress={acao}>
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
      </View>
      <Text style={styles.seta}>{">"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  subtitulo: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  seta: {
    fontSize: 18,
    color: '#CCCCCC',
    marginLeft: 10,
  },
});