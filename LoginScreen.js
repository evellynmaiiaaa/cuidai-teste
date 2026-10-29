import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import InputTexto from '../components/InputTexto';
import BotaoPrimario from '../components/BotaoPrimario';
import DivisorTexto from '../components/DivisorTexto';
import { validarEmail } from '../utils/validacoesRecuperacao';

const LOGO = require('../assets/logo.png');

const COLORS = {
  primary: '#6E86A1', // botão ENTRAR
  brand: '#2F4E7A', // nome "CuidAí"
  text: '#4A4A4A',
  border: '#D0D0D0',
  white: '#FFFFFF',
  error: '#C0392B',
  google: '#DB4437',
  facebook: '#1877F2',
};

export default function LoginScreen({ navegar }) {
  // 1) ESTADO
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // 2) AÇÕES
  function entrar() {
    const erroEmail = validarEmail(email);
    if (erroEmail) return setErro(erroEmail);
    if (!senha) return setErro('Informe sua senha.');

    setErro('');
    // TODO: chamar o authService (json-server-auth) e salvar o token com setToken() do api.js
    navegar('gerenciamento');
  }

  function criarConta() {
    // TODO: navegar('cadastroConta') quando a tela de criação de conta existir
    console.log('Ir para criação de conta');
  }

  function entrarCom(provedor) {
    // TODO: login social (Google/Facebook)
    console.log('Login com', provedor);
  }

  // 3) TELA
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.cabecalho}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            <Text style={styles.marca}>CuidAí</Text>
          </View>

          <Text style={styles.titulo}>Login</Text>

          <InputTexto
            placeholder="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErro('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.campo}
          />
          <InputTexto
            placeholder="Senha"
            value={senha}
            onChangeText={(t) => {
              setSenha(t);
              setErro('');
            }}
            alternarSenha
            style={styles.campo}
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <TouchableOpacity
            onPress={() => navegar('recuperarSenha')}
            style={styles.esqueceu}
            hitSlop={8}
          >
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <BotaoPrimario titulo="ENTRAR" onPress={entrar} style={styles.botao} />

          <DivisorTexto texto={'ou\nentre com:'} style={styles.divisor} />

          <View style={styles.sociais}>
            <TouchableOpacity onPress={() => entrarCom('google')} accessibilityLabel="Entrar com Google">
              <Ionicons name="logo-google" size={64} color={COLORS.google} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => entrarCom('facebook')} accessibilityLabel="Entrar com Facebook">
              <Ionicons name="logo-facebook" size={72} color={COLORS.facebook} />
            </TouchableOpacity>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Não tem conta? </Text>
            <TouchableOpacity onPress={criarConta} hitSlop={8}>
              <Text style={styles.link}>Cadastre-se.</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 4) ESTILOS
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  cabecalho: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  logo: { width: 72, height: 72 },
  marca: {
    flex: 1,
    textAlign: 'center',
    marginRight: 72, // mesma largura do logo, para o nome ficar centralizado na tela
    fontFamily: 'Inter_500Medium',
    fontSize: 30,
    color: COLORS.brand,
  },

  titulo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 48,
  },

  campo: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 6,
    minHeight: 56,
  },

  erro: { fontFamily: 'Inter_400Regular', color: COLORS.error, fontSize: 13 },

  esqueceu: { alignSelf: 'flex-end', marginTop: 24, marginBottom: 22 },
  link: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.text,
    textDecorationLine: 'underline',
  },

  botao: { backgroundColor: COLORS.primary, borderRadius: 6, minHeight: 56 },

  divisor: { marginTop: 36 },

  sociais: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 80,
    marginTop: 48,
  },

  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  rodapeTexto: { fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.text },
});