// Importa a biblioteca React e os componentes estruturais nativos do React Native.
// Utiliza os hooks useState e useEffect para gerenciar a troca entre múltiplos pacientes.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';

// Importa o menu lateral, o serviço de pacientes e o calculador dinâmico de idade.
// Garante que a idade exibida no crachá seja sempre calculada pela data de nascimento atual.
import MenuAberto from './MenuAberto';
import * as pacienteService from '../services/pacienteService';
import { calcularIdadePorData } from '../utils/validacoes';

export default function TelaInicial({ navigation }) {
  // Controla a visibilidade do menu lateral, o seletor de pacientes e o diálogo de exclusão.
  // Mantém a lista completa de pacientes para permitir alternar rapidamente entre os perfis.
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [listaPacientes, setListaPacientes] = useState([]);
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [gerenciarVisivel, setGerenciarVisivel] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  // Armazena exclusivamente as listas de avisos, medicamentos e tarefas do paciente selecionado.
  // Limpa os arrays quando não há pacientes cadastrados para exibir o estado vazio corretamente.
  const [avisos, setAvisos] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [tarefas, setTarefas] = useState([]);

  // Retorna a idade atualizada do paciente calculada dinamicamente pela data de nascimento.
  // Utiliza o campo idade salvo apenas como reserva caso o registro antigo não tenha dataNascimento.
  function obterIdadeExibicao(paciente) {
    if (!paciente) return '';
    const calculada = calcularIdadePorData(paciente.dataNascimento);
    return calculada !== null ? calculada : paciente.idade;
  }

  // Monta os cartões de avisos, medicamentos e tarefas correspondentes ao paciente escolhido.
  // Restaura as marcações de conclusão ([x]) gravadas especificamente para o ID informado.
  function aplicarDadosDoPaciente(atual) {
    setPacienteAtual(atual);

    if (!atual) {
      setAvisos([]);
      setMedicamentos([]);
      setTarefas([]);
      return;
    }

    const statusSalvo = pacienteService.obterStatusPainel(atual.id);

    if (atual.id === 1 && atual.nome === 'Dona Joana') {
      setAvisos([
        { id: 'av-1', texto: 'Consulta adiada para 15h.', autor: 'Carlos' },
        { id: 'av-2', texto: 'Deixei pão fresco.', autor: 'Ana' },
      ]);

      if (statusSalvo) {
        setMedicamentos(statusSalvo.medicamentos);
        setTarefas(statusSalvo.tarefas);
      } else {
        setMedicamentos([
          {
            id: 'med-1',
            titulo: 'Losartana 50mg - 08:00',
            status: 'Status: Atrasado',
            concluido: false,
            tipo: 'danger',
          },
          {
            id: 'med-2',
            titulo: 'Dipirona 20gt - 12:00',
            status: 'Próximo horário',
            concluido: false,
            tipo: 'warning',
          },
        ]);
        setTarefas([
          {
            id: 'tar-1',
            titulo: 'Aferir pressão',
            status: 'Feito às 08:15 (Ana)',
            concluido: true,
            tipo: 'success',
          },
          {
            id: 'tar-2',
            titulo: 'Comprar fraldas',
            status: 'Pendente',
            concluido: false,
            tipo: 'neutral',
          },
          {
            id: 'tar-3',
            titulo: 'Agendar fisioterapia',
            status: 'Pendente',
            concluido: false,
            tipo: 'neutral',
          },
        ]);
      }
      return;
    }

    setAvisos([]);

    const listaRemedios = atual.remedios
      ? atual.remedios
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((nomeRemedio, index) => {
            const anterior = statusSalvo?.medicamentos?.find(
              (m) => m.titulo === nomeRemedio
            );
            return (
              anterior || {
                id: `med-${atual.id}-${index}`,
                titulo: nomeRemedio,
                status: 'Próximo horário',
                concluido: false,
                tipo: 'warning',
              }
            );
          })
      : [];

    const listaAtividades = atual.atividades
      ? atual.atividades
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((nomeAtividade, index) => {
            const anterior = statusSalvo?.tarefas?.find(
              (t) => t.titulo === nomeAtividade
            );
            return (
              anterior || {
                id: `tar-${atual.id}-${index}`,
                titulo: nomeAtividade,
                status: 'Pendente',
                concluido: false,
                tipo: 'neutral',
              }
            );
          })
      : [];

    setMedicamentos(listaRemedios);
    setTarefas(listaAtividades);
  }

  // Consulta todos os pacientes no serviço e seleciona o paciente ativo salvo na sessão.
  // Caso a lista esteja vazia após exclusões, mantém pacienteAtual como null sem criar fantasmas.
  async function carregarPainel() {
    try {
      setCarregando(true);
      const lista = await pacienteService.listar();
      setListaPacientes(lista || []);

      if (lista && lista.length > 0) {
        const idSalvo = pacienteService.obterPacienteAtivoId();
        const escolhido =
          lista.find((p) => String(p.id) === String(idSalvo)) || lista[0];
        pacienteService.definirPacienteAtivoId(escolhido.id);
        aplicarDadosDoPaciente(escolhido);
      } else {
        aplicarDadosDoPaciente(null);
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPainel();
  }, []);

  // Troca imediatamente o paciente ativo quando o cuidador seleciona outro nome na lista do topo.
  // Grava a escolha no serviço e atualiza os cartões do painel sem recarregar a página.
  function handleTrocarPaciente(pacienteEscolhido) {
    pacienteService.definirPacienteAtivoId(pacienteEscolhido.id);
    aplicarDadosDoPaciente(pacienteEscolhido);
    setConfirmarExclusao(false);
    setGerenciarVisivel(false);
  }

  // Alterna o estado de conclusão ([x]) de um medicamento e grava imediatamente no serviço.
  // Garante que a marcação persista ao navegar para outras telas ou trocar de paciente.
  function handleToggleMedicamento(id) {
    setMedicamentos((listaAtual) => {
      const novaLista = listaAtual.map((item) => {
        if (item.id !== id) return item;
        const novoConcluido = !item.concluido;
        return {
          ...item,
          concluido: novoConcluido,
          status: novoConcluido
            ? 'Administrado agora (Você)'
            : 'Próximo horário',
          tipo: novoConcluido ? 'success' : 'warning',
        };
      });

      if (pacienteAtual) {
        pacienteService.salvarStatusPainel(
          pacienteAtual.id,
          novaLista,
          tarefas
        );
      }
      return novaLista;
    });
  }

  // Alterna o registro de conclusão ([x]) de uma tarefa diária e salva no armazenamento local.
  // Atualiza o estado visual para verde ('success') mantendo os dados sincronizados.
  function handleToggleTarefa(id) {
    setTarefas((listaAtual) => {
      const novaLista = listaAtual.map((item) => {
        if (item.id !== id) return item;
        const novoConcluido = !item.concluido;
        return {
          ...item,
          concluido: novoConcluido,
          status: novoConcluido ? 'Feito agora (Você)' : 'Pendente',
          tipo: novoConcluido ? 'success' : 'neutral',
        };
      });

      if (pacienteAtual) {
        pacienteService.salvarStatusPainel(
          pacienteAtual.id,
          medicamentos,
          novaLista
        );
      }
      return novaLista;
    });
  }

  // Redireciona para a tela CadastroPaciente passando o ID do paciente atual para edição.
  // Cumpre o requisito da Etapa 3 de utilizar um formulário único para criar e editar registros.
  function handleEditarPaciente() {
    if (!pacienteAtual) return;
    setGerenciarVisivel(false);
    setConfirmarExclusao(false);
    navigation?.navigate('CadastroPaciente', { id: pacienteAtual.id });
  }

  // Executa a operação de exclusão (DELETE) após a confirmação explícita do usuário.
  // Remove o paciente definitivamente e passa para o próximo da lista ou exibe estado vazio.
  async function handleConfirmarExclusao() {
    if (!pacienteAtual) return;
    await pacienteService.excluir(pacienteAtual.id);
    setConfirmarExclusao(false);
    setGerenciarVisivel(false);
    await carregarPainel();
  }

  // Renderiza exclusivamente o MenuAberto caso o usuário tenha clicado no botão de três traços.
  // Passa a função que redefine menuVisivel para false permitindo fechar o menu e voltar ao painel.
  if (menuVisivel) {
    return (
      <MenuAberto
        onClose={() => setMenuVisivel(false)}
        navigation={navigation}
      />
    );
  }

  return (
    <View style={styles.screen}>
      {/* Renderiza o cabeçalho da Tela Inicial com menu hambúrguer à esquerda e seletor de paciente à direita. */}
      {/* Exibe a idade calculada automaticamente pelo sistema a partir da data de nascimento. */}
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => setMenuVisivel(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          style={styles.menuButton}
        >
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </Pressable>

        <View style={styles.headerTitleSpace} />

        {pacienteAtual ? (
          <Pressable
            onPress={() => {
              setGerenciarVisivel(!gerenciarVisivel);
              setConfirmarExclusao(false);
            }}
            style={styles.patientBadge}
          >
            <Text style={styles.patientBadgeText}>
              {pacienteAtual.nome} ({obterIdadeExibicao(pacienteAtual)}a) ▾
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => navigation?.navigate('CadastroPaciente')}
            style={styles.patientBadgeEmpty}
          >
            <Text style={styles.patientBadgeEmptyText}>+ Novo Paciente</Text>
          </Pressable>
        )}
      </View>

      {/* Exibe o painel de troca de paciente e ações de CRUD (Novo, Editar, Excluir) abaixo do topo. */}
      {/* Permite alternar entre todos os pacientes cadastrados com um único toque nas pílulas. */}
      {gerenciarVisivel && pacienteAtual && (
        <View style={styles.manageBar}>
          <Text style={styles.switchTitle}>
            Trocar paciente ({listaPacientes.length}):
          </Text>
          <View style={styles.pillsContainer}>
            {listaPacientes.map((item) => {
              const ativo = String(item.id) === String(pacienteAtual.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleTrocarPaciente(item)}
                  style={[
                    styles.patientPill,
                    ativo && styles.patientPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.patientPillText,
                      ativo && styles.patientPillTextActive,
                    ]}
                  >
                    {item.nome} ({obterIdadeExibicao(item)}a)
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {!confirmarExclusao ? (
            <View style={styles.manageActions}>
              <Pressable
                onPress={() => {
                  setGerenciarVisivel(false);
                  navigation?.navigate('CadastroPaciente');
                }}
                style={styles.newPatientBtn}
              >
                <Text style={styles.newPatientText}>+ Novo</Text>
              </Pressable>

              <Pressable
                onPress={handleEditarPaciente}
                style={styles.editPatientBtn}
              >
                <Text style={styles.editPatientText}>✎ Editar</Text>
              </Pressable>

              <Pressable
                onPress={() => setConfirmarExclusao(true)}
                style={styles.deletePatientBtn}
              >
                <Text style={styles.deletePatientText}>✕ Excluir</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmQuestion}>
                Excluir {pacienteAtual?.nome}?
              </Text>
              <View style={styles.confirmBtns}>
                <Pressable
                  onPress={() => setConfirmarExclusao(false)}
                  style={styles.cancelDeleteBtn}
                >
                  <Text style={styles.cancelDeleteText}>Não</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmarExclusao}
                  style={styles.confirmDeleteBtn}
                >
                  <Text style={styles.confirmDeleteText}>Sim, excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Trata os estados da tela exigidos na Etapa 3: Carregando, Vazio (sem pacientes) e Com Dados. */}
      {/* Quando todos os pacientes são excluídos, oferece botão direto para cadastrar o primeiro registro. */}
      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B527B" />
        </View>
      ) : !pacienteAtual ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>
            Nenhum paciente cadastrado
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            Cadastre o perfil de um paciente para acompanhar medicamentos, avisos e tarefas do dia.
          </Text>
          <Pressable
            onPress={() => navigation?.navigate('CadastroPaciente')}
            style={styles.emptyStateButton}
          >
            <Text style={styles.emptyStateButtonText}>
              + Cadastrar Primeiro Paciente
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {/* Exibe o cartão do Mural de Avisos mostrando apenas recados reais do paciente ativo. */}
          {/* Oculta o selo 'Novo' quando não há avisos e redireciona para a rota MuralAvisos ao clicar. */}
          <Pressable
            onPress={() =>
              navigation?.navigate
                ? navigation.navigate('MuralAvisos')
                : Alert.alert('Mural de Avisos', 'Caminho da tela MuralAvisos')
            }
            style={styles.muralCard}
          >
            <View style={styles.muralHeader}>
              <Text style={styles.muralTitle}>📢 Mural de Avisos</Text>
              {avisos.length > 0 && (
                <View style={styles.novoBadge}>
                  <Text style={styles.novoBadgeText}>Novo</Text>
                </View>
              )}
            </View>

            {avisos.length === 0 ? (
              <Text style={styles.muralEmptyText}>
                Nenhum aviso registrado para este paciente.
              </Text>
            ) : (
              avisos.map((aviso) => (
                <Text key={aviso.id} style={styles.muralItem}>
                  • "{aviso.texto}" ({aviso.autor})
                </Text>
              ))
            )}
          </Pressable>

          {/* Lista os medicamentos do paciente atual ou exibe mensagem amigável caso a lista esteja vazia. */}
          {/* Permite marcar cada medicação como concluída diretamente no painel através do evento onPress. */}
          <Text style={styles.sectionHeader}>💊 Medicamentos Pendentes</Text>
          {medicamentos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Nenhum medicamento pendente para este paciente.
              </Text>
            </View>
          ) : (
            medicamentos.map((med) => (
              <Pressable
                key={med.id}
                onPress={() => handleToggleMedicamento(med.id)}
                style={[
                  styles.taskCard,
                  med.tipo === 'danger' && styles.cardDanger,
                  med.tipo === 'warning' && styles.cardWarning,
                  med.tipo === 'success' && styles.cardSuccess,
                ]}
              >
                <Text style={styles.taskTitle}>
                  {med.concluido ? '[x] ' : '[ ] '}
                  {med.titulo}
                </Text>
                <Text
                  style={[
                    styles.taskStatus,
                    med.tipo === 'danger' && styles.textDanger,
                    med.tipo === 'warning' && styles.textWarning,
                    med.tipo === 'success' && styles.textSuccess,
                  ]}
                >
                  {med.status}
                </Text>
              </Pressable>
            ))
          )}

          {/* Apresenta as tarefas cadastradas para o paciente atual ou informa ausência de atividades. */}
          {/* Vincula o toque de cada cartão à função handleToggleTarefa para atualizar o estado em tempo real. */}
          <Text style={styles.sectionHeader}>✅ Tarefas do Dia</Text>
          {tarefas.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Nenhuma tarefa ou atividade cadastrada para hoje.
              </Text>
            </View>
          ) : (
            tarefas.map((tarefa) => (
              <Pressable
                key={tarefa.id}
                onPress={() => handleToggleTarefa(tarefa.id)}
                style={[
                  styles.taskCard,
                  tarefa.tipo === 'success'
                    ? styles.cardSuccess
                    : styles.cardNeutral,
                ]}
              >
                <Text style={styles.taskTitle}>
                  {tarefa.concluido ? '[x] ' : '[ ] '}
                  {tarefa.titulo}
                </Text>
                <Text
                  style={[
                    styles.taskStatus,
                    tarefa.tipo === 'success'
                      ? styles.textSuccess
                      : styles.textNeutral,
                  ]}
                >
                  {tarefa.status}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      )}

      {/* Posiciona o botão crítico de Emergência/Ligar fixo na base da Tela Inicial. */}
      {/* Utiliza o token de cor #DC2626 (Danger / Emergência) e redireciona para os contatos de socorro. */}
      <View style={styles.footer}>
        <Pressable
          onPress={() =>
            navigation?.navigate
              ? navigation.navigate('ContatosEmergencia')
              : Alert.alert('Emergência', 'Caminho da tela ContatosEmergencia')
          }
          style={({ pressed }) => [
            styles.emergencyButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.emergencyButtonText}>Emergência/Ligar</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Declara as regras de estilização estática, pílulas de troca de paciente e superfícies semânticas.
// Garante que todos os elementos permaneçam travados no eixo sem necessidade de rolagem.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    width: 34,
    height: 40,
    justifyContent: 'center',
    gap: 5,
  },
  menuLine: {
    width: 28,
    height: 2,
    backgroundColor: '#4B5563',
  },
  headerTitleSpace: {
    flex: 1,
  },
  patientBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  patientBadgeText: {
    fontFamily: 'Inter',
    color: '#1A1A1A',
    fontSize: 11,
    fontWeight: '700',
  },
  patientBadgeEmpty: {
    backgroundColor: '#2B527B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  patientBadgeEmptyText: {
    fontFamily: 'Inter',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  manageBar: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  switchTitle: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  patientPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  patientPillActive: {
    backgroundColor: '#E8F5F2',
    borderColor: '#2D6A5A',
  },
  patientPillText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  patientPillTextActive: {
    color: '#1A3C34',
    fontWeight: '700',
  },
  manageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 2,
  },
  newPatientBtn: {
    backgroundColor: '#2B527B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newPatientText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editPatientBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2B527B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editPatientText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#2B527B',
  },
  deletePatientBtn: {
    backgroundColor: '#FFF8F8',
    borderWidth: 1,
    borderColor: '#C0392B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deletePatientText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#C0392B',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmQuestion: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#C0392B',
  },
  confirmBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelDeleteBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cancelDeleteText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#374151',
  },
  confirmDeleteBtn: {
    backgroundColor: '#C0392B',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confirmDeleteText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyStateTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  emptyStateButton: {
    backgroundColor: '#2B527B',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  muralCard: {
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  muralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  muralTitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  novoBadge: {
    backgroundColor: '#FB8C00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  novoBadgeText: {
    fontFamily: 'Inter',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  muralItem: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#3D3D3D',
    marginTop: 2,
  },
  muralEmptyText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  sectionHeader: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginTop: 4,
    marginBottom: 8,
  },
  taskCard: {
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  emptyCard: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
  },
  cardDanger: {
    backgroundColor: '#FFF8F8',
    borderColor: '#F5C6CB',
  },
  cardWarning: {
    backgroundColor: '#FFFEFE',
    borderColor: '#E5E7EB',
  },
  cardSuccess: {
    backgroundColor: '#F1FBF2',
    borderColor: '#C3E6CB',
  },
  cardNeutral: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  taskTitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  taskStatus: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
  },
  textDanger: {
    color: '#E53935',
  },
  textWarning: {
    color: '#FB8C00',
  },
  textSuccess: {
    color: '#43A047',
  },
  textNeutral: {
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 6,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    minHeight: 44,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  emergencyButtonText: {
    fontFamily: 'Inter',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});