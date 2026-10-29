import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';

// Define a matriz estática de rotas disponíveis no menu lateral, incluindo Perfil e Segurança.
// Associa o identificador de cada tela ao seu rótulo visual e ao símbolo gráfico correspondente.
const ITENS_MENU = [
  { id: 'TelaInicial', label: 'Início / Painel', icon: '⌂' },
  { id: 'AgendamentoRemedios', label: 'Cadastrar Medicamentos', icon: '💊' },
  { id: 'GerenciamentoTarefas', label: 'Cadastrar Tarefas', icon: '☰' },
  { id: 'MuralAvisos', label: 'Mural de Avisos', icon: '📢' },
  { id: 'ContatosEmergencia', label: 'Contatos de Emergência', icon: '📞' },
  { id: 'HistoricoSaude', label: 'Histórico de Saúde', icon: '♥' },
  { id: 'CadastroPaciente', label: 'Cadastrar Novo Paciente', icon: '✚' },
  { id: 'Agenda', label: 'Agenda de Consultas e Exames', icon: '📅' },
  { id: 'MeuPerfil', label: 'Meu Perfil', icon: '👤' },
  { id: 'PrivacidadeSeguranca', label: 'Privacidade e Segurança', icon: '🔒' },
];

export default function MenuAberto({ onClose, navigation }) {
  // Armazena qual item do menu está marcado como ativo na sessão atual do usuário.
  // Inicializa com 'TelaInicial' para exibir o destaque verde no primeiro item por padrão.
  const [itemAtivo, setItemAtivo] = useState('TelaInicial');

  // Fecha o menu lateral imediatamente e redireciona o fluxo para a rota selecionada.
  // Invoca a função onClose() antes de acionar o método navigate() para manter o histórico limpo.
  function handleNavegar(rotaId, label) {
    setItemAtivo(rotaId);

    if (onClose) {
      onClose();
    }

    if (rotaId === 'TelaInicial') {
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate(rotaId);
    } else {
      Alert.alert('Navegação', `Caminho da tela ${label}`);
    }
  }

  return (
    <View style={styles.screen}>
      {/* Renderiza o botão de três linhas no topo esquerdo para recolher o menu ao ser tocado. */}
      {/* Dispara a função onClose recebida da Tela Inicial para fechar o menu instantaneamente. */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            if (onClose) {
              onClose();
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Fechar menu"
          style={styles.menuButton}
        >
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </Pressable>
      </View>

      {/* Renderiza a coluna de opções de navegação mantendo o espaçamento lateral do protótipo. */}
      {/* Itera sobre a lista ITENS_MENU aplicando estilos condicionais ao item selecionado. */}
      <View style={styles.menuContainer}>
        {ITENS_MENU.map((item) => {
          const selecionado = itemAtivo === item.id;

          return (
            <View key={item.id}>
              <Pressable
                onPress={() => handleNavegar(item.id, item.label)}
                style={({ pressed }) => [
                  styles.menuItem,
                  selecionado && styles.menuItemSelected,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Text
                  style={[
                    styles.itemIcon,
                    selecionado && styles.itemIconSelected,
                  ]}
                >
                  {item.icon}
                </Text>
                <Text
                  style={[
                    styles.menuText,
                    selecionado && styles.menuTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>

              {!selecionado && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Define os estilos visuais fixos do menu lateral seguindo os tokens do Guia de Estilo.
// Compila as propriedades de posicionamento garantindo fidelidade às cores #E8F5F2 e #1A3C34.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  topBar: {
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  menuButton: {
    width: 34,
    height: 40,
    justifyContent: 'center',
  },
  menuLine: {
    width: 28,
    height: 2,
    backgroundColor: '#4B5563',
    marginVertical: 2.5,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    width: '85%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemSelected: {
    backgroundColor: '#E8F5F2',
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  itemIcon: {
    width: 26,
    fontSize: 16,
    textAlign: 'center',
    color: '#1F2937',
    marginRight: 10,
  },
  itemIconSelected: {
    color: '#2D6A5A',
  },
  menuText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: '#1F2937',
  },
  menuTextSelected: {
    fontWeight: '700',
    color: '#1A3C34',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 12,
    marginRight: 8,
  },
});