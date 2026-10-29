import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ActionButton from './ActionButton';

// Uma linha da lista de cuidadores: foto (ou iniciais), nome, vínculo e botão Editar.
export default function CaregiverRow({ name, relationship, roleLabel, avatarUri, onEditPress }) {
  return (
    <View style={styles.row}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.initials}>{iniciais(name)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>
          {relationship}
          {relationship && roleLabel ? '  •  ' : ''}
          {roleLabel}
        </Text>
      </View>
      <ActionButton
        title="Editar"
        onPress={onEditPress}
        variant="outline"
        accessibilityLabel={`Editar permissões de ${name}`}
      />
    </View>
  );
}

// Primeira letra do nome e do sobrenome: Ana Clara -> AC
function iniciais(nome = '') {
  return nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase();
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: 'Inter_700Bold', color: '#2B527B', fontSize: 15 },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontFamily: 'Inter_700Bold', color: '#1F3A5F', fontSize: 14 },
  subtitle: { fontFamily: 'Inter_400Regular', color: '#2B527B', fontSize: 11, marginTop: 2 },
});
