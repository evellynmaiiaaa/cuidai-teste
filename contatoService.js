import api from './api';

// Só este arquivo sabe de onde vêm os dados - O CRUD está aqui (Create, Read, Update, Delete).
const USE_MOCK = true;

let mock = [ // DADOS FALSOS
  { id: 1, pacienteId: 1, nome: '', parentesco: '', telefone: '(11) 99999-9999' },
  { id: 2, pacienteId: 1, nome: 'Ana', parentesco: 'Filha / Cuidadora Principal', telefone: '(11) 98888-8888', email: '' },
];
let proximoId = 3;
const espera = (ms = 400) => new Promise((r) => setTimeout(r, ms)); // Pausa de poucos segundos só para simular a demora da internet.

// GET /contatos?pacienteId=1
export async function listar(pacienteId) {
  if (USE_MOCK) {
    await espera();
    return mock.filter((c) => c.pacienteId === pacienteId);
  }
  return api.get(`/contatos?pacienteId=${pacienteId}`);
}

// POST /contatos - aqui se salva um contato novo
export async function criar(dados) {
  if (USE_MOCK) {
    await espera();
    const novo = { ...dados, id: proximoId++ };
    mock.push(novo);
    return novo;
  }
  return api.post('/contatos', dados);
}

// PATCH /contatos/:id - aqui tá o UPDATE pra atualizar algum dado de contato já existente
export async function atualizar(id, dados) {
  if (USE_MOCK) {
    await espera();
    mock = mock.map((c) => (c.id === id ? { ...c, ...dados } : c));
    return mock.find((c) => c.id === id);
  }
  return api.patch(`/contatos/${id}`, dados);
}

// DELETE /contatos/:id - Aqui pra delitar contato de emergencia 
export async function excluir(id) {
  if (USE_MOCK) {
    await espera(200);
    mock = mock.filter((c) => c.id !== id);
    return null;
  }
  return api.delete(`/contatos/${id}`);
}
