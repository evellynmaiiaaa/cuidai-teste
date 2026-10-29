// Navegação do app (arquivo novo, não altera nenhuma tela).
// Mantém uma PILHA de telas: avançar empilha, "voltar" desempilha.
// Aceita os dois estilos que as telas já usam:
//   - navegar('nome') / setTelaAtual('nome')  -> estilo do App.js
//   - navigation.navigate('Nome') / navigation.goBack() -> estilo MenuAberto, MeuPerfil etc.
import { useState, useCallback, useMemo, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

// Nomes usados pelo menu lateral / telas  ->  nome da rota no App.js
const ALIAS = {
  TelaInicial: 'inicio',
  GerenciamentoTarefas: 'gerenciamento',
  MuralAvisos: 'mural',
  ContatosEmergencia: 'contatos',
  CuidadoresPermissoes: 'cuidadores',
  RecuperarSenha: 'recuperarSenha',
  AgendamentoRemedios: 'medicamentos',
  CadastroPaciente: 'cadastroPaciente',
  Agenda: 'agenda',
  MeuPerfil: 'meuPerfil',
  PrivacidadeSeguranca: 'privacidade',
  Notificacoes: 'notificacoes',
  HistoricoSaude: 'historicoSaude',
};

const resolver = (nome) => ALIAS[nome] || nome;

export default function useNavegacao(rotaInicial) {
  const [pilha, setPilha] = useState([{ nome: rotaInicial, params: null }]);

  // Ir para uma tela. Se a tela já está na pilha (ex.: botão "voltar" que aponta
  // para a tela de origem), desempilha até ela em vez de empilhar de novo.
  const irPara = useCallback((destino, params = null) => {
    const nome = resolver(destino);
    setPilha((atual) => {
      const topo = atual[atual.length - 1];
      if (topo.nome === nome) {
        return params ? [...atual.slice(0, -1), { nome, params }] : atual;
      }
      if (!params) {
        const i = atual.map((r) => r.nome).lastIndexOf(nome);
        if (i >= 0) return atual.slice(0, i + 1);
      }
      return [...atual, { nome, params }];
    });
  }, []);

  // Voltar para a tela anterior.
  const voltar = useCallback(() => {
    setPilha((atual) => (atual.length > 1 ? atual.slice(0, -1) : atual));
  }, []);

  // Zera o histórico (ex.: depois do login, para o "voltar" não cair na tela de login).
  const reiniciar = useCallback((destino) => {
    setPilha([{ nome: resolver(destino), params: null }]);
  }, []);

  // Botão voltar físico do Android.
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pilha.length > 1) {
        voltar();
        return true;
      }
      return false; // na primeira tela, deixa o Android sair do app
    });
    return () => sub.remove();
  }, [pilha, voltar]);

  // Objeto no formato que as telas "navigation" esperam.
  const navigation = useMemo(() => ({ navigate: irPara, goBack: voltar }), [irPara, voltar]);

  const topo = pilha[pilha.length - 1];

  return {
    telaAtual: topo.nome,
    paramsAtuais: topo.params,
    setTelaAtual: irPara,
    voltar,
    reiniciar,
    navigation,
  };
}
