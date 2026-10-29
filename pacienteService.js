// Importa o cliente HTTP centralizado para realizar chamadas padronizadas à API REST.
// Segue a arquitetura de alta coesão e baixo acoplamento exigida no Passo 4 da Etapa 3.
import api from './api';

const STORAGE_KEY = '@cuidai_pacientes';
const PACIENTE_ATIVO_KEY = '@cuidai_paciente_ativo_id';
const STATUS_KEY_PREFIX = '@cuidai_status_painel_';

// Define o registro inicial com data de nascimento para cálculo dinâmico de idade.
// Se o usuário excluir este registro, ele não volta mais a aparecer como dado fantasma.
const PACIENTE_INICIAL = [
  {
    id: 1,
    nome: 'Dona Joana',
    dataNascimento: '15/05/1946',
    idade: 80,
    peso: 62,
    condicaoMedica: 'Hipertensão arterial',
    remedios: 'Losartana 50mg - 08:00, Dipirona 20gt - 12:00',
    atividades: 'Aferir pressão, Comprar fraldas, Agendar fisioterapia',
    nomeMedico: 'Dr. Carlos Eduardo',
    contatoEmergencia: 'Ana Clara (Filha)',
    numeroEmergencia: '(11) 99999-9999',
    userId: 1,
  },
];

let memoriaCache = null;

// Lê a coleção de pacientes respeitando listas vazias caso todos tenham sido excluídos.
// Inicializa o armazenamento com a Dona Joana exclusivamente no primeiro acesso (chave null).
function lerBancoLocal() {
  try {
    if (typeof localStorage !== 'undefined') {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo !== null) {
        return JSON.parse(salvo);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PACIENTE_INICIAL));
      return [...PACIENTE_INICIAL];
    }
  } catch (e) {
    if (memoriaCache !== null) return memoriaCache;
  }
  if (memoriaCache === null) memoriaCache = [...PACIENTE_INICIAL];
  return memoriaCache;
}

// Sincroniza a coleção de pacientes no armazenamento local após alterações cadastrais.
// Preserva inclusive o array vazio ([]) quando o último paciente é removido pelo usuário.
function salvarBancoLocal(lista) {
  memoriaCache = lista;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }
  } catch (e) {
    // Mantém os dados em memória durante a sessão ativa.
  }
}

// Guarda o identificador de qual paciente está selecionado no momento pelo cuidador.
// Permite alternar entre múltiplos idosos cadastrados conforme previsto nas histórias de usuário.
export function definirPacienteAtivoId(id) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (id === null || id === undefined) {
        localStorage.removeItem(PACIENTE_ATIVO_KEY);
      } else {
        localStorage.setItem(PACIENTE_ATIVO_KEY, String(id));
      }
    }
  } catch (e) {
    // Ignora caso o armazenamento local esteja restrito.
  }
}

// Recupera o identificador do paciente atualmente selecionado para exibição no painel.
// Retorna null caso nenhum paciente específico tenha sido fixado manualmente.
export function obterPacienteAtivoId() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(PACIENTE_ATIVO_KEY);
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Operação 1 (GET /pacientes): Lista todos os perfis de pacientes cadastrados.
// Utiliza o módulo api.get('/pacientes') com fallback seguro para o armazenamento local.
export async function listar() {
  try {
    const dados = await api.get('/pacientes');
    salvarBancoLocal(dados);
    return dados;
  } catch (erro) {
    return lerBancoLocal();
  }
}

// Operação 2 (GET /pacientes/:id): Busca um paciente específico pelo seu identificador.
// Carrega os dados completos do perfil para preenchimento do formulário de edição.
export async function buscarPorId(id) {
  try {
    return await api.get(`/pacientes/${id}`);
  } catch (erro) {
    const lista = lerBancoLocal();
    return lista.find((item) => String(item.id) === String(id)) || null;
  }
}

// Operação 3 (POST /pacientes): Cria um novo registro de paciente e o define como ativo.
// Envia os dados validados via api.post e seleciona automaticamente o perfil recém-criado.
export async function criar(dados) {
  try {
    const criado = await api.post('/pacientes', dados);
    const lista = lerBancoLocal();
    salvarBancoLocal([criado, ...lista]);
    definirPacienteAtivoId(criado.id);
    return criado;
  } catch (erro) {
    const lista = lerBancoLocal();
    const novoPaciente = { ...dados, id: Date.now() };
    salvarBancoLocal([novoPaciente, ...lista]);
    definirPacienteAtivoId(novoPaciente.id);
    return novoPaciente;
  }
}

// Operação 4 (PATCH /pacientes/:id): Atualiza os campos alterados de um paciente existente.
// Persiste a edição na API simulada e mantém o paciente editado como ativo no painel.
export async function atualizar(id, dados) {
  definirPacienteAtivoId(id);
  try {
    const atualizado = await api.patch(`/pacientes/${id}`, dados);
    const lista = lerBancoLocal().map((item) =>
      String(item.id) === String(id) ? { ...item, ...atualizado } : item
    );
    salvarBancoLocal(lista);
    return atualizado;
  } catch (erro) {
    const lista = lerBancoLocal().map((item) =>
      String(item.id) === String(id) ? { ...item, ...dados } : item
    );
    salvarBancoLocal(lista);
    return dados;
  }
}

// Operação 5 (DELETE /pacientes/:id): Exclui permanentemente o perfil sem recriar fantasmas.
// Seleciona o próximo paciente disponível na lista ou deixa a relação vazia se for o último.
export async function excluir(id) {
  try {
    await api.delete(`/pacientes/${id}`);
  } catch (erro) {
    // Prossegue para a exclusão no armazenamento local.
  }
  const filtrada = lerBancoLocal().filter(
    (item) => String(item.id) !== String(id)
  );
  salvarBancoLocal(filtrada);

  if (filtrada.length > 0) {
    definirPacienteAtivoId(filtrada[0].id);
  } else {
    definirPacienteAtivoId(null);
  }
  return true;
}

// Salva o estado de conclusão ([x]) dos medicamentos e tarefas do dia do paciente atual.
// Garante que os itens marcados pelo cuidador permaneçam verdes ao navegar entre as telas.
export function salvarStatusPainel(pacienteId, medicamentos, tarefas) {
  try {
    if (typeof localStorage !== 'undefined' && pacienteId) {
      localStorage.setItem(
        `${STATUS_KEY_PREFIX}${pacienteId}`,
        JSON.stringify({ medicamentos, tarefas })
      );
    }
  } catch (e) {
    // Ignora caso o armazenamento local esteja bloqueado.
  }
}

// Recupera o estado de conclusão ([x]) salvo anteriormente para o paciente ativo.
// Retorna null caso ainda não existam marcações registradas para o perfil informado.
export function obterStatusPainel(pacienteId) {
  try {
    if (typeof localStorage !== 'undefined' && pacienteId) {
      const salvo = localStorage.getItem(`${STATUS_KEY_PREFIX}${pacienteId}`);
      if (salvo) return JSON.parse(salvo);
    }
  } catch (e) {
    return null;
  }
  return null;
}