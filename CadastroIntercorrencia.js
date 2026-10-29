import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroIntercorrencia({
  navegar,
  adicionarIntercorrencia,
  salvarEdicaoIntercorrencia,
  intercorrenciaEditando,
}) {
  const [tipo, setTipo] = useState('Queda');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [acontecimento, setAcontecimento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pressao, setPressao] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [listaAberta, setListaAberta] = useState('');

  useEffect(() => {
  if (intercorrenciaEditando) {
    setTipo(intercorrenciaEditando.tipo || 'Queda');
    setData(intercorrenciaEditando.data || '');
    setHorario(intercorrenciaEditando.horario || '');
    setAcontecimento(intercorrenciaEditando.acontecimento || '');
    setDescricao(intercorrenciaEditando.descricao || '');
    setPressao(intercorrenciaEditando.pressao || '');
    setTemperatura(intercorrenciaEditando.temperatura || '');
  } else {
    setTipo('Queda');
    setData('');
    setHorario('');
    setAcontecimento('');
    setDescricao('');
    setPressao('');
    setTemperatura('');
  }
}, [intercorrenciaEditando]);
  

  const tipos = [
    'Queda',
    'Mal-estar',
    'Alteração de sinais vitais',
    'Alteração comportamental',
    'Outro',
  ];

  const acontecimentos = [
    'Paciente apresentou tontura ao levantar da cama.',
    'Paciente sofreu uma queda.',
    'Paciente apresentou mal-estar.',
    'Paciente apresentou alteração nos sinais vitais.',
    'Outro',
  ];

  function voltar() {
    navegar('intercorrencias');
  }
  function formatarPressao(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 5);

  if (numeros.length > 3) {
    return numeros.slice(0, 3) + '/' + numeros.slice(3);
  }

  return numeros;
}

