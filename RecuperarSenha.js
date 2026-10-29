import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  solicitarCodigo,
  verificarCodigo,
  redefinirSenha,
} from '../services/recuperacaoSenhaService';
import {
  validarEmail,
  validarCodigo,
  validarNovaSenha,
  TAMANHO_CODIGO,
  SEGUNDOS_REENVIO,
  MAX_TENTATIVAS_CODIGO,
} from '../utils/validacoesRecuperacao';

const LOGO = require('../assets/logo.png');

const COLORS = {
  primary: '#2B5280',
  text: '#222222',
  muted: '#555555',
  link: '#0A84FF',
  success: '#1FAF5A',
  border: '#DADADA',
  boxBg: '#F2F2F2',
  boxBorder: '#E3E3E3',
  white: '#FFFFFF',
  error: '#D93025',
};

/* ---------------------------- Componentes ---------------------------- */

function Logo({ size = 110 }) {
  return <Image source={LOGO} style={{ width: size, height: size }} resizeMode="contain" />;
}

function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backBtn} hitSlop={12}>
      <Text style={styles.backIcon}>‹</Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({ title, onPress, loading }) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={loading} // evita enviar duas vezes
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function LinkText({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8}>
      <Text style={styles.link}>{title}</Text>
    </TouchableOpacity>
  );
}

function MensagemErro({ texto }) {
  return texto ? <Text style={styles.error}>{texto}</Text> : null;
}

function Screen({ children, onBack }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {onBack ? <BackButton onPress={onBack} /> : <View style={{ height: 40 }} />}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------ Telas ------------------------------ */

// 1) Esqueceu a senha
function ForgotScreen({ email, setEmail, aviso, onSent, onLogin }) {
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const msg = validarEmail(email);
    if (msg) return setErro(msg);
    setErro('');
    setCarregando(true);
    try {
      await solicitarCodigo(email);
      setCarregando(false);
      onSent();
    } catch (e) {
      setCarregando(false);
      setErro(e.message);
    }
  }

  return (
    <Screen>
      <View style={styles.logoWrap}>
        <Logo />
      </View>

      <Text style={styles.title}>Esqueceu sua senha?</Text>
      <Text style={styles.subtitleCenter}>
        Digite seu e-mail cadastrado para{'\n'}receber o código de recuperação.
      </Text>
      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, erro && styles.inputErro]}
        placeholder="exemplo@email.com"
        placeholderTextColor="#8A8A8A"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setErro('');
        }}
      />
      <MensagemErro texto={erro} />

      <PrimaryButton title="ENVIAR CÓDIGO" onPress={enviar} loading={carregando} />
      <View style={styles.linkWrap}>
        <LinkText title="Voltar para o login" onPress={onLogin} />
      </View>
    </Screen>
  );
}

// 2) Código enviado
function SentScreen({ email, onContinue, onLogin }) {
  return (
    <Screen>
      <View style={styles.logoWrap}>
        <Logo />
      </View>

      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>

      <Text style={styles.title}>Código enviado!</Text>
      <Text style={styles.subtitleCenter}>
        Enviamos um código de recuperação{'\n'}para o seu e-mail.
      </Text>

      <TextInput style={[styles.input, { marginTop: 24 }]} value={email} editable={false} />

      <PrimaryButton title="CONTINUAR" onPress={onContinue} />
      <View style={styles.linkWrap}>
        <LinkText title="Voltar para o login" onPress={onLogin} />
      </View>
    </Screen>
  );
}

