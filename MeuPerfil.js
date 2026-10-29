// Importa a biblioteca base do React e os componentes nativos de interface do React Native.
// Utiliza os hooks useState e useEffect para carregar e persistir os dados reais do perfil.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

// Importa o botão padronizado, o serviço de perfil de usuário e o validador de regras de negócio.
// Sincroniza a tela Meu Perfil com a chave '@usuario' utilizada pela autenticação do projeto.
import ActionButton from '../components/ActionButton';
import * as perfilService from '../services/perfilService';
import { validarPerfil } from '../utils/validacoes';

export default function MeuPerfil({ navigation }) {
  // Armazena os dados cadastrais carregados do banco e controla o modo de bloqueio de edição.
  // Mantém o estado booleano 'mensagemSucesso' para exibir confirmação visual direta na tela.
  const [nome, setNome] = useState('Ana Clara');
  const [papel, setPapel] = useState('Administradora');
  const [avatarUri, setAvatarUri] = useState(
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'
  );
  const [email, setEmail] = useState('ana@email.com');
  const [telefone, setTelefone] = useState('(11) 99999-9999');
  const [cargo, setCargo] = useState('Filha');
  const [editando, setEditando] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  // Carrega os dados do usuário salvo no armazenamento local assim que a tela é aberta.
  // Preenche automaticamente nome, e-mail, telefone e cargo sem perder edições anteriores.
  useEffect(() => {
    const dados = perfilService.obterPerfil();
    if (dados) {
      setNome(dados.nome || 'Ana Clara');
      setPapel(dados.papel || 'Administradora');
      setEmail(dados.email || 'ana@email.com');
      setTelefone(dados.telefone || '(11) 99999-9999');
      setCargo(dados.cargo || 'Filha');
      if (dados.avatarUri) setAvatarUri(dados.avatarUri);
    }
  }, []);

  // Alterna imediatamente entre o modo de edição e o modo travado após validar os campos.
  // Grava os dados no serviço e exibe uma faixa verde de confirmação visual por 3 segundos.
  function handleAcaoPrincipal() {
    if (!editando) {
      setMensagemSucesso(false);
      setEditando(true);
      return;
    }

    const resultado = validarPerfil({ email, telefone, cargo });
    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }

    setErros({});
    perfilService.atualizarPerfil({
      email: email.trim(),
      telefone: telefone.trim(),
      cargo: cargo.trim(),
    });

    setEditando(false);
    setMensagemSucesso(true);

    setTimeout(() => {
      setMensagemSucesso(false);
    }, 3000);
  }

  return (
    <View style={styles.screen}>
      {/* Renderiza o cabeçalho fixo com o botão de voltar à esquerda e o título centralizado. */}
      {/* Utiliza uma View espaçadora à direita com a mesma largura do botão para equilibrar o eixo central. */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Meu perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Agrupa o conteúdo principal em um contêiner estático que impede rolagem ou deslocamento de eixo. */}
      {/* Distribui o bloco de avatar e os cartões de informação verticalmente usando Flexbox fixo. */}
      <View style={styles.mainContent}>
        {/* Apresenta a fotografia de perfil ampliada e o subtítulo atualizado conforme o cargo salvo. */}
        {/* Aplica dimensões de 120x120px com raio de borda circular de 60px. */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.userName}>{nome}</Text>
          <Text style={styles.userRole}>
            {cargo || 'Familiar'}  •  {papel}
          </Text>
        </View>

        {/* Exibe uma faixa verde de confirmação visual assim que o usuário clica em Salvar. */}
        {/* Garante feedback imediato tanto no navegador Web quanto nos dispositivos móveis. */}
        {mensagemSucesso && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>
              ✓ Informações do perfil salvas com sucesso!
            </Text>
          </View>
        )}

        {/* Contém a lista de cartões de informações que ficam travados até o acionamento do botão Editar. */}
        {/* Exibe mensagens de erro em vermelho abaixo do cartão caso a validação reprove algum dado. */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View
            style={[
              styles.fieldCard,
              editando && styles.fieldCardActive,
              erros.email && styles.fieldCardError,
            ]}
            pointerEvents={editando ? 'auto' : 'none'}
          >
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={setEmail}
              editable={editando}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}

          <View
            style={[
              styles.fieldCard,
              editando && styles.fieldCardActive,
              erros.telefone && styles.fieldCardError,
            ]}
            pointerEvents={editando ? 'auto' : 'none'}
          >
            <Text style={styles.fieldLabel}>Telefone</Text>
            <TextInput
              style={styles.fieldInput}
              value={telefone}
              onChangeText={setTelefone}
              editable={editando}
              keyboardType="phone-pad"
            />
          </View>
          {erros.telefone && (
            <Text style={styles.errorText}>{erros.telefone}</Text>
          )}

          <View
            style={[
              styles.fieldCard,
              editando && styles.fieldCardActive,
              erros.cargo && styles.fieldCardError,
            ]}
            pointerEvents={editando ? 'auto' : 'none'}
          >
            <Text style={styles.fieldLabel}>Cargo no cuidado</Text>
            <TextInput
              style={styles.fieldInput}
              value={cargo}
              onChangeText={setCargo}
              editable={editando}
            />
          </View>
          {erros.cargo && <Text style={styles.errorText}>{erros.cargo}</Text>}
        </View>
      </View>

      {/* Fixa o botão de ação na parte inferior da tela alterando seu rótulo conforme o estado atual. */}
      {/* Exibe 'Editar Perfil' quando os dados estão bloqueados e muda para 'Salvar' durante a edição. */}
      <View style={styles.footer}>
        <ActionButton
          title={editando ? 'Salvar' : 'Editar Perfil'}
          variant="wide"
          onPress={handleAcaoPrincipal}
        />
      </View>
    </View>
  );
}

// Declara as propriedades visuais de layout fixo, tipografia e estados de borda dos componentes.
// Compila as regras de estilo nativo garantindo que a tela permaneça travada nos eixos vertical e horizontal.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
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
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  userName: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  userRole: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  successBanner: {
    backgroundColor: '#F1FBF2',
    borderWidth: 1,
    borderColor: '#43A047',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  successBannerText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#43A047',
  },
  infoSection: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 10,
  },
  fieldCardActive: {
    borderColor: '#2B527B',
    backgroundColor: '#F9FAFB',
  },
  fieldCardError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF8F8',
  },
  fieldLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  fieldInput: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#3D3D3D',
    padding: 0,
    margin: 0,
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#E53935',
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
});