function formatarTemperatura(texto) {
  let valor = texto.replace(/[^\d,]/g, '');

  const partes = valor.split(',');
  if (partes.length > 2) {
    valor = partes[0] + ',' + partes.slice(1).join('');
  }

  const [inteira, decimal] = valor.split(',');

  if (decimal !== undefined) {
    valor = inteira + ',' + decimal.slice(0, 1);
  }

  return valor;
}
function formatarData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);

  if (numeros.length > 4) {
    return numeros.slice(0, 2) + '/' +
      numeros.slice(2, 4) + '/' +
      numeros.slice(4);
  }

  if (numeros.length > 2) {
    return numeros.slice(0, 2) + '/' + numeros.slice(2);
  }

  return numeros;
}
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
    return horas + ':' + minutos + 'h';
  }

  return horas;
}
  function registrar() {
  if (
    !tipo ||
    !data.trim() ||
    !horario.trim() ||
    !acontecimento.trim()
  ) {
    Alert.alert(
      'Campos obrigatórios',
      'Preencha o tipo, a data, o horário e o que aconteceu.'
    );
    return;
  }

  const intercorrencia = {
    tipo,
    data,
    horario,
    acontecimento,
    descricao,
    pressao,
    temperatura,
  };

  if (intercorrenciaEditando) {
    salvarEdicaoIntercorrencia(intercorrencia);
  } else {
    adicionarIntercorrencia(intercorrencia);
  }
}
  function campoSelecao(titulo, valor, opcoes, campo) {
  return (
    <View style={styles.fieldContainer}>
      <TouchableOpacity
        style={styles.select}
        onPress={() =>
          setListaAberta(listaAberta === campo ? '' : campo)
        }
      >
        <Text style={styles.selectText}>
          {valor || titulo}
        </Text>

        <Text style={styles.selectArrow}>
          {listaAberta === campo ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {listaAberta === campo &&
        opcoes.map((opcao, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              if (campo === 'tipo') {
                setTipo(opcao);
              } else {
                setAcontecimento(opcao);
              }

              setListaAberta('');
            }}
          >
            <Text style={styles.optionText}>{opcao}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}
    return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Appbar.Header mode="small" elevated={false} style={styles.header}>
        <Appbar.BackAction onPress={voltar} />
        <Appbar.Content
          title={
            intercorrenciaEditando
              ? 'Editar Intercorrência'
              : 'Registrar Intercorrência'
          }
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.scroll}>
        <View style={styles.formContent}>
  <Text style={styles.label}>Tipo</Text>

  {campoSelecao('Tipo', tipo, tipos, 'tipo')}

  <Text style={styles.label}>Data e horário</Text>

  <View style={styles.linha}>
    <TextInput
      style={[styles.input, styles.dataInput]}
      placeholder="Ex: 22/03/2026"
      value={data}
      onChangeText={(texto) => setData(formatarData(texto))}
keyboardType="number-pad"
    />

    <TextInput
      style={[styles.input, styles.horarioInput]}
      placeholder="Ex:12:00h"
      value={horario}
      onChangeText={(texto) => setHorario(formatarHorario(texto))}
keyboardType="number-pad"
    />
  </View>

  <Text style={styles.label}>O que aconteceu?</Text>

  {campoSelecao(
    'O que aconteceu?',
    acontecimento,
    acontecimentos,
    'acontecimento'
  )}
  <Text style={styles.label}>Descreva o que aconteceu</Text>

<TextInput
  style={styles.descricaoInput}
  placeholder="Descreva detalhadamente o que aconteceu..."
  value={descricao}
  onChangeText={setDescricao}
  multiline
  textAlignVertical="top"
/>

  <Text style={styles.sectionTitle}>Sinais observados</Text>

  <Text style={styles.label}>Pressão arterial</Text>

  <TextInput
  style={styles.input}
  placeholder="Ex.: 120/60"
  value={pressao}
  onChangeText={(texto) => setPressao(formatarPressao(texto))}
/>

  <Text style={styles.label}>Temperatura</Text>

  <TextInput
  style={styles.input}
  placeholder="Ex.: 36,5 °C"
  value={temperatura}
  onChangeText={(texto) => setTemperatura(formatarTemperatura(texto))}
/>
</View>
            </ScrollView>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={registrar}
        >
          <Text style={styles.registerButtonText}>
            {intercorrenciaEditando
              ? 'Salvar alterações'
              : 'Registrar'}
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
    paddingHorizontal: 18,
  },
  header: {
  backgroundColor: '#ffffff',
  marginHorizontal: -18,
  elevation: 0,
  borderBottomWidth: 0,
},
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    color: '#333333',
  },
  scroll: {
    flex: 1,
  },
  formContent: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#151515',
    marginBottom: 8,
  },
  fieldContainer: {
  marginBottom: 16,
},
select: {
  minHeight: 42,
  borderWidth: 1,
  borderColor: '#a9a9a9',
  borderRadius: 6,
  paddingHorizontal: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
},
selectText: {
  fontSize: 14,
  color: '#263244',
  flex: 1,
},
selectArrow: {
  color: '#555555',
  marginLeft: 8,
},
option: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eeeeee',
  backgroundColor: '#f8f9fb',
},
optionText: {
  fontSize: 14,
  color: '#263244',
},
linha: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 16,
},
input: {
  height: 42,
  borderWidth: 1,
  borderColor: '#a9a9a9',
  borderRadius: 6,
  paddingHorizontal: 10,
  fontSize: 14,
  color: '#263244',
  marginBottom: 16,
},
dataInput: {
  flex: 1,
},
horarioInput: {
  width: '35%',
},
sectionTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#151515',
  marginTop: 8,
  marginBottom: 16,
},
bottomArea: {
  paddingTop: 12,
  paddingBottom: 8,
  backgroundColor: '#ffffff',
},
registerButton: {
  height: 46,
  backgroundColor: '#2d527d',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
registerButtonText: {
  color: '#ffffff',
  fontSize: 15,
  fontWeight: '700',
},
descricaoInput: {
  minHeight: 100,
  borderWidth: 1,
  borderColor: '#a9a9a9',
  borderRadius: 6,
  padding: 12,
  fontSize: 14,
  color: '#263244',
  backgroundColor: '#ffffff',
  marginBottom: 20,
},
});
