import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GerenciamentoTarefas({
  navegar,
  tarefas,
  setTarefas,
  editarTarefa,
}) {
  
  
  function excluirTarefa(index) {
  setTarefas(tarefas.filter((_, i) => i !== index));
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.topArea}>
        </View>

        <Text style={styles.title}>
          Gerenciamento de Tarefas
        </Text>

        <ScrollView
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          showsVerticalScrollIndicator={false}
        >

          {tarefas.map((tarefa, index) => (
            <View
              style={styles.taskCard}
              key={index}
            >

              <Text style={styles.taskName}>
                {tarefa.nome}
              </Text>

              {tarefa.descricao ? (
                <Text style={styles.taskDescription}>
                  {tarefa.descricao}
                </Text>
              ) : null}

              <Text style={styles.taskInfo}>
                {tarefa.frequencia} . {tarefa.horario}
              </Text>

              <Text style={styles.taskInfo}>
                Responsavel: {tarefa.responsavel}
              </Text>

              <View style={styles.cardButtons}>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editarTarefa(index)}
                >
                  <Text style={styles.editText}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirTarefa(index)}
                >
                <Text style={styles.deleteText}>
                  Excluir
                </Text>
              </TouchableOpacity>

              </View>

            </View>
          ))}

        </ScrollView>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navegar('cadastro')}
        >
          <Text style={styles.primaryButtonText}>
            + Adicionar Tarefa
          </Text>
        </TouchableOpacity>

        {/* Navegação temporária */}
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

    taskList: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 0,
  },

    taskListContent: {
    paddingBottom: 10,
  },

  taskCard: {
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

  taskName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 6,
  },

  taskDescription: {
  fontSize: 13,
  color: '#666666',
  marginBottom: 8,
  lineHeight: 18,
},

  taskInfo: {
    fontSize: 13,
    color: '#454545',
    marginBottom: 6,
  },

  cardButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 1,
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
