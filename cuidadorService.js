import api from './api';

// true = dados falsos na memória para teste. False = json-server de verdade, via api.js.
const USE_MOCK = true;

export const PAPEIS = [
  { id: 'admin', label: 'Administrador(a)' },
  { id: 'editor', label: 'Editor' },
  { id: 'visualizacao', label: 'Visualização' },
];
export const rotuloPapel = (id) => (PAPEIS.find((p) => p.id === id) || {}).label || '';

// Permissões que cada nível já recebe ao ser cadastrado ajustavel depois
export const PERMISSOES_POR_PAPEL = {
  admin: ['viewPatient', 'viewMedications', 'manageTasks', 'editMedicalInfo', 'manageContacts', 'manageCaregivers'],
  editor: ['viewPatient', 'viewMedications', 'manageTasks'],
  visualizacao: ['viewPatient', 'viewMedications'],
};

let mock = [
  { id: 1, pacienteId: 1, nome: 'Ana Clara', parentesco: 'Filha', papel: 'admin', permissoes: PERMISSOES_POR_PAPEL.admin, telefone: '(11) 97777-1111', email: 'ana.clara@gmail.com', cpf: '529.982.247-25' },
  { id: 2, pacienteId: 1, nome: 'Roberto', parentesco: 'Cuidador', papel: 'editor', permissoes: PERMISSOES_POR_PAPEL.editor, telefone: '(11) 97777-2222', email: 'roberto@gmail.com', cpf: '111.444.777-35' },
  { id: 3, pacienteId: 1, nome: 'Carla', parentesco: 'Familiar', papel: 'visualizacao', permissoes: PERMISSOES_POR_PAPEL.visualizacao, telefone: '(11) 97777-3333', email: 'carla@gmail.com', cpf: '390.533.447-05' },
];
let proximoId = 4;
const espera = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// GET /cuidadores?pacienteId=1
export async function listar(pacienteId) {
  if (USE_MOCK) {
    await espera();
    return mock.filter((c) => c.pacienteId === pacienteId);
  }
  return api.get(`/cuidadores?pacienteId=${pacienteId}`);
}

// POST /cuidadores
export async function criar(dados) {
  if (USE_MOCK) {
    await espera();
    const novo = { ...dados, id: proximoId++ };
    mock.push(novo);
    return novo;
  }
  return api.post('/cuidadores', dados);
}

// PATCH /cuidadores/:id 
export async function atualizar(id, dados) {
  if (USE_MOCK) {
    await espera();
    mock = mock.map((c) => (c.id === id ? { ...c, ...dados } : c));
    return mock.find((c) => c.id === id);
  }
  return api.patch(`/cuidadores/${id}`, dados);
}
