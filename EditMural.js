import React, { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditMural({
  navegar,
  avisoEditando,
  salvarEdicaoAviso,
}) {
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (avisoEditando) {
      setAviso(avisoEditando.texto || '');
    }
  }, [avisoEditando]);

  function cancelar() {
    navegar('mural');
  }

  function salvar() {
  salvarEdicaoAviso({
    autor: 'Você',
    texto: aviso,
  });
}

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <Appbar.Header
  mode="small"
  elevated={false}
  style={styles.header}
>
  <Appbar.BackAction onPress={cancelar} />
  <Appbar.Content title="Editar Aviso"
  titleStyle={{
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    color: '#111111',
  }} />
</Appbar.Header>
        <Text style={styles.subtitle}>
          Edite o aviso abaixo
        </Text>

        <View style={styles.separator} />


        <Text style={styles.label}>
          Aviso
        </Text>

        <TextInput
          style={styles.textInput}
          value={aviso}
          onChangeText={setAviso}
          multiline
          textAlignVertical="top"
          placeholder="Escreva um aviso..."
          placeholderTextColor="#929aaa"
        />

        {/* Botões */}

        <View style={styles.bottomButtons}>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelar}
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvar}
          >
            <Text style={styles.saveText}>
              Salvar
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
  flex: 1,
  backgroundColor: '#ffffff',
},

container: {
  flex: 1,
  backgroundColor: '#ffffff',
  paddingHorizontal: 16,
  paddingTop: 8,
},

  header: {
  backgroundColor: '#ffffff',
  marginHorizontal: -16,
  elevation: 0,
},

  subtitle: {
    fontSize: 13,
    color: '#727987',
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: '#dfe2e7',
    marginTop: 18,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151515',
    marginBottom: 7,
  },

  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#dce0e6',
    backgroundColor: '#f8f9fb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 14,
    color: '#263244',
  },

  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e2e6',
    paddingTop: 15,
    marginTop: 'auto',
    marginBottom: 8,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#ccd2db',
    backgroundColor: '#f5f6f8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#172033',
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 9,
    backgroundColor: '#2d5b88',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#ffffff',
    fontWeight: '700',
  },

});
