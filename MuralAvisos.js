import React, { useState } from 'react';


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MuralDeAvisos({
  navegar,
  avisos,
  adicionarAviso,
  excluirAviso,
  editarAviso,
}) {

    const [aviso, setAviso] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <View style={styles.topArea}>
        </View>

        <Text style={styles.title}>
          Mural de Avisos
        </Text>

        <View style={styles.noticeCreate}>

          <TextInput
            style={styles.noticeInput}
            placeholder="Escreva um aviso..."
            placeholderTextColor="#929aaa"
            multiline
            textAlignVertical="top"
            value={aviso}
            onChangeText={setAviso}
          />

          <TouchableOpacity
            style={styles.publishButton}
            onPress={() => {
              if (aviso.trim() !== '') {
                  adicionarAviso({
                  autor: 'Você',
                  texto: aviso,
                });

                setAviso('');
              }
            }}
          >
            <Text style={styles.publishText}>
              Publicar
            </Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.sectionTitle}>
          Avisos anteriores
        </Text>

        <ScrollView
  style={styles.noticeList}
  contentContainerStyle={styles.noticeListContent}
  showsVerticalScrollIndicator={false}
>
  {avisos.map((aviso, index) => (
    <View style={styles.noticeCard} key={index}>

      <View style={styles.noticeHeader}>

        <View style={styles.noticePerson}>

          <View style={styles.blueLine} />

          <Text style={styles.noticeName}>
            {aviso.autor}
          </Text>

        </View>

        <Text style={styles.noticeDate}>
          Agora
        </Text>

      </View>

      <Text style={styles.noticeDescription}>
        {aviso.texto}
      </Text>

      {aviso.autor === 'Você' && (
        <View style={styles.noticeButtons}>

          <TouchableOpacity
            style={styles.noticeEditButton}
            onPress={() => editarAviso(index)}
          >
            <Text style={styles.noticeEditText}>
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.noticeDeleteButton}
            onPress={() => excluirAviso(index)}
          >
            <Text style={styles.noticeDeleteText}>
              Excluir
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  ))}
</ScrollView>

        {/* Navegação temporária */}

        <View style={styles.navigation}>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() =>
              navegar('gerenciamento')
            }
          >
            <Text style={styles.navText}>
              Tarefas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() =>
              navegar('cadastro')
            }
          >
            <Text style={styles.navText}>
              Cadastro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.navSelected,
            ]}
            onPress={() =>
              navegar('mural')
            }
          >
            <Text style={styles.navSelectedText}>
              Mural
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

  topArea: {
    height: 70,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111111',
  },

  noticeCreate: {
    backgroundColor: '#fffceb',
    borderWidth: 1,
    borderColor: '#e7d98d',
    borderRadius: 8,
    padding: 11,
    marginTop: 15,
    marginBottom: 17,
  },

  noticeInput: {
    height: 71,
    backgroundColor: '#fffef8',
    borderWidth: 1,
    borderColor: '#d6bd54',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingTop: 9,
    fontSize: 13,
    color: '#333333',
  },

  publishButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#285884',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 8,
  },

  publishText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 10,
  },

  noticeList: {
  flex: 1,
  minHeight: 0,
},

noticeListContent: {
  paddingBottom: 10,
},

  noticeCard: {
    borderWidth: 1,
    borderColor: '#dfe2e7',
    borderRadius: 8,
    padding: 11,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    elevation: 1,
  },

  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  noticePerson: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  blueLine: {
    width: 3,
    height: 16,
    backgroundColor: '#285884',
    marginRight: 8,
    borderRadius: 2,
  },

  noticeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },

  noticeDate: {
    fontSize: 11,
    color: '#929aaa',
  },

  noticeDescription: {
    fontSize: 13,
    color: '#555555',
    marginTop: 8,
    lineHeight: 19,
  },

  noticeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  noticeEditButton: {
    borderWidth: 1,
    borderColor: '#174f8a',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  noticeEditText: {
    color: '#174f8a',
    fontSize: 12,
  },

  noticeDeleteButton: {
    borderWidth: 1,
    borderColor: '#ff2525',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  noticeDeleteText: {
    color: '#ff2525',
    fontSize: 12,
  },

  navigation: {
  flexDirection: 'row',
  height: 42,
  marginBottom: 25,
  gap: 5,
},

  navButton: {
    flex: 1,
    backgroundColor: '#eeeeee',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navSelected: {
    backgroundColor: '#2d5b88',
  },

  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },

  navSelectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});
