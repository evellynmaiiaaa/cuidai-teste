import React, { useState } from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import LoginScreen from './src/screens/LoginScreen';
import RecuperarSenha from './src/screens/RecuperarSenha';

import GerenciamentoTarefas from './src/screens/GerenciamentoTarefas';
import CadastroTarefa from './src/screens/CadastroTarefa';
import MuralDeAvisos from './src/screens/MuralAvisos';
import EditMural from './src/screens/EditMural';

// --- Contatos de emergência ---
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ContatosScreen from './src/screens/ContatosScreen';
import ContatoFormScreen from './src/screens/ContatoFormScreen';
import * as contatoService from './src/services/contatoService';

// --- Cuidadores e permissões ---
import CuidadoresFlow from './src/screens/CuidadoresFlow';

// --- Ligação entre as telas (navegação) ---
import useNavegacao from './src/navigation/useNavegacao';
import TelaComVoltar from './src/navigation/TelaComVoltar';
import TelaEmConstrucao from './src/navigation/TelaEmConstrucao';
import TelaInicial from './src/screens/TelaInicial';
import CadastroPaciente from './src/screens/CadastroPaciente';
import Agenda from './src/screens/Agenda';
import AgendamentoRemedios from './src/screens/Medicamentos';
import MeuPerfil from './src/screens/MeuPerfil';
import PrivacidadeSeguranca from './src/screens/PrivacidadeSeguranca';
import Notificacoes from './src/screens/Notificacoes';
import GerenciamentoIntercorrencias from './src/screens/GerenciamentoIntercorrencias';
import CadastroIntercorrencia from './src/screens/CadastroIntercorrencia';

// Paciente FAKE. Depois eu vou trocar o código pra pegar o nome e a idade do paciente cadastrado na tela do colega - LEMBRAR DE CONFIRMAR COM A PROFESSORA SE ISSO É NECESSARIO NESSA ETAPA.
const PACIENTE_FAKE = { id: 1, nome: 'Dona Joana', idade: 80 };

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

// Navegação em pilha: o app abre no Login; "voltar" desempilha (ver src/navigation).
const { telaAtual, paramsAtuais, setTelaAtual, voltar, reiniciar, navigation } = useNavegacao('login');
const [indiceEditando, setIndiceEditando] = useState(null);
const [indiceAvisoEditando, setIndiceAvisoEditando] = useState(null);

const [tarefas, setTarefas] = useState([
  {
    nome: 'Auxiliar na alimentação',
    frequencia: 'Diariamente',
    horario: '08:00',
    responsavel: 'Ana',
  },
  {
    nome: 'Auxiliar no banho',
    frequencia: 'Dias alternados',
    horario: '10:00',
    responsavel: 'Sem responsável definido',
  },
  {
    nome: 'Administrar medicamentos',
    frequencia: 'Diariamente',
    horario: '07:00 e 19:00',
    responsavel: 'Carlos',
  },
  {
    nome: 'Fisioterapia',
    frequencia: 'Semanal · Segunda e Quarta',
    horario: '14:00',
    responsavel: 'Maria',
  },
]);

const [avisos, setAvisos] = useState([
  {
    autor: 'Carlos',
    texto: 'Lembrete: reunião amanhã às 10:00.',
  },
  {
    autor: 'Ana',
    texto: 'Deixei pão fresco na cozinha.',
  },
]);

// --- Intercorrências: estados ---
const [intercorrencias, setIntercorrencias] = useState([]);
const [indiceIntercorrenciaEditando, setIndiceIntercorrenciaEditando] = useState(null);

function adicionarIntercorrencia(nova) {
  setIntercorrencias([...intercorrencias, nova]);
  setTelaAtual('intercorrencias');
}

function editarIntercorrencia(index) {
  setIndiceIntercorrenciaEditando(index);
  setTelaAtual('cadastroIntercorrencia');
}

function salvarEdicaoIntercorrencia(atualizada) {
  setIntercorrencias(
    intercorrencias.map((item, index) =>
      index === indiceIntercorrenciaEditando ? atualizada : item
    )
  );
  setIndiceIntercorrenciaEditando(null);
  setTelaAtual('intercorrencias');
}

// Depois do login o usuário cai na Tela Inicial e o histórico é zerado.
function navegarLogin(destino) {
  if (destino === 'gerenciamento') {
    reiniciar('inicio');
  } else {
    setTelaAtual(destino);
  }
}

// --- Contatos de emergência: estados ---
const [tela, setTela] = useState('lista'); // 'lista' | 'form'
const [contatoEmEdicao, setContatoEmEdicao] = useState(null);
const [contatosAtuais, setContatosAtuais] = useState([]);

function navegar(tela) {
  setTelaAtual(tela);
}

function adicionarTarefa(novaTarefa) {
  setTarefas([...tarefas, novaTarefa]);
  setTelaAtual('gerenciamento');
}

function salvarEdicaoTarefa(tarefaAtualizada) {
  setTarefas(
    tarefas.map((tarefa, index) =>
      index === indiceEditando
        ? tarefaAtualizada
        : tarefa
    )
  );

  setIndiceEditando(null);
  setTelaAtual('gerenciamento');
}

function adicionarAviso(novoAviso) {
  setAvisos([...avisos, novoAviso]);
}
function excluirAviso(index) {
  setAvisos(avisos.filter((_, i) => i !== index));
}

function editarAviso(index) {
  setIndiceAvisoEditando(index);
  setTelaAtual('editMural');
}

