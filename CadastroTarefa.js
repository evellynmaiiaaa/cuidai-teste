import React, { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroTarefa({
  navegar,
  adicionarTarefa,
  salvarEdicaoTarefa,
  tarefaEditando,
}) {
  const [frequencia, setFrequencia] = useState('Diariamente');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState('');
  const [responsavel, setResponsavel] = useState('');
  useEffect(() => {
  if (tarefaEditando) {
    setNome(tarefaEditando.nome || '');
    setDescricao(tarefaEditando.descricao || '');
    setFrequencia(tarefaEditando.frequencia || 'Diariamente');
    setHorario(tarefaEditando.horario || '');
    setResponsavel(tarefaEditando.responsavel || '');
  }
}, [tarefaEditando]);

function formatarHorario(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 4);

  let horas = numeros.slice(0, 2);
  let minutos = numeros.slice(2, 4);

  if (horas.length === 2 && Number(horas) > 23) {
    horas = '23';
  }

  if (minutos.length === 2 && Number(minutos) > 59) {
    minutos = '59';
  }

  if (numeros.length > 2) {
    return horas + ':' + minutos;
  }

  return horas;
}

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <Appbar.Header
  mode="small"
  elevated={false}
  style={styles.header}
>
  <Appbar.BackAction onPress={voltar} />
  <Appbar.Content title="Cadastrar/Editar Tarefa"
  titleStyle={{
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    color: '#111111',
  }} />
</Appbar.Header>

        <Text style={styles.subtitle}>
          Preencha os campos abaixo
        </Text>

        <View style={styles.separator} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >

          {/* Nome */}

          <Text style={styles.label}>
            Nome da tarefa
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Lavar a louça"
            placeholderTextColor="#929aaa"
            value={nome}
            onChangeText={setNome}
          />

          {/* Descrição */}

          <Text style={styles.label}>
            Descricao
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder="Descreva a tarefa (opcional)"
            placeholderTextColor="#929aaa"
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />

          {/* Frequência */}

          <Text style={styles.label}>
            Frequencia
          </Text>

          <View style={styles.frequencyRow}>

            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequencia === 'Diariamente' &&
                  styles.frequencySelected,
              ]}
              onPress={() =>
                setFrequencia('Diariamente')
              }
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequencia === 'Diariamente' &&
                    styles.frequencyTextSelected,
                ]}
              >
                Diariamente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequencia === 'Dias alternados' &&
                  styles.frequencySelected,
              ]}
              onPress={() =>
                setFrequencia('Dias alternados')
              }
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequencia === 'Dias alternados' &&
                    styles.frequencyTextSelected,
                ]}
              >
                Dias alternados
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.frequencyButton,
                frequencia === 'Semanal' &&
                  styles.frequencySelected,
              ]}
              onPress={() =>
                setFrequencia('Semanal')
              }
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequencia === 'Semanal' &&
                    styles.frequencyTextSelected,
                ]}
              >
                Semanal
              </Text>
            </TouchableOpacity>

          </View>

          {/* Horário */}

          <Text style={styles.label}>
            Horario previsto
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 08:00"
            value={horario}
            onChangeText={(texto) => setHorario(formatarHorario(texto))}
            keyboardType="number-pad"
          />

          {/* Responsável */}

          <Text style={styles.label}>
            Responsavel sugerido (opcional)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Ana"
            value={responsavel}
            onChangeText={setResponsavel}
          />
          </ScrollView>

        {/* Botões inferiores */}

        <View style={styles.bottomButtons}>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              navegar('gerenciamento')
            }
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
             style={styles.saveButton}
             onPress={() => {
              const tarefaAtualizada = {
                nome: nome,
                descricao: descricao,
                frequencia: frequencia,
                horario: horario,
                responsavel: responsavel,
              };

              if (tarefaEditando) {
                salvarEdicaoTarefa(tarefaAtualizada);
              } else {
                adicionarTarefa(tarefaAtualizada);
              }
            }}
          >
          <Text style={styles.saveText}>
            Salvar
          </Text>
        </TouchableOpacity>

        </View>

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
            style={[
              styles.navButton,
              styles.navSelected,
            ]}
            onPress={() =>
              navegar('cadastro')
            }
          >
            <Text style={styles.navSelectedText}>
              Cadastro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() =>
              navegar('mural')
            }
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

  formContent: {
    paddingBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#151515',
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#dce0e6',
    backgroundColor: '#f8f9fb',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#263244',
    marginBottom: 16,
  },

  descriptionInput: {
    height: 80,
    paddingTop: 12,
  },

  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 17,
  },

  frequencyButton: {
    borderWidth: 1,
    borderColor: '#cdd3dc',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },

  frequencySelected: {
    backgroundColor: '#2d5b88',
    borderColor: '#2d5b88',
  },

  frequencyText: {
    fontSize: 13,
    color: '#4b5563',
  },

  frequencyTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },

  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e2e6',
    paddingTop: 15,
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
