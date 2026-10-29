// Importa a biblioteca base do React e os componentes estruturais nativos do React Native.
// Utiliza os hooks useState e useEffect para gerenciar estados, validações e edição de dados.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

// Importa o botão padronizado, o serviço de dados e os utilitários de cálculo de idade.
// Conecta a interface visual às cinco operações de persistência sem usar fetch direto na tela.
import ActionButton from '../components/ActionButton';
import * as pacienteService from '../services/pacienteService';
import {
  validarPaciente,
  formatarDataNascimento,
  calcularIdadePorData,
} from '../utils/validacoes';

export default function CadastroPaciente({ route, navigation }) {
  // Verifica se a rota recebeu um identificador de paciente para operar em modo de edição.
  // Caso não exista parâmetro id, o formulário atua na criação de um novo registro.
  const pacienteId = route?.params?.id || null;
  const editando = Boolean(pacienteId);

  // Armazena os valores digitados em cada um dos nove campos do perfil do paciente.
  // Substitui o antigo campo manual de idade pela data de nascimento com máscara DD/MM/AAAA.
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [condicaoMedica, setCondicaoMedica] = useState('');
  const [remedios, setRemedios] = useState('');
  const [atividades, setAtividades] = useState('');
  const [nomeMedico, setNomeMedico] = useState('');
  const [contatoEmergencia, setContatoEmergencia] = useState('');
  const [numeroEmergencia, setNumeroEmergencia] = useState('');
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  // Calcula dinamicamente a idade em tempo real conforme o usuário preenche a data de nascimento.
  // Exibe a prévia da idade no microtexto superior do campo caso a data digitada seja válida.
  const idadePrevia = calcularIdadePorData(dataNascimento);

  // Carrega automaticamente os dados do paciente caso a tela seja aberta em modo de edição.
  // Converte eventual idade antiga em data aproximada caso o registro não possua dataNascimento.
  useEffect(() => {
    if (editando) {
      pacienteService.buscarPorId(pacienteId).then((dados) => {
        if (!dados) return;
        setNome(dados.nome || '');
        if (dados.dataNascimento) {
          setDataNascimento(dados.dataNascimento);
        } else if (dados.idade) {
          const anoAprox = new Date().getFullYear() - Number(dados.idade);
          setDataNascimento(`01/01/${anoAprox}`);
        }
        setPeso(dados.peso ? String(dados.peso) : '');
        setCondicaoMedica(dados.condicaoMedica || '');
        setRemedios(dados.remedios || '');
        setAtividades(dados.atividades || '');
        setNomeMedico(dados.nomeMedico || '');
        setContatoEmergencia(dados.contatoEmergencia || '');
        setNumeroEmergencia(dados.numeroEmergencia || '');
      });
    }
  }, [pacienteId]);

  // Aplica a máscara DD/MM/AAAA automaticamente a cada dígito inserido pelo cuidador.
  // Mantém o estado dataNascimento formatado para validação imediata da regra RN01.
  function handleChangeDataNascimento(texto) {
    setDataNascimento(formatarDataNascimento(texto));
  }

  // Valida as regras de negócio (RN01, RN02, RN03) e envia o registro para o serviço de dados.
  // Grava tanto a dataNascimento quanto a idade calculada automaticamente no objeto do paciente.
  async function handleSalvar() {
    if (salvando) return;

    const dadosFormulario = {
      nome: nome.trim(),
      dataNascimento: dataNascimento.trim(),
      peso: peso.trim(),
      condicaoMedica: condicaoMedica.trim(),
      remedios: remedios.trim(),
      atividades: atividades.trim(),
      nomeMedico: nomeMedico.trim(),
      contatoEmergencia: contatoEmergencia.trim(),
      numeroEmergencia: numeroEmergencia.trim(),
      userId: 1,
    };

    const validacao = validarPaciente(dadosFormulario);
    if (!validacao.valido) {
      setErros(validacao.erros);
      return;
    }

    setErros({});

    try {
      setSalvando(true);
      const payload = {
        ...dadosFormulario,
        idade: validacao.idadeCalculada,
        peso: Number(String(peso).replace(',', '.')),
      };

      if (editando) {
        await pacienteService.atualizar(pacienteId, payload);
      } else {
        await pacienteService.criar(payload);
      }

      if (navigation?.goBack) {
        navigation.goBack();
      }
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do paciente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.screen}>
      {/* Renderiza o cabeçalho fixo com a seta de retorno à esquerda e o título centralizado. */}
      {/* Alterna dinamicamente o título caso o usuário esteja editando um perfil existente. */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {editando ? 'Editar paciente' : 'Cadastro do paciente'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Agrupa os nove campos equipados com microtextos de identificação sempre visíveis no topo. */}
      {/* Melhora a experiência de uso (UX) permitindo identificar cada campo mesmo quando preenchido. */}
      <View style={styles.formContainer}>
        {/* Campo 1: Nome completo do paciente */}
        <View>
          <View style={[styles.fieldBox, erros.nome && styles.fieldBoxError]}>
            <Text style={styles.microLabel}>Nome do paciente *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Dona Joana"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
            />
          </View>
          {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
        </View>

        {/* Campos 2 e 3 lado a lado: Data de Nascimento (com cálculo automático) e Peso */}
        <View style={styles.row}>
          <View style={styles.halfWrapper}>
            <View
              style={[
                styles.fieldBox,
                erros.dataNascimento && styles.fieldBoxError,
              ]}
            >
              <Text style={styles.microLabel}>
                {idadePrevia !== null && idadePrevia >= 0
                  ? `Nascimento * (${idadePrevia}a)`
                  : 'Data de Nasc. *'}
              </Text>
              <View style={styles.selectInnerRow}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={10}
                  value={dataNascimento}
                  onChangeText={handleChangeDataNascimento}
                />
                <Text style={styles.selectArrow}>📅</Text>
              </View>
            </View>
            {erros.dataNascimento && (
              <Text style={styles.errorText}>{erros.dataNascimento}</Text>
            )}
          </View>

          <View style={styles.halfWrapper}>
            <View style={[styles.fieldBox, erros.peso && styles.fieldBoxError]}>
              <Text style={styles.microLabel}>Peso (kg) *</Text>
              <View style={styles.selectInnerRow}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Ex: 62"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={peso}
                  onChangeText={setPeso}
                />
                <Text style={styles.selectArrow}>⌄</Text>
              </View>
            </View>
            {erros.peso && <Text style={styles.errorText}>{erros.peso}</Text>}
          </View>
        </View>

        {/* Campo 4: Condição médica principal */}
        <View>
          <View
            style={[
              styles.fieldBox,
              erros.condicaoMedica && styles.fieldBoxError,
            ]}
          >
            <Text style={styles.microLabel}>Condição médica *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Hipertensão, Diabetes"
              placeholderTextColor="#9CA3AF"
              value={condicaoMedica}
              onChangeText={setCondicaoMedica}
            />
          </View>
          {erros.condicaoMedica && (
            <Text style={styles.errorText}>{erros.condicaoMedica}</Text>
          )}
        </View>

        {/* Campo 5: Remédios e horários separados por vírgula */}
        <View style={styles.fieldBox}>
          <Text style={styles.microLabel}>
            Remédios e horários (separe por vírgula)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Insulina - 09:00, Losartana - 14:00"
            placeholderTextColor="#9CA3AF"
            value={remedios}
            onChangeText={setRemedios}
          />
        </View>

        {/* Campo 6: Atividades e exercícios diários */}
        <View style={styles.fieldBox}>
          <Text style={styles.microLabel}>
            Atividades / exercícios (separe por vírgula)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Aferir pressão, Caminhada 15min"
            placeholderTextColor="#9CA3AF"
            value={atividades}
            onChangeText={setAtividades}
          />
        </View>

        {/* Campo 7: Médico responsável */}
        <View style={styles.fieldBox}>
          <Text style={styles.microLabel}>Nome do Médico (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Dr. Carlos Eduardo"
            placeholderTextColor="#9CA3AF"
            value={nomeMedico}
            onChangeText={setNomeMedico}
          />
        </View>

        {/* Campos 8 e 9: Contato de emergência e Telefone de emergência */}
        <View>
          <View
            style={[
              styles.fieldBox,
              erros.contatoEmergencia && styles.fieldBoxError,
            ]}
          >
            <Text style={styles.microLabel}>
              Responsável / Contato de emergência *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ana Clara (Filha)"
              placeholderTextColor="#9CA3AF"
              value={contatoEmergencia}
              onChangeText={setContatoEmergencia}
            />
          </View>
          {erros.contatoEmergencia && (
            <Text style={styles.errorText}>{erros.contatoEmergencia}</Text>
          )}
        </View>

        <View>
          <View
            style={[
              styles.fieldBox,
              erros.numeroEmergencia && styles.fieldBoxError,
            ]}
          >
            <Text style={styles.microLabel}>
              Telefone do contato de emergência *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={numeroEmergencia}
              onChangeText={setNumeroEmergencia}
            />
          </View>
          {erros.numeroEmergencia && (
            <Text style={styles.errorText}>{erros.numeroEmergencia}</Text>
          )}
        </View>
      </View>

      {/* Posiciona os botões de Cancelar e Salvar lado a lado fixos na parte inferior da tela. */}
      {/* Altera o texto do botão principal durante o processamento para evitar cliques repetidos. */}
      <View style={styles.footer}>
        <View style={styles.buttonHalf}>
          <ActionButton
            title="Cancelar"
            variant="secondary"
            onPress={() => navigation?.goBack()}
          />
        </View>
        <View style={styles.buttonHalf}>
          <ActionButton
            title={salvando ? 'Salvando...' : 'Salvar'}
            variant="primary"
            onPress={handleSalvar}
          />
        </View>
      </View>
    </View>
  );
}

// Declara as regras visuais estáticas, os microtextos de UX e os estados de erro dos cartões.
// Dimensiona cada caixa com 46px de altura para acomodar rótulo + input mantendo a tela fixa.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backArrow: {
    color: '#1A1A1A',
    fontSize: 32,
    lineHeight: 34,
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 6,
  },
  fieldBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  fieldBoxError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF8F8',
  },
  microLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#2B527B',
    marginBottom: 1,
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#1A1A1A',
    padding: 0,
    margin: 0,
    height: 20,
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#E53935',
    marginTop: 1,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  halfWrapper: {
    flex: 1,
  },
  selectInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  selectInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#1A1A1A',
    padding: 0,
    margin: 0,
  },
  selectArrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  buttonHalf: {
    flex: 1,
  },
});