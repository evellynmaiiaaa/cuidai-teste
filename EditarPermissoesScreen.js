import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaregiversHeader from '../components/CaregiversHeader';
import UserProfileCard from '../components/UserProfileCard';
import SectionTitle from '../components/SectionTitle';
import PermissionList from '../components/PermissionList';
import ActionButton from '../components/ActionButton';
import * as cuidadorService from '../services/cuidadorService';
import { validarPermissoes } from '../utils/validacoesCuidador';
import { avisar } from '../utils/confirmar';

// marca ou desmarca o que a pessoa pode fazer. - outrosCuidadores LEMBRAR que significa "todos os cuidadores do paciente, exceto este.""
export default function EditarPermissoesScreen({ cuidador, outrosCuidadores = [], onBack, onSaved }) {
  const [selecionadas, setSelecionadas] = useState(cuidador.permissoes || []);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // marcado vira desmarcado e desmarcado vira marcado.
  const alternar = (id) => {
    setErro(null);
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((p) => p !== id) : [...atual, id]
    );
  };

  async function salvar() {
    if (salvando) return;
    const mensagem = validarPermissoes(selecionadas, cuidador, outrosCuidadores);
    setErro(mensagem);
    if (mensagem) return;

    setSalvando(true); // bloqueia o botão para evitar salvar duas vezes
    try {
      await cuidadorService.atualizar(cuidador.id, { permissoes: selecionadas });
      avisar('Pronto!', 'Permissões salvas com sucesso.');
      onSaved();
    } catch (e) {
      avisar('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <CaregiversHeader title="Editar permissões" onBackPress={onBack} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <UserProfileCard
          name={cuidador.nome}
          relationship={cuidador.parentesco}
          role={cuidadorService.rotuloPapel(cuidador.papel)}
          avatarUri={cuidador.avatarUri}
        />
        <View style={styles.titulo}>
          <SectionTitle>Permissões de acesso</SectionTitle>
        </View>
        <PermissionList selectedPermissions={selecionadas} onToggle={alternar} />
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      </ScrollView>
      <View style={styles.rodape}>
        <ActionButton title={salvando ? 'Salvando...' : 'Salvar'} variant="wide" onPress={salvar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  conteudo: { padding: 24, flexGrow: 1 },
  titulo: { marginTop: 24, marginBottom: 8 },
  erro: { fontFamily: 'Inter_400Regular', color: '#C0392B', fontSize: 12, marginTop: 12 },
  rodape: { padding: 16 },
});
