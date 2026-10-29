// Barra superior com botão "voltar", usada nas telas que não têm o próprio.
// Só envolve a tela (não altera o código dela).
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaComVoltar({ onBack, children }) {
  return (
    <View style={styles.raiz}>
      <SafeAreaView edges={['top']} style={styles.topo}>
        <View style={styles.barra}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.botao}
          >
            <Text style={styles.seta}>‹</Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <View style={styles.conteudo}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#FFFFFF' },
  topo: { backgroundColor: '#FFFFFF' },
  barra: { height: 44, justifyContent: 'center', paddingHorizontal: 12 },
  botao: { height: 40, justifyContent: 'center', alignSelf: 'flex-start' },
  seta: { fontSize: 38, lineHeight: 40, color: '#000', marginTop: -4 },
  conteudo: { flex: 1 },
});
