import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  ScrollView, Modal, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
 
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MONTHS_SHORT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const TABS = [
  { name: 'Início', icon: 'home-outline', color: '#2e7d5b' },
  { name: 'Saúde', icon: 'heart-pulse', color: '#444' },
  { name: 'Agenda', icon: 'calendar-blank-outline', color: '#111' },
  { name: 'Mais', icon: 'format-list-bulleted', color: '#444' },
];
 
const pad = (n) => String(n).padStart(2, '0');
const toIso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const isoToBr = (iso) => iso.split('-').reverse().join('/');
const brToIso = (br) => br.split('/').reverse().join('-');
 
const now = new Date();
const TODAY = toIso(now.getFullYear(), now.getMonth(), now.getDate());
const currentTime = () => { const n = new Date(); return `${pad(n.getHours())}:${pad(n.getMinutes())}`; };
 
// Máscaras: só números; os separadores entram sozinhos
const maskTime = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d;
};
const maskDate = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};
 
export default function App() {
  const [tab, setTab] = useState('Agenda');
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(TODAY);
  const [appts, setAppts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(null); // null = modal fechado
  const [error, setError] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);
 
  useEffect(() => {
    AsyncStorage.getItem('appts')
      .then((v) => v && setAppts(JSON.parse(v)))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem('appts', JSON.stringify(appts));
  }, [appts, loaded]);
 
  // ----- calendário -----
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
 
  const changeMonth = (delta) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };
 
  const datesWithAppts = new Set(appts.map((a) => a.date));
  const dayAppts = appts
    .filter((a) => a.date === selected)
    .sort((a, b) => a.time.localeCompare(b.time));
 
  // ----- formulário -----
  const resetMsgs = () => { setError(''); setConfirmDel(false); };
  const openNew = () => { resetMsgs(); setForm({ id: null, title: '', date: isoToBr(selected), time: '' }); };
  const openEdit = (a) => { resetMsgs(); setForm({ id: a.id, title: a.title, date: isoToBr(a.date), time: a.time }); };
  const closeForm = () => { resetMsgs(); setForm(null); };
 
  const save = () => {
    setError('');
    if (!form.title.trim()) return setError('Informe o título.');
 
    const [dd, mm, yy] = form.date.split('/').map(Number);
    const real = new Date(yy, mm - 1, dd);
    const dateOk = form.date.length === 10 && real.getFullYear() === yy && real.getMonth() === mm - 1 && real.getDate() === dd;
    if (!dateOk) return setError('Digite uma data real, ex: 05102026.');
    const dateIso = brToIso(form.date);
    if (dateIso < TODAY) return setError('Não é possível marcar compromissos em dias anteriores.');
 
    const [hh, mi] = form.time.split(':').map(Number);
    if (form.time.length !== 5 || hh > 23 || mi > 59) return setError('Horário inválido. Use 24h, ex: 1745 ou 0000.');
    if (dateIso === TODAY && form.time < currentTime()) return setError('Esse horário de hoje já passou.');
 
    const item = { id: form.id || Date.now().toString(), title: form.title.trim(), date: dateIso, time: form.time };
    setAppts(form.id ? appts.map((a) => (a.id === form.id ? item : a)) : [...appts, item]);
    setSelected(item.date);
    const [y, m] = item.date.split('-').map(Number);
    setView({ y, m: m - 1 });
    closeForm();
  };
 
  const remove = () => {
    setAppts(appts.filter((a) => a.id !== form.id));
    closeForm();
  };
 
  const pastSelected = selected < TODAY;
 
  return (
    <SafeAreaView style={s.container}>
      {tab === 'Agenda' ? (
        <>
          <View style={s.topBar}>
            <MaterialCommunityIcons name="chevron-left" size={34} color="#111" />
            <Text style={s.title}>Agenda</Text>
            <View style={{ width: 34 }} />
          </View>
 
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
            {/* mês */}
            <View style={s.monthRow}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <MaterialCommunityIcons name="chevron-left" size={34} color="#111" />
              </TouchableOpacity>
              <Text style={s.month}>{MONTHS[view.m]} {view.y}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <MaterialCommunityIcons name="chevron-right" size={34} color="#111" />
              </TouchableOpacity>
            </View>
 
            {/* dias da semana */}
            <View style={s.weekRow}>
              {WEEK.map((d, i) => <Text key={i} style={s.weekDay}>{d}</Text>)}
            </View>
 
            {/* grade */}
            {weeks.map((w, wi) => (
              <View key={wi} style={s.weekRow}>
                {w.map((d, di) => {
                  if (!d) return <View key={di} style={s.cell} />;
                  const iso = toIso(view.y, view.m, d);
                  const isSel = iso === selected;
                  const isPast = iso < TODAY;
                  return (
                    <TouchableOpacity key={di} style={s.cell} onPress={() => setSelected(iso)}>
                      <View style={[s.dayCircle, isSel && s.daySelected]}>
                        <Text style={[s.dayText, isPast && s.dayPast, iso === TODAY && s.dayToday]}>{d}</Text>
                      </View>
                      {datesWithAppts.has(iso) && !isSel && <View style={s.dot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
 
            {/* compromissos do dia selecionado */}
            <Text style={s.section}>Próximos compromissos</Text>
            {dayAppts.length === 0 && <Text style={s.empty}>Nenhum compromisso neste dia.</Text>}
            {dayAppts.map((a) => {
              const [, mm, dd] = a.date.split('-');
              const past = a.date < TODAY;
              return (
                <TouchableOpacity key={a.id} style={[s.card, past && s.cardPast]} disabled={past} onPress={() => openEdit(a)}>
                  <View style={s.dateBox}>
                    <Text style={s.dateDay}>{dd}</Text>
                    <Text style={s.dateMonth}>{MONTHS_SHORT[Number(mm) - 1]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardTitle}>{a.title}</Text>
                    <Text style={s.cardTime}>{a.time}</Text>
                  </View>
                  {past && <MaterialCommunityIcons name="lock-outline" size={18} color="#888" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
 
          <TouchableOpacity style={[s.addBtn, pastSelected && s.addBtnOff]} disabled={pastSelected} onPress={openNew}>
            <Text style={s.addPlus}>+</Text>
            <Text style={s.addText}>ADICIONAR COMPROMISSO</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={s.placeholder}>
          <Text style={s.empty}>Tela "{tab}" será a próxima.</Text>
        </View>
      )}
 
      {/* barra inferior (só ícones) */}
      <View style={s.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.name} style={s.tab} onPress={() => setTab(t.name)}>
            <MaterialCommunityIcons name={t.icon} size={30} color={t.color} style={{ opacity: tab === t.name ? 1 : 0.65 }} />
          </TouchableOpacity>
        ))}
      </View>
 
      {/* modal adicionar/editar */}
      <Modal visible={!!form} transparent animationType="slide" onRequestClose={closeForm}>
        <View style={s.overlay}>
          {form && (
            <View style={s.sheet}>
              <Text style={s.sheetTitle}>{form.id ? 'Editar compromisso' : 'Novo compromisso'}</Text>
              <TextInput style={s.input} placeholder="Título (ex: Consulta cardiologista)" value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} />
              <TextInput
                style={s.input}
                placeholder="Data (só números: 05102026)"
                keyboardType="number-pad"
                maxLength={10}
                value={form.date}
                onChangeText={(v) => setForm({ ...form, date: maskDate(v) })}
              />
              <TextInput
                style={s.input}
                placeholder="Horário 24h (só números: 1745)"
                keyboardType="number-pad"
                maxLength={5}
                value={form.time}
                onChangeText={(v) => setForm({ ...form, time: maskTime(v) })}
              />
              {!!error && <Text style={s.error}>{error}</Text>}
              <TouchableOpacity style={s.saveBtn} onPress={save}>
                <Text style={s.addText}>SALVAR</Text>
              </TouchableOpacity>
              {form.id && !confirmDel && (
                <TouchableOpacity onPress={() => setConfirmDel(true)}><Text style={s.delete}>Excluir compromisso</Text></TouchableOpacity>
              )}
              {form.id && confirmDel && (
                <View style={s.confirmBox}>
                  <Text style={s.confirmText}>Tem certeza que deseja excluir?</Text>
                  <View style={s.confirmRow}>
                    <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#c0392b' }]} onPress={remove}>
                      <Text style={s.addText}>Sim, excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#8a99a8' }]} onPress={() => setConfirmDel(false)}>
                      <Text style={s.addText}>Não</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <TouchableOpacity onPress={closeForm}><Text style={s.cancel}>Cancelar</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
 
const NAVY = '#2c4f7c';
const RING = '#1e88e5';
const INK = '#111';
 
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8 },
  title: { fontSize: 18, fontWeight: '800', color: INK },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  month: { fontSize: 17, fontWeight: '800', color: INK },
  weekRow: { flexDirection: 'row' },
  weekDay: { width: '14.28%', textAlign: 'center', color: INK, fontWeight: '800', fontSize: 16, marginVertical: 10 },
  cell: { width: '14.28%', height: 46, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'transparent' },
  daySelected: { borderColor: RING },
  dayText: { color: INK, fontSize: 16, fontWeight: '700' },
  dayPast: { color: '#b3b3b3' },
  dayToday: { color: RING },
  dot: { position: 'absolute', bottom: 0, width: 5, height: 5, borderRadius: 3, backgroundColor: RING },
  section: { fontSize: 15, fontWeight: '800', color: '#666', marginTop: 24, marginBottom: 10 },
  empty: { color: '#8a8a8a', textAlign: 'center', marginTop: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, marginBottom: 10 },
  cardPast: { opacity: 0.55 },
  dateBox: { width: 50, marginRight: 10 },
  dateDay: { fontSize: 18, fontWeight: '800', color: INK },
  dateMonth: { fontSize: 14, fontWeight: '800', color: '#777', marginTop: -2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: INK },
  cardTime: { fontSize: 15, fontWeight: '700', color: '#777', marginTop: 2 },
  addBtn: { backgroundColor: NAVY, marginHorizontal: 20, marginVertical: 10, paddingVertical: 14, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  addBtnOff: { backgroundColor: '#b5bfcb' },
  addPlus: { position: 'absolute', left: 18, color: '#fff', fontSize: 20, fontWeight: '700' },
  addText: { color: '#fff', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', paddingBottom: 8 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 10 },
  placeholder: { flex: 1, justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: INK, marginBottom: 14 },
  input: { borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 8, padding: 11, marginBottom: 10, backgroundColor: '#fafafa' },
  saveBtn: { backgroundColor: NAVY, padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 4 },
  error: { color: '#c0392b', marginBottom: 8, fontWeight: '600' },
  delete: { color: '#c0392b', textAlign: 'center', marginTop: 14, fontWeight: '700' },
  confirmBox: { marginTop: 14, alignItems: 'center' },
  confirmText: { color: INK, fontWeight: '600', marginBottom: 10 },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  cancel: { color: '#777', textAlign: 'center', marginTop: 12 },
});
