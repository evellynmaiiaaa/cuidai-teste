import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaregiversHeader from '../components/CaregiversHeader';
import FormField from '../components/FormField';
import ActionButton from '../components/ActionButton';
import * as cuidadorService from '../services/cuidadorService';
import { formatarTelefone } from '../utils/validacoes';
import { formatarCpf, validarCuidador } from '../utils/validacoesCuidador';
import { avisar } from '../utils/confirmar';

// O nível de acesso escolhido aqui define as permissões iniciais mas depois dá para ajustar na tela de edição.
export default function CuidadorFormScreen({ paciente, cuidadoresDoPaciente = [], onBack, onSaved }) {
  const [nome, setNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [registro, setRegistro] = useState('');
  const [papel, setPapel] = useState('visualizacao'); // vai começar com o menor acesso (ou seja visualização), por segurança
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (salvando) return;
    const encontrados = validarCuidador(
      { nome, parentesco, telefone, email, cpf, registroProfissional: registro },
      cuidadoresDoPaciente
    );
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setSalvando(true); // bloqueia o botão para evitar cadastro duplicado
    try {
      await cuidadorService.criar({
        pacienteId: paciente.id,
        nome: nome.trim(),
        parentesco: parentesco.trim(),
        telefone,
        email: email.trim().toLowerCase(),
        cpf,
        registroProfissional: registro.trim(),
        papel,
        permissoes: cuidadorService.PERMISSOES_POR_PAPEL[papel],
      });
      avisar('Pronto!', 'Cuidador adicionado com sucesso.');
      onSaved();
    } catch (e) {
      avisar('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <CaregiversHeader title="Adicionar cuidador" onBackPress={onBack} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitulo}>Preencha os campos abaixo</Text>

          <FormField label="Nome" value={nome} onChangeText={setNome}
            placeholder="Digite o nome completo" autoCapitalize="words" error={erros.nome} />
          <FormField label="Função ou parentesco" value={parentesco} onChangeText={setParentesco}
            placeholder="Ex.: Filha, Cuidador, Enfermeira" error={erros.parentesco} />
          <FormField label="Telefone" value={telefone}
            onChangeText={(t) => setTelefone(formatarTelefone(t))}
            placeholder="(11) 99999-9999" keyboardType="phone-pad" error={erros.telefone} />
          <FormField label="E-mail" value={email} onChangeText={setEmail}
            placeholder="nome@gmail.com" keyboardType="email-address"
            autoCapitalize="none" error={erros.email} />
          <FormField label="CPF" value={cpf} onChangeText={(t) => setCpf(formatarCpf(t))}
            placeholder="000.000.000-00" keyboardType="numeric" error={erros.cpf} />
          <FormField label="Nº de registro profissional" optional value={registro}
            onChangeText={setRegistro} placeholder="Ex.: COREN 123456"
            autoCapitalize="characters" error={erros.registroProfissional} />

          <Text style={styles.rotulo}>Nível de acesso</Text>
          <View style={styles.opcoes}>
            {cuidadorService.PAPEIS.map((p) => {
              const ativo = papel === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setPapel(p.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: ativo }}
                  style={[styles.opcao, ativo && styles.opcaoAtiva]}
                >
                  <Text style={[styles.opcaoTexto, ativo && styles.opcaoTextoAtivo]}>{p.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.rodape}>
          <ActionButton title={salvando ? 'Salvando...' : 'Salvar'} variant="wide" onPress={salvar} />
          <ActionButton title="Cancelar" variant="secondary" onPress={onBack} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  conteudo: { padding: 24, flexGrow: 1 },
  subtitulo: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6B7280', marginBottom: 16 },
  rotulo: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#1A1A1A', marginBottom: 8 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcao: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#2B527B', backgroundColor: '#FFFFFF' },
  opcaoAtiva: { backgroundColor: '#2B527B' },
  opcaoTexto: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#2B527B' },
  opcaoTextoAtivo: { color: '#FFFFFF' },
  rodape: { padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});
