import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { listar, marcarComoLida, excluir } from '../services/notificacaoService';
import { prepararNotificacao } from '../utils/regrasNotificacao';

// cor do fundo do card e cor do título para cada tema
const THEMES = {
  late: { bg: '#FFD9D9', title: '#FF0000' },
  task: { bg: '#F5F9D6', title: '#FF8C00' },
  appointment: { bg: '#CFF3D9', title: '#0A7A0A' },
  warning: { bg: '#F5F9D6', title: '#FF8C00' },
};

const ICONES = {
  medicamento: '💊',
  estoque: '💊',
  tarefa: '📝',
  consulta: '🩺',
};

const DESTINOS = {
  medicamento: 'gerenciamento',
  estoque: 'gerenciamento',
  tarefa: 'gerenciamento',
  consulta: 'gerenciamento',
};

function NotificationCard({ item, onPress, onLongPress }) {
  const theme = THEMES[item.tema];
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.bg }, item.lida && styles.cardLida]}
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>{ICONES[item.tipo]}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: theme.title }]}>{item.titulo}</Text>
        {item.linhas.map((linha, i) => (
          <Text key={i} style={styles.cardLine}>
            {linha}
          </Text>
        ))}
        {item.alerta ? <Text style={styles.cardAlert}>{item.alerta}</Text> : null}
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function Notificacoes({ navegar }) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async (puxando = false) => {
    if (puxando) setAtualizando(true);
    else setCarregando(true);
    setErro('');
    try {
      const dados = await listar();
      const agora = new Date();
      setItens(dados.map((n) => prepararNotificacao(n, agora)));
    } catch (e) {
      setErro(e.message || 'Não foi possível carregar as notificações.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const voltar = () => navegar && navegar('gerenciamento');

  async function abrirItem(item) {
    if (!item.lida) {
      setItens((atual) => atual.map((n) => (n.id === item.id ? { ...n, lida: true } : n)));
      try {
        await marcarComoLida(item.id);
      } catch (e) {
        // se falhar, desfaz a marcação local
        setItens((atual) => atual.map((n) => (n.id === item.id ? { ...n, lida: false } : n)));
      }
    }
    if (navegar) navegar(DESTINOS[item.tipo]);
  }

  async function excluirItem(item) {
    try {
      await excluir(item.id);
      // remove da lista sem recarregar a tela toda
      setItens((atual) => atual.filter((n) => n.id !== item.id));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir a notificação.');
    }
  }

  function confirmarExclusao(item) {
    if (Platform.OS === 'web') {
      // Alert com botões não funciona no preview Web do Snack
      if (window.confirm('Deseja excluir esta notificação?')) excluirItem(item);
      return;
    }
    Alert.alert('Excluir notificação', 'Deseja excluir esta notificação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirItem(item) },
    ]);
  }

  function corpo() {
    if (carregando) {
      return (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#2B5280" />
          <Text style={styles.mensagem}>Carregando notificações...</Text>
        </View>
      );
    }

    if (erro) {
      return (
        <View style={styles.centro}>
          <Text style={styles.mensagemErro}>{erro}</Text>
          <TouchableOpacity style={styles.botao} onPress={() => carregar()}>
            <Text style={styles.botaoTexto}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NotificationCard item={item} onPress={abrirItem} onLongPress={confirmarExclusao} />
        )}
        contentContainerStyle={styles.list}
        refreshing={atualizando}
        onRefresh={() => carregar(true)}
        ListEmptyComponent={
          <View style={styles.centro}>
            <Text style={styles.vazioIcone}>🔔</Text>
            <Text style={styles.mensagem}>Nenhuma notificação por enquanto.</Text>
            <Text style={styles.dica}>Puxe a lista para baixo para atualizar.</Text>
          </View>
        }
        ListFooterComponent={
          itens.length > 0 ? (
            <Text style={styles.dica}>Segure um card para excluir.</Text>
          ) : null
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={voltar} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={styles.backBtn} />
      </View>

      {corpo()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 38, lineHeight: 40, color: '#000', marginTop: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#555555' },

  list: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 32, flexGrow: 1 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  cardLida: { opacity: 0.6 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconEmoji: { fontSize: 22 },

  cardBody: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardLine: { fontSize: 12, color: '#555555', lineHeight: 16 },
  cardAlert: { fontSize: 13, color: '#FF0000', marginTop: 8 },

  chevron: { fontSize: 30, color: '#555555', marginLeft: 8, marginTop: -4 },

  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  mensagem: { fontSize: 14, color: '#555555', textAlign: 'center', marginTop: 14 },
  mensagemErro: { fontSize: 14, color: '#D93025', textAlign: 'center', marginBottom: 18 },
  vazioIcone: { fontSize: 44 },
  dica: { fontSize: 11, color: '#8A8A8A', textAlign: 'center', marginTop: 8 },

  botao: {
    backgroundColor: '#2B5280',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  botaoTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});
