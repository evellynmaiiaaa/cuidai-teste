// Único lugar com a URL base. Nenhuma tela escreve URL diretamente.
export const BASE_URL = 'http://10.0.2.2:3000'; 

// O AuthContext (login) vai chamar setToken() quando o usuário entrar.
let token = null;
export const setToken = (novoToken) => {
  token = novoToken;
};

async function requisicao(metodo, rota, corpo) {
  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${rota}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (e) {
    throw new Error('Não foi possível conectar. Verifique sua internet.');
  }
  if (resposta.status === 401) throw new Error('Sua sessão expirou'); // 401 = inválido ou vencid0 - LEMBRAR que o token vale por apenas 1 hora.
  if (!resposta.ok) throw new Error('Algo deu errado. Tente novamente.'); // Qualquer outro erro do servidor (404, 500...).
  return resposta.status === 204 ? null : resposta.json();
}

export default {
  get: (rota) => requisicao('GET', rota),
  post: (rota, dados) => requisicao('POST', rota, dados),
  patch: (rota, dados) => requisicao('PATCH', rota, dados),
  delete: (rota) => requisicao('DELETE', rota),
};