// 3) Verificar código
function CodeScreen({ email, onBack, onVerified, onTooMany, onLogin }) {
  const vazio = Array(TAMANHO_CODIGO).fill('');
  const [code, setCode] = useState(vazio);
  const [seconds, setSeconds] = useState(SEGUNDOS_REENVIO);
  const [tentativas, setTentativas] = useState(0);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (text, i) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    setErro('');
    if (digit && i < TAMANHO_CODIGO - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !code[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  async function continuar() {
    const codigo = code.join('');
    const msg = validarCodigo(codigo);
    if (msg) return setErro(msg);

    setErro('');
    setCarregando(true);
    try {
      await verificarCodigo(email, codigo);
      setCarregando(false);
      onVerified(codigo);
    } catch (e) {
      setCarregando(false);
      if (e.tipo === 'CODIGO_INVALIDO') {
        const total = tentativas + 1;
        setTentativas(total);
        if (total >= MAX_TENTATIVAS_CODIGO) {
          onTooMany(); // RN08
          return;
        }
        const restam = MAX_TENTATIVAS_CODIGO - total;
        setErro(`${e.message} Restam ${restam} ${restam === 1 ? 'tentativa' : 'tentativas'}.`);
        setCode(vazio);
        refs.current[0]?.focus();
      } else {
        setErro(e.message);
      }
    }
  }

  async function reenviar() {
    setErro('');
    try {
      await solicitarCodigo(email);
      setSeconds(SEGUNDOS_REENVIO);
      setCode(vazio);
      refs.current[0]?.focus();
    } catch (e) {
      setErro(e.message);
    }
  }

  const ss = String(Math.max(seconds, 0)).padStart(2, '0');

  return (
    <Screen onBack={onBack}>
      <View style={styles.logoWrap}>
        <Logo />
      </View>

      <Text style={[styles.title, { marginTop: 36 }]}>Verificar código</Text>
      <Text style={styles.subtitleCenter}>Digite o código que enviamos para o seu e-mail.</Text>

      <View style={styles.codeRow}>
        {code.map((c, i) => (
          <TextInput
            key={i}
            ref={(r) => (refs.current[i] = r)}
            style={[styles.codeBox, erro && styles.inputErro]}
            value={c}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>
      <View style={{ alignItems: 'center' }}>
        <MensagemErro texto={erro} />
      </View>

      <View style={styles.resendWrap}>
        {seconds > 0 ? (
          <Text style={styles.link}>Reenviar código (00:{ss})</Text>
        ) : (
          <LinkText title="Reenviar código" onPress={reenviar} />
        )}
      </View>

      <PrimaryButton title="CONTINUAR" onPress={continuar} loading={carregando} />
      <View style={styles.linkWrap}>
        <LinkText title="Voltar para o login" onPress={onLogin} />
      </View>
    </Screen>
  );
}

// 4) Nova senha
function NewPasswordScreen({ email, codigo, onBack, onSuccess }) {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function alterar() {
    const validacao = validarNovaSenha(pass, confirm);
    if (validacao) {
      setErros(validacao);
      return;
    }
    setErros({});
    setErroGeral('');
    setCarregando(true);
    try {
      await redefinirSenha(email, codigo, pass);
      setCarregando(false);
      onSuccess();
    } catch (e) {
      setCarregando(false);
      setErroGeral(e.message);
    }
  }

  return (
    <Screen onBack={onBack}>
      <View style={styles.logoWrap}>
        <Logo size={100} />
      </View>

      <Text style={styles.titleLeft}>Nova senha</Text>
      <Text style={styles.subtitleLeft}>Crie uma nova senha para acessar sua conta.</Text>

      <Text style={[styles.label, { marginTop: 28 }]}>Nova senha</Text>
      <TextInput
        style={[styles.input, erros.senha && styles.inputErro]}
        placeholder="Digite sua nova senha"
        placeholderTextColor="#8A8A8A"
        secureTextEntry
        value={pass}
        onChangeText={(t) => {
          setPass(t);
          setErros({ ...erros, senha: null });
        }}
      />
      <MensagemErro texto={erros.senha} />

      <Text style={[styles.label, { marginTop: 20 }]}>Confirmar senha</Text>
      <TextInput
        style={[styles.input, erros.confirmacao && styles.inputErro]}
        placeholder="Confirme sua nova senha"
        placeholderTextColor="#8A8A8A"
        secureTextEntry
        value={confirm}
        onChangeText={(t) => {
          setConfirm(t);
          setErros({ ...erros, confirmacao: null });
        }}
      />
      <MensagemErro texto={erros.confirmacao} />
      <MensagemErro texto={erroGeral} />

      <View style={{ height: 28 }} />
      <PrimaryButton title="ALTERAR SENHA" onPress={alterar} loading={carregando} />
    </Screen>
  );
}

// Senha alterada
function DoneScreen({ onLogin }) {
  return (
    <Screen>
      <View style={styles.logoWrap}>
        <Logo />
      </View>
      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.title}>Senha alterada!</Text>
      <Text style={styles.subtitleCenter}>Agora você já pode entrar com a sua nova senha.</Text>
      <View style={{ height: 28 }} />
      <PrimaryButton title="IR PARA O LOGIN" onPress={onLogin} />
    </Screen>
  );
}

/* ------------------------------ Fluxo ------------------------------ */

export default function RecuperarSenha({ navegar }) {
  const [step, setStep] = useState('forgot');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [aviso, setAviso] = useState('');

  const goLogin = () => navegar && navegar('login'); // troque 'login' pelo nome da tela de login

  switch (step) {
    case 'sent':
      return (
        <SentScreen email={email} onContinue={() => setStep('code')} onLogin={goLogin} />
      );
    case 'code':
      return (
        <CodeScreen
          email={email}
          onBack={() => setStep('sent')}
          onVerified={(c) => {
            setCodigo(c);
            setAviso('');
            setStep('newPassword');
          }}
          onTooMany={() => {
            setAviso('Muitas tentativas erradas. Peça um novo código.');
            setStep('forgot');
          }}
          onLogin={goLogin}
        />
      );
    case 'newPassword':
      return (
        <NewPasswordScreen
          email={email}
          codigo={codigo}
          onBack={() => setStep('code')}
          onSuccess={() => setStep('done')}
        />
      );
    case 'done':
      return <DoneScreen onLogin={goLogin} />;
    default:
      return (
        <ForgotScreen
          email={email}
          setEmail={setEmail}
          aviso={aviso}
          onSent={() => {
            setAviso('');
            setStep('sent');
          }}
          onLogin={goLogin}
        />
      );
  }
}

/* ----------------------------- Estilos ----------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

  backBtn: { height: 40, justifyContent: 'center', alignSelf: 'flex-start' },
  backIcon: { fontSize: 38, lineHeight: 40, color: '#000', marginTop: -4 },

  logoWrap: { alignItems: 'center', marginTop: 24, marginBottom: 24 },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitleCenter: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
    fontWeight: '600',
  },
  aviso: {
    fontSize: 12,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 14,
    fontWeight: '600',
  },
  titleLeft: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 20 },
  subtitleLeft: { fontSize: 12, color: COLORS.muted, marginTop: 8, fontWeight: '600' },

  label: { fontSize: 13, color: COLORS.text, marginTop: 36, marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  inputErro: { borderColor: COLORS.error },

  button: {
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  linkWrap: { alignItems: 'center', marginTop: 28 },
  link: {
    color: COLORS.link,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  checkCircle: {
    alignSelf: 'center',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1.5,
    borderColor: '#1B5E3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  checkMark: { fontSize: 46, color: COLORS.success, fontWeight: '700' },

  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28 },
  codeBox: {
    width: 44,
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.boxBg,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    fontSize: 20,
    color: COLORS.text,
  },
  resendWrap: { alignItems: 'center', marginTop: 12, marginBottom: 12 },

  error: { color: COLORS.error, fontSize: 12, marginTop: 8 },
});
