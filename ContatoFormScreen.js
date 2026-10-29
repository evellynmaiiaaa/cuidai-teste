import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientHeader from '../components/PatientHeader';
import FormField from '../components/FormField';
import ActionButton from '../components/ActionButton';
import * as contatoService from '../services/contatoService';
import { formatarTelefone, validarContato } from '../utils/validacoes';
import { avisar } from '../utils/confirmar';

// Mesma tela para criar e editar contatos: se recebeu o contato vai edição.
export default function ContatoFormScreen({ paciente, contato, contatosDoPaciente = [], onBack, onSaved }) {
  const editando = !!contato; // Define se estamos editando
  const [nome, setNome] = useState(contato?.nome || '');
  const [parentesco, setParentesco] = useState(contato?.parentesco || '');
  const [telefone, setTelefone] = useState(contato?.telefone || '');
  const [email, setEmail] = useState(contato?.email || '');
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (salvando) return;
    const encontrados = validarContato(
      { nome, parentesco, telefone, email },
      contatosDoPaciente,
      contato?.id
    );
    setErros(encontrados); // Aqui ta a função pra caso der erro de validação, o sistema deve interromper a execução. 
    if (Object.keys(encontrados).length > 0) return;

    const dados = {
      pacienteId: paciente.id,
      nome: nome.trim(),
      parentesco: parentesco.trim(),
      telefone,
      email: email.trim(),
    };

    setSalvando(true); // bloqueia o botão para evitar cadastro duplicado - caso a pessoa fique clicando varias vezes pra salvar
    try {
      if (editando) await contatoService.atualizar(contato.id, dados);
      else await contatoService.criar(dados);
      avisar('Pronto!', 'Contato salvo com sucesso.');
      onSaved();
    } catch (e) {
      avisar('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}> // LEMBRAR: SafeAreaView garante que o conteúdo da pag não ultrapasse as áreas normais da tela, por exemplo: aqueles botões do telefone pra sair da pagina.
      <PatientHeader patientName={`${paciente.nome} (${paciente.idade}a)`} onBackPress={onBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Cadastrar/Editar Contato</Text>
          <Text style={styles.subtitulo}>Preencha os campos abaixo</Text>

          <View style={styles.campos}>
            <FormField label="Nome" value={nome} onChangeText={setNome}
              placeholder="Digite o nome completo" autoCapitalize="words" error={erros.nome} />
            <FormField label="Função ou parentesco" value={parentesco} onChangeText={setParentesco}
              placeholder="Ex.: Filha, Médico Geriatra" error={erros.parentesco} />
            <FormField label="Telefone" value={telefone}
              onChangeText={(t) => setTelefone(formatarTelefone(t))}
              placeholder="(11) 99999-9999" keyboardType="phone-pad" error={erros.telefone} />
            <FormField label="E-mail" optional value={email} onChangeText={setEmail}
              placeholder="Digite o e-mail" keyboardType="email-address"
              autoCapitalize="none" error={erros.email} />
          </View>
        </ScrollView>

        <View style={styles.rodape}>
          <ActionButton title={salvando ? 'Salvando...' : 'Salvar'} onPress={salvar} variant="wide" />
          <ActionButton title="Cancelar" onPress={onBack} variant="secondary" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  conteudo: { padding: 20, flexGrow: 1 },
  titulo: { fontFamily: 'Inter', fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  subtitulo: { fontFamily: 'Inter', fontSize: 12, color: '#6B7280', marginBottom: 20 },
  campos: { marginTop: 4 },
  rodape: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});