function salvarEdicaoAviso(avisoAtualizado) {
  setAvisos(
    avisos.map((aviso, index) =>
      index === indiceAvisoEditando
        ? avisoAtualizado
        : aviso
    )
  );

  setIndiceAvisoEditando(null);
  setTelaAtual('mural');
}

function editarTarefa(index) {
  setIndiceEditando(index);
  setTelaAtual('cadastro');
}

// --- Contatos de emergência: abrir o formulário ---
const abrirForm = async (contato = null) => {
  // Busca a lista atual só para checar telefone duplicado (RN04).
  setContatosAtuais(await contatoService.listar(PACIENTE_FAKE.id));
  setContatoEmEdicao(contato);
  setTela('form');
};

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#2d5b88"
        />
      </View>
    );
  }

  // O SafeAreaProvider envolve todas as telas, porque várias usam o
  // SafeAreaView do react-native-safe-area-context.
  // Telas que não têm botão "voltar" próprio ganham uma barra com a seta (TelaComVoltar).
  const ROTAS_SEM_VOLTAR = ['gerenciamento', 'mural', 'agenda', 'medicamentos', 'intercorrencias'];
  const conteudo = renderizarTela();
  return (
    <SafeAreaProvider>
      {ROTAS_SEM_VOLTAR.includes(telaAtual) ? (
        <TelaComVoltar onBack={voltar}>{conteudo}</TelaComVoltar>
      ) : (
        conteudo
      )}
    </SafeAreaProvider>
  );

  // Navegação entre as telas
  function renderizarTela() {
  switch (telaAtual) {

    // --- Acesso ---
    case 'login':
      return <LoginScreen navegar={navegarLogin} />;

    case 'recuperarSenha':
      return <RecuperarSenha navegar={navegar} />;

    case 'gerenciamento':
      return (
        <GerenciamentoTarefas
          navegar={navegar}
          tarefas={tarefas}
          setTarefas={setTarefas}
          editarTarefa={editarTarefa}
        />
    );
    
    case 'cadastro':
      return (
        <CadastroTarefa
          navegar={navegar}
          adicionarTarefa={adicionarTarefa}
          salvarEdicaoTarefa={salvarEdicaoTarefa}
          tarefaEditando={
          indiceEditando !== null ? tarefas[indiceEditando] : null}   
        />
    );

    case 'mural':
  return (
    <MuralDeAvisos
      navegar={navegar}
      avisos={avisos}
      adicionarAviso={adicionarAviso}
      excluirAviso={excluirAviso}
      editarAviso={editarAviso}
    />
  );

    case 'editMural':
  return (
    <EditMural
      navegar={navegar}
      avisoEditando={
        indiceAvisoEditando !== null
          ? avisos[indiceAvisoEditando]
          : null
      }
      salvarEdicaoAviso={salvarEdicaoAviso}
    />
  );

    // --- Contatos de emergência (para abrir: navegar('contatos')) ---
    case 'contatos':
  return (
    <SafeAreaProvider>
      {tela === 'lista' ? (
        <ContatosScreen
          paciente={PACIENTE_FAKE}
          onBack={voltar}
          onAdd={() => abrirForm()}
          onEdit={(c) => abrirForm(c)}
        />
      ) : (
        <ContatoFormScreen
          paciente={PACIENTE_FAKE}
          contato={contatoEmEdicao}
          contatosDoPaciente={contatosAtuais}
          onBack={() => setTela('lista')}
          onSaved={() => setTela('lista')}
        />
      )}
    </SafeAreaProvider>
  );

    // --- Cuidadores e permissões (para abrir: navegar('cuidadores')) ---
    case 'cuidadores':
  return (
    <SafeAreaProvider>
      <CuidadoresFlow
        paciente={PACIENTE_FAKE}
        onBack={voltar}
      />
    </SafeAreaProvider>
  );

    // --- Telas ligadas ao menu lateral ---
    case 'inicio':
      return <TelaInicial navigation={navigation} />;

    case 'cadastroPaciente':
      return (
        <CadastroPaciente
          route={{ params: paramsAtuais }}
          navigation={navigation}
        />
      );

    case 'agenda':
      return <Agenda />;

    case 'medicamentos':
      return <AgendamentoRemedios />;

    case 'meuPerfil':
      return <MeuPerfil navigation={navigation} />;

    case 'privacidade':
      return <PrivacidadeSeguranca navigation={navigation} />;

    case 'historicoSaude':
      return <TelaEmConstrucao titulo="Histórico de Saúde" onBack={voltar} />;

    // A tela de Notificações volta sempre para a anterior.
    case 'notificacoes':
      return <Notificacoes navegar={() => voltar()} />;

    // --- Intercorrências ---
    case 'intercorrencias':
      return (
        <GerenciamentoIntercorrencias
          navegar={navegar}
          intercorrencias={intercorrencias}
          setIntercorrencias={setIntercorrencias}
          editarIntercorrencia={editarIntercorrencia}
        />
      );

    case 'cadastroIntercorrencia':
      return (
        <CadastroIntercorrencia
          navegar={navegar}
          adicionarIntercorrencia={adicionarIntercorrencia}
          salvarEdicaoIntercorrencia={salvarEdicaoIntercorrencia}
          intercorrenciaEditando={
            indiceIntercorrenciaEditando !== null
              ? intercorrencias[indiceIntercorrenciaEditando]
              : null
          }
        />
      );

default:
  return (
    <GerenciamentoTarefas
      navegar={navegar}
    />
  );
}
  }
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});