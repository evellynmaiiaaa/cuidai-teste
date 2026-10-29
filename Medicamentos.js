import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const pad = (n) => String(n).padStart(2, '0');
const brToIso = (br) => br.split('/').reverse().join('-');
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = toIso(new Date());

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

const isRealDate = (br) => {
  if (br.length !== 10) return false;
  const [dd, mm, yy] = br.split('/').map(Number);
  const real = new Date(yy, mm - 1, dd);
  return real.getFullYear() === yy && real.getMonth() === mm - 1 && real.getDate() === dd;
};

const UNITS = ['mL', 'mg'];
// Aceita só números e uma vírgula/ponto (ex: 2, 2,5, 0.5)
const maskQty = (v) => {
  const clean = v.replace(/[^\d.,]/g, '').replace('.', ',');
  const [int, ...rest] = clean.split(',');
  return rest.length ? `${int},${rest.join('').slice(0, 2)}` : int.slice(0, 5);
};

const EMPTY_FORM = { name: '', qty: '', unit: 'mL', time: '', start: '', end: '' };

export default function AgendamentoRemedios() {
  const [meds, setMeds] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null); // id aguardando confirmação

  useEffect(() => {
    AsyncStorage.getItem('meds')
      .then((v) => v && setMeds(JSON.parse(v)))
      .finally(() => setLoaded(true));
  }, []);
  useEffect(() => {
    if (loaded) AsyncStorage.setItem('meds', JSON.stringify(meds));
  }, [meds, loaded]);

  const sorted = [...meds].sort((a, b) => a.time.localeCompare(b.time));

  const add = () => {
    setError('');
    if (!form.name.trim()) return setError('Informe o nome do remédio.');
    const qtyNum = parseFloat(form.qty.replace(',', '.'));
    if (!qtyNum || qtyNum <= 0) return setError('Informe a quantidade e escolha mL ou mg.');

    const [hh, mi] = form.time.split(':').map(Number);
    if (form.time.length !== 5 || hh > 23 || mi > 59) return setError('Horário inválido. Use 24h, ex: 0830.');

    if (!isRealDate(form.start)) return setError('Data de início inválida, ex: 05102026.');
    if (!isRealDate(form.end)) return setError('Data de término inválida, ex: 05112026.');
    const startIso = brToIso(form.start);
    const endIso = brToIso(form.end);
    if (startIso < TODAY) return setError('A data de início não pode ser anterior a hoje.');
    if (endIso < startIso) return setError('O término não pode ser antes do início.');

    setMeds([
      ...meds,
      {
        id: Date.now().toString(),
        name: form.name.trim(),
        qty: `${form.qty.trim()} ${form.unit}`,
        time: form.time,
        start: startIso,
        end: endIso,
      },
    ]);
    setForm(EMPTY_FORM);
  };

  const remove = (id) => {
    setMeds(meds.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* menu */}
        <TouchableOpacity style={s.menu}>
          <MaterialCommunityIcons name="menu" size={44} color="#777" />
        </TouchableOpacity>

        {/* logo (troque por <Image source={require('./assets/logo.png')} /> se tiver o arquivo) */}
        <View style={s.logoBox}>
          <MaterialCommunityIcons name="home-heart" size={44} color="#2e7d5b" />
          <Text style={s.logoText}>CuidAí</Text>
        </View>

        <Text style={s.pageTitle}>Tabela de agendamentos</Text>

        {/* tabela */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Tabela de agendamentos</Text>

          <View style={s.table}>
            <View style={s.row}>
              <Text style={[s.cell, s.head, { flex: 1.3 }]}>Remédio</Text>
              <Text style={[s.cell, s.head, s.borderLeft, { flex: 1 }]}>Horário</Text>
              <Text style={[s.cell, s.head, s.borderLeft, { flex: 1.1 }]}>Quantidade</Text>
            </View>

            {sorted.length === 0 && (
              <View style={[s.row, s.borderTop]}>
                <Text style={s.emptyRow}>Nenhum remédio cadastrado.</Text>
              </View>
            )}

            {sorted.map((m) => (
              <View key={m.id}>
                <TouchableOpacity
                  style={[s.row, s.borderTop]}
                  onLongPress={() => setDeletingId(m.id)}
                  delayLongPress={400}
                  activeOpacity={0.6}
                >
                  <Text style={[s.cell, { flex: 1.3 }]}>{m.name}</Text>
                  <Text style={[s.cell, s.borderLeft, { flex: 1 }]}>{m.time}</Text>
                  <Text style={[s.cell, s.borderLeft, { flex: 1.1 }]}>{m.qty}</Text>
                </TouchableOpacity>

                {deletingId === m.id && (
                  <View style={s.confirmBox}>
                    <Text style={s.confirmText}>Excluir {m.name}?</Text>
                    <View style={s.confirmRow}>
                      <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#c0392b' }]} onPress={() => remove(m.id)}>
                        <Text style={s.btnText}>Sim, excluir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#8a99a8' }]} onPress={() => setDeletingId(null)}>
                        <Text style={s.btnText}>Não</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
          {sorted.length > 0 && <Text style={s.hint}>Segure um remédio para excluir.</Text>}
        </View>

        {/* formulário */}
        <TextInput
          style={s.input}
          placeholder="Nome do remédio"
          placeholderTextColor="#8a8a8a"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
        />

        <View style={s.twoCols}>
          <View style={[s.input, s.half, s.qtyBox]}>
            <TextInput
              style={s.qtyInput}
              placeholder="Qtd."
              placeholderTextColor="#8a8a8a"
              keyboardType="decimal-pad"
              value={form.qty}
              onChangeText={(v) => setForm({ ...form, qty: maskQty(v) })}
            />
            <View style={s.unitRow}>
              {UNITS.map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[s.unitBtn, form.unit === u && s.unitBtnOn]}
                  onPress={() => setForm({ ...form, unit: u })}
                >
                  <Text style={[s.unitText, form.unit === u && s.unitTextOn]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TextInput
            style={[s.input, s.half]}
            placeholder="Horários (ex: 0830)"
            placeholderTextColor="#8a8a8a"
            keyboardType="number-pad"
            maxLength={5}
            value={form.time}
            onChangeText={(v) => setForm({ ...form, time: maskTime(v) })}
          />
        </View>

        <View style={s.twoCols}>
          <TextInput
            style={[s.input, s.half]}
            placeholder="Data de início"
            placeholderTextColor="#8a8a8a"
            keyboardType="number-pad"
            maxLength={10}
            value={form.start}
            onChangeText={(v) => setForm({ ...form, start: maskDate(v) })}
          />
          <TextInput
            style={[s.input, s.half]}
            placeholder="Data de término"
            placeholderTextColor="#8a8a8a"
            keyboardType="number-pad"
            maxLength={10}
            value={form.end}
            onChangeText={(v) => setForm({ ...form, end: maskDate(v) })}
          />
        </View>

        {!!error && <Text style={s.error}>{error}</Text>}

        <TouchableOpacity style={s.addBtn} onPress={add}>
          <Text style={s.btnText}>+ Adicionar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const NAVY = '#2c4f7c';
const INK = '#111';
const LINE = '#222';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  scroll: { paddingHorizontal: 16, paddingBottom: 30 },
  menu: { alignSelf: 'flex-start', marginTop: 4 },
  logoBox: { alignItems: 'center', marginTop: 4 },
  logoText: { fontSize: 24, fontWeight: '800', color: '#2c5f7c', marginTop: 2 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: INK, textAlign: 'center', marginVertical: 18 },

  panel: { borderWidth: 1, borderColor: '#cfcfcf', borderRadius: 12, padding: 12, marginBottom: 16 },
  panelTitle: { fontSize: 19, fontWeight: '800', color: INK, marginBottom: 12 },
  table: { borderWidth: 1, borderColor: LINE, borderRadius: 12, overflow: 'hidden', paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  borderTop: { borderTopWidth: 1, borderColor: LINE },
  borderLeft: { borderLeftWidth: 1, borderColor: LINE },
  cell: { paddingVertical: 12, paddingHorizontal: 6, textAlign: 'center', color: INK, fontSize: 14, fontWeight: '500' },
  head: { fontWeight: '800', paddingVertical: 18 },
  emptyRow: { flex: 1, textAlign: 'center', color: '#8a8a8a', paddingVertical: 14 },
  hint: { color: '#8a8a8a', fontSize: 12, textAlign: 'center', marginTop: 8 },

  input: {
    borderWidth: 1, borderColor: '#d0d0d0', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 12, marginBottom: 12,
    backgroundColor: '#fff', fontSize: 13, color: INK,
  },
  qtyBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden' },
  qtyInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, fontSize: 13, color: INK },
  unitRow: { flexDirection: 'row', alignSelf: 'stretch' },
  unitBtn: { paddingHorizontal: 10, justifyContent: 'center', backgroundColor: '#eef1f5', borderLeftWidth: 1, borderColor: '#d0d0d0' },
  unitBtnOn: { backgroundColor: NAVY },
  unitText: { fontSize: 12, fontWeight: '700', color: '#555' },
  unitTextOn: { color: '#fff' },
  twoCols: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },

  error: { color: '#c0392b', marginBottom: 10, fontWeight: '600' },
  addBtn: { backgroundColor: NAVY, paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  confirmBox: { alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fafafa' },
  confirmText: { color: INK, fontWeight: '600', marginBottom: 8 },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
});