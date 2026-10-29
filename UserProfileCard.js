import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// Cartão de identificação da pessoa que está tendo a permissão editadas.
// Se avatarUri(LEMBRAR QUE AVATARURI É A FOTO) não for encontrada, mostra as iniciais -ou seja nome e sobrenome-  dentro de um círculo.
export default function UserProfileCard({
  name,
  relationship,
  role,
  initials,
  avatarUri,
}) {
  return (
    <View style={styles.card}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials || getInitials(name)}</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>
          {relationship}
          {relationship && role ? <Text>  •  </Text> : null}
          {role}
        </Text>
      </View>
    </View>
  );
}

// Pega a primeira letra do nome e sobrenome: Roberto Silva - RS.
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', 
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: 'Inter',
    color: '#2B527B', 
    fontSize: 15, 
    fontWeight: '700',
  },
  details: { flex: 1, marginLeft: 12 },
  name: {
    fontFamily: 'Inter',
    color: '#1A1A1A',
    fontSize: 16, 
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: 'Inter',
    color: '#6B7280',
    fontSize: 13, 
    marginTop: 3,
  },
});
