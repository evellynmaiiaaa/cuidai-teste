import React, { useState } from 'react';
import CuidadoresScreen from './CuidadoresScreen';
import EditarPermissoesScreen from './EditarPermissoesScreen';
import CuidadorFormScreen from './CuidadorFormScreen';

// Liga as 3 telas de cuidadores entre si. Assim o App.js só precisa de UM case.
//   lista -> editar permissões
//   lista -> adicionar cuidador
export default function CuidadoresFlow({ paciente, onBack }) {
  const [tela, setTela] = useState('lista'); // 'lista' | 'permissoes' | 'form'
  const [selecionado, setSelecionado] = useState(null);
  const [todos, setTodos] = useState([]);

  const voltarParaLista = () => setTela('lista');

  if (tela === 'permissoes') {
    return (
      <EditarPermissoesScreen
        cuidador={selecionado}
        outrosCuidadores={todos.filter((c) => c.id !== selecionado.id)}
        onBack={voltarParaLista}
        onSaved={voltarParaLista}
      />
    );
  }

  if (tela === 'form') {
    return (
      <CuidadorFormScreen
        paciente={paciente}
        cuidadoresDoPaciente={todos}
        onBack={voltarParaLista}
        onSaved={voltarParaLista}
      />
    );
  }

  return (
    <CuidadoresScreen
      pacienteId={paciente.id}
      onBack={onBack}
      onAdd={(lista) => { setTodos(lista); setTela('form'); }}
      onEdit={(cuidador, lista) => { setSelecionado(cuidador); setTodos(lista); setTela('permissoes'); }}
    />
  );
}
