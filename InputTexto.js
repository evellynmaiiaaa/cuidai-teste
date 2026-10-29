import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Campo de texto reutilizável.
// - alternarSenha: mostra o ícone de olho para exibir/ocultar a senha (usa secureTextEntry).
// - Qualquer outra prop do TextInput (autoCapitalize, autoComplete...) é repassada via ...rest.
export default function InputTexto({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  alternarSenha = false,
  style,
  ...rest
}) {
  const [senhaOculta, setSenhaOculta] = useState(true);
  const ocultar = alternarSenha ? senhaOculta : secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.caixa, style]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#5F5F5F"
          secureTextEntry={ocultar}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          {...rest}
        />
        {alternarSenha && (
          <TouchableOpacity
            onPress={() => setSenhaOculta(!senhaOculta)}
            style={styles.olho}
            hitSlop={8}
            accessibilityLabel={senhaOculta ? 'Mostrar senha' : 'Ocultar senha'}
          >
            <Ionicons
              name={senhaOculta ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#4A4A4A"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  olho: {
    paddingHorizontal: 12,
  },
});