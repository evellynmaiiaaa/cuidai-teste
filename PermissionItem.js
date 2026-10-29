import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Permissão da lista marcável.
export default function PermissionItem({
  label,
  checked = false,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {/* O quadrado muda de cor e mostra um visto (Lembrar: tem que ser que nem o check do whatsapp) quando checked é true. */}
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#9CA3AF', 
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2B527B', 
    borderColor: '#2B527B',
  },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', lineHeight: 17 },
  label: {
    fontFamily: 'Inter',
    flex: 1,
    color: '#374151', 
    fontSize: 13, 
  },
  pressed: { opacity: 0.7 },
});
