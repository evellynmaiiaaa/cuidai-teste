import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Campo reutilizável com rótulo e caixa de texto. A tela que usar o componente vai controlar o valor via value/onChangeText.
export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  optional = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  maxLength,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {optional ? <Text style={styles.optional}> (opcional)</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
        maxLength={maxLength}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: {
    fontFamily: 'Inter',
    color: '#1A1A1A',
    fontSize: 14, 
    fontWeight: '600',
    marginBottom: 6,
  },
  optional: {
    color: '#6B7280',
    fontWeight: '400',
  },
  inputError: { borderColor: '#C0392B' },
  error: { fontFamily: 'Inter', color: '#C0392B', fontSize: 12, marginTop: 4 },
  input: {
    fontFamily: 'Inter',
    minHeight: 42,
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    color: '#3D3D3D',
    fontSize: 14, 
  },
});
