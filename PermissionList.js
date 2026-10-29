import React from 'react';
import { StyleSheet, View } from 'react-native';
import PermissionItem from './PermissionItem';

// Identificadores para salvar quais permissões foram selecionadas.
export const PERMISSION_OPTIONS = [
  { id: 'viewPatient', label: 'Visualizar paciente' },
  { id: 'viewMedications', label: 'Visualizar Medicamentos' },
  { id: 'manageTasks', label: 'Gerenciar tarefas' },
  { id: 'editMedicalInfo', label: 'Editar informações médicas' },
  { id: 'manageContacts', label: 'Gerenciar contatos' },
  { id: 'manageCaregivers', label: 'Adicionar / remover cuidadores' },
];

// Mostra quais permissões foram marcadas e avisa quando um usuário toca em uma opção.
export default function PermissionList({
  options = PERMISSION_OPTIONS,
  selectedPermissions = [],
  onToggle = () => {},
}) {
  return (
    <View style={styles.container}>
      {options.map((permission) => (
        <PermissionItem
          key={permission.id}
          label={permission.label}
          checked={selectedPermissions.includes(permission.id)}
          onPress={() => onToggle(permission.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
