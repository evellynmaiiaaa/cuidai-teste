import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionButton from './ActionButton';

// Cartão de um contato normal da lista de emergência.
export default function ContactCard({
  name,
  relationship,
  phone,
  onCallPress,
  onEditPress,
  onDeletePress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          {name ? <Text style={styles.name}>{name}</Text> : null}
          {relationship ? (
            <Text style={styles.relationship}>{relationship}</Text>
          ) : null}
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <ActionButton title="Ligar" onPress={onCallPress} variant="primary" />
      </View>
      <View style={styles.actions}>
        <ActionButton title="Editar" onPress={onEditPress} variant="outline" />
        <ActionButton
          title="Excluir"
          onPress={onDeletePress}
          variant="dangerOutline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  info: { flex: 1 },
  name: {
    fontFamily: 'Inter',
    color: '#1A1A1A',
    fontSize: 16, 
    fontWeight: '700',
    marginBottom: 2,
  },
  relationship: {
    fontFamily: 'Inter',
    color: '#6B7280',
    fontSize: 13, 
    marginBottom: 2,
  },
  phone: {
    fontFamily: 'Inter',
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 9 },
});
