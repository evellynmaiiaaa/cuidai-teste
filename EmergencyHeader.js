import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Cabeçalho de contatos com menu, título e identificação da pessoa.
export default function EmergencyHeader({
  title = 'Contatos de emergência',
  personName = 'Dona Joana (80a)',
  onMenuPress,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onMenuPress}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
        style={styles.menuButton}
      >
        {/* As três linhas formam o ícone do menu lateral. */}
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.personName}>{personName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    width: 34,
    height: 40,
    justifyContent: 'center',
    gap: 5,
    marginRight: 10,
  },
  menuLine: { width: 28, height: 2, backgroundColor: '#4B5563' },
  title: {
    fontFamily: 'Inter',
    flex: 1,
    color: '#1A1A1A',
    fontSize: 20, 
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
    marginLeft: 6,
  },
  personName: {
    fontFamily: 'Inter',
    color: '#222222',
    fontSize: 10, 
    fontWeight: '600',
  },
});
