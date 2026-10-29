import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function ActionButton({
  title,
  onPress,
  variant = 'primary',
  accessibilityLabel,
}) {
  // Associando cada variação ao estilo do botão e texto.
  const variants = {
    primary: [styles.primary, styles.primaryText],
    secondary: [styles.secondary, styles.secondaryText],
    outline: [styles.outline, styles.outlineText],
    dangerOutline: [styles.dangerOutline, styles.dangerOutlineText],
    light: [styles.light, styles.lightText],
    wide: [styles.wide, styles.wideText],
  };

  // Se a variação não for reconhecida, usa o estilo primary.
  const [buttonStyle, textStyle] = variants[variant] || variants.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [
        styles.base,
        buttonStyle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Estilos de todos os botões
  base: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 15, // Ação / botão
    fontWeight: '600',
    textAlign: 'center',
  },
  // Botão azul para: Ligar/Salvar
  primary: {
    backgroundColor: '#2B527B',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  // Botão branco com contorno cinza para: Cancelar.
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryText: {
    color: '#555555',
  },
  // Botão branco com contorno azul-acinzentado para Editar.
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2B527B',
  },
  outlineText: {
    fontSize: 12, 
    fontWeight: '500',
    color: '#2B527B',
  },
  // Botão branco com contorno vermelho para: Excluir.
  dangerOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C0392B',
  },
  dangerOutlineText: {
    fontSize: 12, 
    fontWeight: '500',
    color: '#C0392B',
  },
  // Botão branco que pode aparecer sobre um cartão colorido.
  light: {
    backgroundColor: '#FFFFFF',
  },
  lightText: {
    color: '#DC2626',
  },
  // Botão para a ação no rodapé
  wide: {
    minHeight: 44,
    width: '100%',
    borderRadius: 9,
    backgroundColor: '#2B527B',
  },
  wideText: {
    color: '#FFFFFF',
  },
  // Efeito visual do botão pressionado.
  pressed: {
    opacity: 0.75,
  },
});
