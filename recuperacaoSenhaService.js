/* ------------------------------------------------------------------
   src/services/recuperacaoSenhaService.js

   A tela NÃO faz fetch: ela só chama as funções daqui.
   (Arquivo separado do authService para não dar conflito com quem
   faz login e cadastro. Depois o grupo pode juntar os dois.)

   O json-server-auth NÃO tem rota de recuperação de senha, então por
   enquanto o envio do código é SIMULADO (USAR_MOCK = true):
     - e-mails cadastrados de teste: ana@email.com e teste@email.com
     - código válido para qualquer pedido: 123456
   Qualquer outro e-mail responde "E-mail não cadastrado".
------------------------------------------------------------------- */

// import api from './api';

const USAR_MOCK = true;
const SIMULAR_ERRO_REDE = false; // coloque true para testar a mensagem de rede

const CODIGO_TESTE = '123456';
const EMAILS_CADASTRADOS = ['ana@email.com', 'teste@email.com'];

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function criarErro(mensagem, tipo) {
  const e = new Error(mensagem);
  e.tipo = tipo;
  return e;
}

async function simularRede() {
  await esperar(800);
  if (SIMULAR_ERRO_REDE) {
    throw criarErro('Não foi possível conectar. Verifique sua internet.', 'REDE');
  }
}

const normalizar = (email) => email.trim().toLowerCase();

export async function solicitarCodigo(email) {
  if (USAR_MOCK) {
    await simularRede();
    if (!EMAILS_CADASTRADOS.includes(normalizar(email))) {
      throw criarErro('E-mail não cadastrado.', 'EMAIL_NAO_CADASTRADO');
    }
    console.log('Código de recuperação (simulado):', CODIGO_TESTE);
    return;
  }
  // API REAL: depende do que o grupo combinar (ver explicação no PR)
}

export async function verificarCodigo(email, codigo) {
  if (USAR_MOCK) {
    await simularRede();
    if (codigo !== CODIGO_TESTE) {
      throw criarErro('Código incorreto.', 'CODIGO_INVALIDO');
    }
    return;
  }
  // API REAL: ...
}

export async function redefinirSenha(email, codigo, novaSenha) {
  if (USAR_MOCK) {
    await simularRede();
    if (codigo !== CODIGO_TESTE) {
      throw criarErro('Código incorreto.', 'CODIGO_INVALIDO');
    }
    return;
  }
  // API REAL: ...
}
