import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Field, Progress } from './ui';
import { s, palette } from './styles';
import { money, totals } from './model';
import { useBudgetStore } from './store';
export function Goal() {
  const { store, setStore } = useBudgetStore();
  const [name, setName] = useState(store.goal.name);
  const [target, setTarget] = useState(String(store.goal.target / 100));
  const [reserved, setReserved] = useState(String(store.goal.reserved / 100));
  const [notice, setNotice] = useState('');
  function save() {
    const goal = Math.round(Number(target.replace(',', '.')) * 100), saved = Math.round(Number(reserved.replace(',', '.')) * 100);
    if (!name.trim() || !Number.isSafeInteger(goal) || goal <= 0 || goal > 100000000 || !Number.isSafeInteger(saved) || saved < 0 || saved > goal || saved > Math.max(0, totals(store).balance)) return setNotice('Revisa los datos: la reserva no puede superar la meta ni tu saldo disponible.');
    setStore(old => ({ ...old, goal: { name: name.trim(), target: goal, reserved: saved } })); setNotice('Meta de ahorro guardada');
  }
  return <Card title="Mi meta de ahorro"><Text style={s.small}>La reserva es una asignación de tu saldo, no un depósito bancario. Se descuenta del cálculo diario para evitar gastarla.</Text><View><Field label="Nombre de la meta" value={name} onChangeText={setName} maxLength={80}/><Field label="Objetivo en soles" value={target} onChangeText={setTarget} keyboardType="decimal-pad"/><Field label="Reserva en soles" value={reserved} onChangeText={setReserved} keyboardType="decimal-pad"/>{!!notice && <Text accessibilityRole="alert" style={[s.small, { marginBottom: 10 }]}>{notice}</Text>}<Button title="Guardar meta de ahorro" icon="target" onPress={save}/></View><Progress used={store.goal.reserved} limit={store.goal.target} color={palette.green}/><Text style={s.small}>{money(store.goal.reserved)} reservado de {money(store.goal.target)} · {Math.round(store.goal.reserved / store.goal.target * 100)}%</Text></Card>;
}
