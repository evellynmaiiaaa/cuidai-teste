import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Cabeçalho com seta pra VOLTAR e título da página de cuidadores.
export default function CaregiversHeader({
  title = 'Cuidadores e permissões',
  onBackPress,
}) {
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
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: { width: 34, height: 40, justifyContent: 'center' },
  arrow: { color: '#1A1A1A', fontSize: 32, lineHeight: 36 },
  title: {
    fontFamily: 'Inter',
    marginLeft: 8,
    color: '#1A1A1A',
    fontSize: 20, 
    fontWeight: '700',
  },
});
