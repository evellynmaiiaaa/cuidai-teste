// Define a rota da coleção 'users' no json-server e as chaves de armazenamento local.
// Utiliza a mesma chave '@usuario' especificada no documento da Etapa 3 para integração com o Login.
const API_USERS_URL = 'http://localhost:3000/users';
const USER_STORAGE_KEY = '@usuario';

// Define os dados iniciais da persona Ana Clara caso nenhum usuário tenha feito login ainda.
// Garante que a tela Meu Perfil funcione imediatamente tanto isolada quanto após a autenticação.
const PERFIL_PADRAO = {
  id: 1,
  nome: 'Ana Clara',
  papel: 'Administradora',
  email: 'ana@email.com',
  telefone: '(11) 99999-9999',
  cargo: 'Filha',
  avatarUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
};

let memoriaPerfil = { ...PERFIL_PADRAO };

// Obtém os dados cadastrais do usuário logado na sessão atual ou retorna o perfil padrão.
// Consulta prioritariamente a chave '@usuario' gravada no armazenamento local do navegador.
export function obterPerfil() {
  try {
    if (typeof localStorage !== 'undefined') {
      const salvo = localStorage.getItem(USER_STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        return { ...PERFIL_PADRAO, ...parsed };
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(PERFIL_PADRAO));
    }
  } catch (e) {
    return memoriaPerfil;
  }
  return memoriaPerfil;
}

// Atualiza as informações do usuário imediatamente no armazenamento local sem bloquear a interface.
// Dispara a sincronização PATCH com o json-server em segundo plano evitando atrasos no botão.
export function atualizarPerfil(novosDados) {
  const atual = obterPerfil();
  const atualizado = { ...atual, ...novosDados };
  memoriaPerfil = atualizado;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(atualizado));
    }
  } catch (e) {
    // Mantém em memória caso o navegador bloqueie escrita em disco.
  }

  fetch(`${API_USERS_URL}/${atualizado.id || 1}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novosDados),
  }).catch(() => {});

  return atualizado;
}