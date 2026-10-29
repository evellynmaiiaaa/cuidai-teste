import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PatientHeader from '../components/PatientHeader';
import ContactCard from '../components/ContactCard';
import EmergencyCard from '../components/EmergencyCard';
import ActionButton from '../components/ActionButton';
import * as contatoService from '../services/contatoService';
import { apenasDigitos } from '../utils/validacoes';
import { avisar, confirmar } from '../utils/confirmar';

export default function ContatosScreen({ paciente, onBack, onAdd, onEdit }) {
  const [contatos, setContatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      setContatos(await contatoService.listar(paciente.id));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [paciente.id]);

  // Recarrega sempre que a tela abre - já vem atualizada).
  useEffect(() => {
    carregar();
  }, [carregar]);

  const ligar = (numero) => Linking.openURL(`tel:${apenasDigitos(numero)}`);

  const excluir = (contato) =>
    confirmar('Excluir contato', `Deseja excluir ${contato.nome || contato.telefone}?`, async () => {
      try {
        await contatoService.excluir(contato.id);
        // Remove da lista sem recarregar tudo.
        setContatos((atual) => atual.filter((c) => c.id !== contato.id));
      } catch (e) {
        avisar('Erro', e.message);
      }
    });


  const samu = ( // Componente fixo no topo - contato do samu pra emergencias
    <View style={styles.samu}>
      <EmergencyCard title="Ambulância / SAMU" number="192" onCallPress={() => ligar('192')} />
    </View>
  );

  const renderEstado = () => {
    if (carregando) return <ActivityIndicator size="large" color="#2B527B" style={styles.estado} />;
    if (erro)
      return (
        <View style={styles.estado}>
          <Text style={styles.estadoTexto}>{erro}</Text>
          <ActionButton title="Tentar novamente" onPress={() => { setCarregando(true); carregar(); }} variant="outline" />
        </View>
      );
    return (
      <View style={styles.estado}>
        <Text style={styles.estadoTexto}>Nenhum contato cadastrado ainda.</Text>
        <ActionButton title="Cadastrar o primeiro contato" onPress={onAdd} variant="outline" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <PatientHeader
        patientName={`${paciente.nome} (${paciente.idade}a)`}
        onBackPress={onBack}
      />
      <FlatList
        style={styles.lista}
        contentContainerStyle={styles.conteudo}
        data={carregando || erro ? [] : contatos}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={samu}
        ListEmptyComponent={renderEstado}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshing={atualizando}
        onRefresh={() => { setAtualizando(true); carregar(); }}
        renderItem={({ item }) => (
          <ContactCard
            name={item.nome}
            relationship={item.parentesco}
            phone={item.telefone}
            onCallPress={() => ligar(item.telefone)}
            onEditPress={() => onEdit(item)}
            onDeletePress={() => excluir(item)}
          />
        )}
      />
      <View style={styles.rodape}>
        <ActionButton title="+ Adicionar Contato" onPress={onAdd} variant="wide" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  lista: { flex: 1, backgroundColor: '#F9FAFB' },
  conteudo: { padding: 16, flexGrow: 1 },
  samu: { marginBottom: 12 },
  estado: { alignItems: 'center', gap: 12, marginTop: 32 },
  estadoTexto: { fontFamily: 'Inter', color: '#6B7280', fontSize: 14, textAlign: 'center' },
  rodape: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});
