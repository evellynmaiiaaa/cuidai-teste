import React from 'react';
import { StyleSheet, Text } from 'react-native';

// Título reutilizável para uma seção. O texto pode ser passado como children.
export default function SectionTitle({ children = 'Pessoas que têm acesso' }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter',
    color: '#212121',
    fontSize: 14, 
    fontWeight: '700',
  },
});
