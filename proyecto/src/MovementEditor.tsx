import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Button, Field, Icon } from './ui';
import { s, palette } from './styles';
import { categories, today, validDate, type Movement } from './model';

export function MovementEditor({ current, onClose, onSave, onDelete }: { current?: Movement; onClose: () => void; onSave: (m: Movement) => void; onDelete: (id: string) => void }) {
  const [type, setType] = useState<'income' | 'expense'>(current?.type || 'expense');
  const [amount, setAmount] = useState(current ? String(current.cents / 100) : '');
  const [category, setCategory] = useState(current?.category || categories[0]);
  const [description, setDescription] = useState(current?.description || '');
  const [date, setDate] = useState(current?.date || today());
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  function save() {
    const n = Number(amount.replace(',', '.'));
    if (!Number.isFinite(n) || n <= 0 || n > 1000000) return setError('Ingresa un monto mayor a cero y hasta S/ 1 000 000.');
    if (!description.trim()) return setError('Escribe una descripción para identificar el movimiento.');
    if (!validDate(date)) return setError('La fecha debe ser válida y tener formato AAAA-MM-DD.');
    onSave({ id: current?.id || Date.now().toString(), type, cents: Math.round(n * 100), category: type === 'income' ? 'Ingreso' : category, description: description.trim(), date });
  }
  return <Modal visible transparent animationType="fade" onRequestClose={onClose}><View style={s.overlay}><View style={s.modal}><ScrollView keyboardShouldPersistTaps="handled">
    <View style={[s.between, { marginBottom: 22 }]}><View><Text style={s.eyebrow}>REGISTRO RÁPIDO</Text><Text style={[s.title, { fontSize: 23 }]}>{current ? 'Editar movimiento' : 'Nuevo movimiento'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Cerrar formulario" onPress={onClose}><Icon name="x" color={palette.muted}/></Pressable></View>
    <View style={[s.row, { marginBottom: 20 }]}>{(['expense', 'income'] as const).map(t => <Pressable key={t} accessibilityRole="button" accessibilityLabel={t === 'expense' ? 'Tipo gasto' : 'Tipo ingreso'} onPress={() => setType(t)} style={[s.pill, { flex: 1, alignItems: 'center' }, type === t && s.pillActive]}><Text style={[s.pillText, type === t && s.pillActiveText]}>{t === 'expense' ? 'Gasto' : 'Ingreso'}</Text></Pressable>)}</View>
    <Field label="Monto en soles" placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad"/>
    {type === 'expense' && <View style={s.field}><Text style={s.label}>Categoría</Text><View style={[s.row, { flexWrap: 'wrap', gap: 7 }]}>{categories.map(c => <Pressable key={c} accessibilityRole="button" accessibilityLabel={'Categoría ' + c} onPress={() => setCategory(c)} style={[s.pill, c === category && s.pillActive]}><Text style={[s.pillText, c === category && s.pillActiveText]}>{c}</Text></Pressable>)}</View></View>}
    <Field label="Descripción" placeholder="Ej. Almuerzo en el campus" maxLength={100} value={description} onChangeText={setDescription}/>
    <Field label="Fecha AAAA-MM-DD" placeholder="2026-10-25" value={date} onChangeText={setDate}/>
    {!!error && <Text accessibilityRole="alert" style={[s.error, { marginBottom: 12 }]}>{error}</Text>}
    <Button title={current ? 'Guardar cambios' : 'Guardar movimiento'} icon="check" onPress={save}/>
    {current && <View style={{ marginTop: 12 }}>{confirmDelete ? <><Text style={[s.error, { marginBottom: 10 }]}>¿Eliminar este movimiento de forma permanente?</Text><Button title="Confirmar eliminación" secondary onPress={() => onDelete(current.id)}/></> : <Button title="Eliminar movimiento" secondary icon="trash-2" onPress={() => setConfirmDelete(true)}/>}</View>}
  </ScrollView></View></View></Modal>;
}
