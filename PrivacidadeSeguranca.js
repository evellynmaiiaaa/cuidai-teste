// Importa o núcleo do React e os elementos nativos de interface e interação do React Native.
// Utiliza os hooks useState e useEffect para persistir a chave de biometria sem dependências externas.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';

const BIOMETRIA_STORAGE_KEY = '@cuidai_biometria';

export default function PrivacidadeSeguranca({ navigation }) {
  // Gerencia o estado de ativação do recurso de autenticação biométrica na tela.
  // Mantém um estado adicional de aviso visual para exibir os Termos de Uso no navegador Web.
  const [biometriaAtiva, setBiometriaAtiva] = useState(true);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  // Recupera a preferência de biometria gravada no dispositivo assim que a tela é montada.
  // Lê diretamente do armazenamento local para evitar falhas de importação de módulos.
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const salvo = localStorage.getItem(BIOMETRIA_STORAGE_KEY);
        if (salvo !== null) {
          setBiometriaAtiva(JSON.parse(salvo));
        }
      }
    } catch (e) {
      // Mantém o valor padrão true caso o armazenamento esteja indisponível.
    }
  }, []);

  // Alterna o estado da biometria e grava imediatamente a nova preferência no armazenamento.
  // Atualiza a variável booleana via função setter mantendo resposta visual instantânea.
  function handleToggleBiometria(novoValor) {
    setBiometriaAtiva(novoValor);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(BIOMETRIA_STORAGE_KEY, JSON.stringify(novoValor));
      }
    } catch (e) {
      // Ignora falhas de gravação em modo anônimo.
    }
  }

  return (
    <View style={styles.screen}>
      {/* Renderiza o cabeçalho superior fixo com ação de retorno à esquerda e título centralizado. */}
      {/* Equilibra o eixo horizontal utilizando um contêiner espaçador de mesma largura que o botão de voltar. */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Privacidade e segurança</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Agrupa os quatro cartões de configuração em um contêiner estático sem rolagem vertical. */}
      {/* Posiciona os itens com espaçamento uniforme através da propriedade gap do Flexbox. */}
      <View style={styles.mainContent}>
        {/* Renderiza o cartão interativo de alteração de senha com redirecionamento de rota. */}
        {/* Captura o toque via Pressable e aciona a navegação para a tela de recuperação de credenciais. */}
        <Pressable
          onPress={() =>
            navigation?.navigate
              ? navigation.navigate('RecuperarSenha')
              : Alert.alert('Navegação', 'Caminho da tela RecuperarSenha')
          }
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconSymbol}>🔒</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Alterar senha</Text>
            <Text style={styles.cardSubtitle}>Mantenha sua conta segura</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Exibe o cartão de configuração biométrica equipado com chave seletora nativa persistente. */}
        {/* Vincula o componente Switch ao estado biometriaAtiva e grava cada mudança no navegador. */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconSymbol}>☝️</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Biometria</Text>
            <Text style={styles.cardSubtitle}>
              Use sua digital para facilitar o acesso
            </Text>
          </View>
          <Switch
            value={biometriaAtiva}
            onValueChange={handleToggleBiometria}
            trackColor={{ false: '#D1D5DB', true: '#2B527B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Renderiza o cartão de gerenciamento de permissões e compartilhamento de dados do paciente. */}
        {/* Direciona o usuário para o módulo de cuidadores e níveis de acesso ao detectar o clique. */}
        <Pressable
          onPress={() =>
            navigation?.navigate
              ? navigation.navigate('CuidadoresPermissoes')
              : Alert.alert('Navegação', 'Caminho da tela CuidadoresPermissoes')
          }
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconSymbol}>☁️</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Compartilhamento de dados</Text>
            <Text style={styles.cardSubtitle}>
              Gerencie quem pode ver as informações
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Apresenta o cartão de consulta aos termos de uso e políticas de proteção de dados. */}
        {/* Alterna a exibição do quadro informativo de privacidade diretamente na tela ao clicar. */}
        <Pressable
          onPress={() => setMostrarTermos(!mostrarTermos)}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.iconSymbol}>📄</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Termos de uso e privacidade</Text>
            <Text style={styles.cardSubtitle}>
              Saiba como seus dados são protegidos
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Exibe um quadro informativo visível caso o usuário toque em Termos de uso e privacidade. */}
        {/* Substitui o Alert nativo para garantir funcionamento visual também no navegador Web. */}
        {mostrarTermos && (
          <View style={styles.termsBox}>
            <Text style={styles.termsText}>
              Seus dados médicos e de rotina são protegidos e compartilhados apenas com cuidadores autorizados.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Declara as regras visuais de posicionamento estático, bordas de cartões e hierarquia tipográfica.
// Compila os estilos nativos assegurando o bloqueio de rolagem e a fidelidade ao Guia de Estilo.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    height: 54,
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 28,
    gap: 14,
  },
  card: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.75,
    backgroundColor: '#F9FAFB',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconSymbol: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 24,
    color: '#374151',
    lineHeight: 26,
    marginLeft: 4,
  },
  termsBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  termsText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
});