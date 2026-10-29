
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function GerenciamentoIntercorrencias({
  navegar,
  intercorrencias,
  setIntercorrencias,
  editarIntercorrencia,
}) {

  function excluirIntercorrencia(index) {
    setIntercorrencias(
      intercorrencias.filter((_, i) => i !== index)
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.topArea} />

        <Text style={styles.title}>
          Gerenciamento de Intercorrências
        </Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >

          {intercorrencias.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Nenhuma intercorrência registrada.
            </Text>
          ) : (
            intercorrencias.map((intercorrencia, index) => (
              <View
                style={styles.card}
                key={index}
              >

                <Text style={styles.cardTitle}>
                  {intercorrencia.tipo}
                </Text>

                <Text style={styles.info}>
                  Data: {intercorrencia.data}
                </Text>

                <Text style={styles.info}>
                  Horário: {intercorrencia.horario}
                </Text>

                <Text style={styles.description}>
                  O que aconteceu:
                </Text>

                <Text style={styles.info}>
                  {intercorrencia.acontecimento}
                </Text>

                <Text style={styles.description}>
                  Descrição:
                </Text>

                <Text style={styles.info}>
                  {intercorrencia.descricao}
                </Text>

                {intercorrencia.pressao ? (
                  <Text style={styles.info}>
                    Pressão arterial: {intercorrencia.pressao}
                  </Text>
                ) : null}

                {intercorrencia.temperatura ? (
                  <Text style={styles.info}>
                    Temperatura: {intercorrencia.temperatura}
                  </Text>
                ) : null}

                <View style={styles.cardButtons}>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editarIntercorrencia(index)}
                  >
                    <Text style={styles.editText}>
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => excluirIntercorrencia(index)}
                  >
                    <Text style={styles.deleteText}>
                      Excluir
                    </Text>
                  </TouchableOpacity>

                </View>

              </View>
            ))
          )}

        </ScrollView>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navegar('cadastroIntercorrencia')}
        >
          <Text style={styles.primaryButtonText}>
            + Registrar Intercorrência
          </Text>
        </TouchableOpacity>

      {/* NAVEGAÇÂO TEMPORÁRIA */}
        <View style={styles.navigation}>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navegar('gerenciamento')}
          >
            <Text style={styles.navText}>
              Tarefas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navegar('cadastro')}
          >
            <Text style={styles.navText}>
              Cadastro
            </Text>
        
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navegar('mural')}
          >
            <Text style={styles.navText}>
              Mural
            </Text>
          </TouchableOpacity>

        </View>
        {/* NAVEGAÇÂO TEMPORÁRIA */}

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
    marginBottom: 5,
  },

  list: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 0,
  },

  listContent: {
    paddingBottom: 10,
  },

  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 30,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 7,
    padding: 15,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,

    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    fontWeight: '700',
    color: '#454545',
    marginTop: 4,
    marginBottom: 4,
  },

  info: {
    fontSize: 13,
    color: '#454545',
    marginBottom: 6,
    lineHeight: 18,
  },

  cardButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },

  editButton: {
    borderWidth: 1,
    borderColor: '#174f8a',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  editText: {
    color: '#174f8a',
    fontSize: 13,
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: '#ff2525',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  deleteText: {
    color: '#ff2525',
    fontSize: 13,
  },

  primaryButton: {
    height: 46,
    backgroundColor: '#2d5b88',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
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

  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },

});
