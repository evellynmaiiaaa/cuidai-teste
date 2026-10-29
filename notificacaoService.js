
// import api from './api';

const USAR_MOCK = true;
const SIMULAR_ERRO = false; // coloque true para testar a tela de erro

const minutosAtras = (min) => new Date(Date.now() - min * 60000).toISOString();
const emMinutos = (min) => new Date(Date.now() + min * 60000).toISOString();

// Dados de exemplo (mesmo formato que a coleção "notificacoes" do db.json)
let banco = [
  {
    id: 1,
    tipo: 'medicamento',
    titulo: 'Medicamento',
    linhas: ['Losartana 50mg', 'Horário: 08:00'],
    horario: minutosAtras(15),
    concluida: false,
    lida: false,
    userId: 1,
  },
  {
    id: 2,
    tipo: 'tarefa',
    titulo: 'Tarefa',
    linhas: ['Losartana 50mg', 'Hoje às: 08:00'],
    horario: emMinutos(120),
    lida: false,
    userId: 1,
  },
  {
    id: 3,
    tipo: 'consulta',
    titulo: 'Consulta',
    linhas: ['Cardiologista amanhã', 'às 14.30'],
    horario: emMinutos(60 * 24),
    lida: false,
    userId: 1,
  },
  {
    id: 4,
    tipo: 'estoque',
    titulo: 'Medicamento',
    linhas: ['Losartana está acabando'],
    dosesRestantes: 5,
    lida: false,
    userId: 1,
  },
];

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function simularRede() {
  await esperar(700);
  if (SIMULAR_ERRO) throw new Error('Não foi possível conectar. Verifique sua internet.');
}

export async function listar() {
  if (USAR_MOCK) {
    await simularRede();
    return [...banco];
  }
  // API REAL: return api.get('/notificacoes');
}

export async function marcarComoLida(id) {
  if (USAR_MOCK) {
    banco = banco.map((n) => (n.id === id ? { ...n, lida: true } : n));
    return;
  }
  // API REAL: return api.patch(`/notificacoes/${id}`, { lida: true });
}

export async function excluir(id) {
  if (USAR_MOCK) {
    await esperar(300);
    banco = banco.filter((n) => n.id !== id);
    return;
  }
  // API REAL: return api.delete(`/notificacoes/${id}`);
}
