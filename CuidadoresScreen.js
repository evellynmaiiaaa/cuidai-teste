import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaregiversHeader from '../components/CaregiversHeader';
import SectionTitle from '../components/SectionTitle';
import CaregiverRow from '../components/CaregiverRow';
import ActionButton from '../components/ActionButton';
import * as cuidadorService from '../services/cuidadorService';

// Tela Cuidadores e permissões 
export default function CuidadoresScreen({ pacienteId, onBack, onAdd, onEdit }) {
  const [cuidadores, setCuidadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      setCuidadores(await cuidadorService.listar(pacienteId));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [pacienteId]);

  // Recarrega sempre que a tela abre quando volta de editar/cadastrar já vem atualizado.
  useEffect(() => {
    carregar();
  }, [carregar]);

  const renderEstado = () => {
    if (carregando) return <ActivityIndicator size="large" color="#2B527B" style={styles.estado} />;
    if (erro)
      return (
        <View style={styles.estado}>
          <Text style={styles.estadoTexto}>{erro}</Text>
          <ActionButton title="Tentar novamente" variant="outline" onPress={() => { setCarregando(true); carregar(); }} />
        </View>
      );
    return (
      <View style={styles.estado}>
        <Text style={styles.estadoTexto}>Nenhum cuidador cadastrado ainda.</Text>
        <ActionButton title="Adicionar o primeiro cuidador" variant="outline" onPress={() => onAdd(cuidadores)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CaregiversHeader title="Cuidadores e permissões" onBackPress={onBack} />
      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.conteudo}
        data={carregando || erro ? [] : cuidadores}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.titulo}>
            <SectionTitle>Pessoas que têm acesso</SectionTitle>
          </View>
        }
        ListEmptyComponent={renderEstado}
        refreshing={atualizando}
        onRefresh={() => { setAtualizando(true); carregar(); }}
        renderItem={({ item }) => (
          <CaregiverRow
            name={item.nome}
            relationship={item.parentesco}
            roleLabel={cuidadorService.rotuloPapel(item.papel)}
            avatarUri={item.avatarUri}
            onEditPress={() => onEdit(item, cuidadores)}
          />
        )}
      />
      <View style={styles.rodape}>
        <ActionButton title="+ Adicionar Cuidador" variant="wide" onPress={() => onAdd(cuidadores)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  lista: { flex: 1 },
  conteudo: { paddingHorizontal: 24, paddingTop: 16, flexGrow: 1 },
  titulo: { marginBottom: 12 },
  estado: { alignItems: 'center', gap: 12, marginTop: 32 },
  estadoTexto: { fontFamily: 'Inter_400Regular', color: '#6B7280', fontSize: 14, textAlign: 'center' },
  rodape: { padding: 16 },
});
