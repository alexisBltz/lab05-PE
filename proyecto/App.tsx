import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, TextInput, useWindowDimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, usePathname } from 'expo-router';
import { useBudgetStore } from './src/store';
import { Learning } from './src/Learning';
import { Goal } from './src/Goal';
import { DataControls } from './src/DataControls';
import { Button, Card, Field, Icon, Progress } from './src/ui';
import { s, palette } from './src/styles';
import { categories, money, today, totals, validDate, type Movement } from './src/model';
import { MovementEditor } from './src/MovementEditor';

const tabs = [ { id: 'home', label: 'Inicio', icon: 'grid' }, { id: 'activity', label: 'Actividad', icon: 'list' }, { id: 'budget', label: 'Mi plan', icon: 'sliders' }, { id: 'stats', label: 'Análisis', icon: 'bar-chart-2' }, { id: 'learn', label: 'Aprende', icon: 'book-open' } ] as const;


export default function App() {
  const wide = useWindowDimensions().width >= 900;
  const { store, setStore, ready, storageError } = useBudgetStore();
  const pathname = usePathname();
  const tab = pathname.split('/').filter(Boolean).pop() || 'home';
  const [editor, setEditor] = useState<Movement | 'new' | null>(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const [notice, setNotice] = useState('');
  const [plan, setPlan] = useState('');
  const [next, setNext] = useState('');
  const [limits, setLimits] = useState<Record<string, string>>({});
  const t = totals(store);
  const amount = (n: number) => privateMode ? 'S/ ••••' : money(n);
  const navigate = (id: string) => { router.replace((id === 'home' ? '/' : '/' + id) as '/' | '/activity' | '/budget' | '/stats' | '/learn'); };
  const saveMovement = (movement: Movement) => { setStore(old => ({ ...old, movements: [...old.movements.filter(m => m.id !== movement.id), movement] })); setEditor(null); setNotice('Movimiento guardado'); };
  function saveBudget() {
    const monthly = Number(plan || store.budget.monthly / 100), date = next || store.budget.nextIncome;
    if (!Number.isFinite(monthly) || monthly <= 0 || monthly > 1000000) return setNotice('El presupuesto debe ser mayor a cero y hasta S/ 1 000 000.');
    if (!validDate(date) || date < today()) return setNotice('El próximo ingreso debe tener una fecha válida desde hoy.');
    const updated: Record<string, number> = {};
    for (const c of categories) { const value = Number(limits[c] ?? store.budget.limits[c] / 100); if (!Number.isFinite(value) || value < 0 || value > 1000000) return setNotice('Revisa el límite de ' + c); updated[c] = Math.round(value * 100); }
    setStore(old => ({ ...old, budget: { monthly: Math.round(monthly * 100), nextIncome: date, limits: updated } })); setNotice('Plan guardado');
  }
  const movementRows = (items: Movement[]) => items.length ? items.map(m => <Pressable key={m.id} accessibilityRole="button" accessibilityLabel={'Editar ' + m.description} onPress={() => setEditor(m)} style={s.movement}><View style={[s.movementIcon, { backgroundColor: m.type === 'income' ? '#edf4e2' : '#fff0e5' }]}><Icon name={m.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'} color={m.type === 'income' ? palette.green : '#b47850'}/></View><View style={{ flex: 1, gap: 4 }}><Text style={s.movementTitle} numberOfLines={1}>{m.description}</Text><Text style={s.small}>{m.category} · {m.date.slice(8, 10)}/{m.date.slice(5, 7)}</Text></View><Text style={[s.amount, m.type === 'income' && { color: palette.green }]}>{m.type === 'income' ? '+' : '−'}{amount(m.cents)}</Text></Pressable>) : <Text style={s.small}>Todavía no hay movimientos. Agrega uno para comenzar.</Text>;
  const categoryRows = (showLimits = false) => t.byCategory.map(c => <View key={c.name} style={s.category}><View style={s.between}><View style={s.row}><View style={[s.dot, { backgroundColor: c.color }]}/><Text style={s.small}>{c.name}</Text></View><Text style={[s.amount, { fontSize: 11 }]}>{amount(c.spent)}{showLimits ? ' / ' + amount(c.limit) : ''}</Text></View><Progress used={c.spent} limit={showLimits ? c.limit : t.expense} color={c.color}/>{showLimits && c.limit > 0 && c.spent > c.limit && <Text style={[s.error, { marginTop: 4 }]}>Límite superado</Text>}</View>);
  if (!ready) return <View style={[s.root, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={palette.green}/><Text style={s.small}>Preparando tu espacio…</Text></View>;
  return <View style={[s.root, { flexDirection: 'row' }]}><StatusBar style="dark"/>
    {wide && <View style={s.sidebar}><View style={s.row}><View style={s.logo}><Text style={{ fontWeight: '900', fontSize: 25, color: palette.green }}>U</Text></View><Text style={[s.brand, { color: '#fff' }]}>UniBudget</Text></View><Text style={[s.eyebrow, { color: '#91a7ad', marginTop: 24 }]}>TU ESPACIO FINANCIERO</Text><View style={{ gap: 9 }}>{tabs.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={'Ir a ' + item.label} onPress={() => navigate(item.id)} style={[s.sideNav, tab === item.id && s.sideActive]}><Icon name={item.icon} color={tab === item.id ? palette.lime : '#b8c9cc'}/><Text style={s.sideText}>{item.label}</Text></Pressable>)}</View><View style={{ marginTop: 'auto', gap: 10 }}><Icon name="feather" color={palette.lime} size={25}/><Text style={{ color: '#fff', fontWeight: '700' }}>Pequeños hábitos. Más calma.</Text><Text style={{ color: '#9cb4ba', lineHeight: 20, fontSize: 11 }}>Un registro a la vez, construye tu tranquilidad financiera.</Text><Text style={{ color: '#829ca5', fontSize: 10, marginTop: 20 }}>React Native + Expo · Laboratorio 05</Text></View></View>}
    <View style={{ flex: 1 }}><View style={[s.header, !wide && { paddingHorizontal: 20, height: 67 }]}>{!wide ? <View style={s.row}><View style={[s.logo, { width: 32, height: 32 }]}><Text style={{ fontSize: 23, fontWeight: '900', color: palette.green }}>U</Text></View><Text style={[s.brand, { fontSize: 20 }]}>UniBudget</Text></View> : <Text style={s.small}>MI ESPACIO / {tabs.find(x => x.id === tab)?.label.toUpperCase()}</Text>}<View style={s.row}><Icon name="shield" size={16}/>{wide && <Text style={s.small}>Datos en tu dispositivo</Text>}<View style={s.avatar}><Text style={{ fontSize: 11, fontWeight: '800', color: palette.green }}>AB</Text></View></View></View>
    <ScrollView contentContainerStyle={[s.content, !wide && s.mobileContent]} keyboardShouldPersistTaps="handled">
      <View style={s.between}><View style={{ flex: 1 }}><Text style={s.eyebrow}>FINANZAS UNIVERSITARIAS</Text><Text accessibilityRole="header" testID="screen-title" style={[s.title, !wide && { fontSize: 25 }]}>{({ home: 'Más claridad para tu día', activity: 'Cada movimiento cuenta', budget: 'Un plan a tu medida', stats: 'Entiende tus hábitos', learn: 'Aprende a tu ritmo' } as Record<string, string>)[tab]}</Text><Text style={s.subtitle}>{({ home: 'Organiza tus soles. Enfócate en lo que importa.', activity: 'Revisa y organiza tus ingresos y gastos.', budget: 'Define límites que acompañen tu vida universitaria.', stats: 'Tu consumo del mes, explicado con claridad.', learn: 'Pequeñas lecturas para decisiones cotidianas.' } as Record<string, string>)[tab]}</Text></View>{wide && <Button title="Nuevo movimiento" icon="plus" onPress={() => setEditor('new')}/>}</View>
      {!!storageError && <Text accessibilityRole="alert" style={s.error}>{storageError}</Text>}
      {!!notice && <View style={s.alert}><Icon name="info" size={17} color={palette.orange}/><Text accessibilityRole="alert" style={[s.small, { flex: 1, color: palette.orange }]}>{notice}</Text></View>}
      {tab === 'home' && <>
        <View style={s.hero}><View style={s.between}><Text style={s.heroLabel}>Tu saldo disponible</Text><View style={s.badge}><Text style={s.badgeText}>{store.demo ? 'DATOS DE EJEMPLO' : 'MI PRESUPUESTO'}</Text></View></View><Text testID="balance" style={s.heroAmount}>{amount(t.balance)}</Text><View style={s.between}><Text style={s.heroFoot}>Un paso más cerca de tus metas</Text><Icon name="trending-up" color={palette.lime} size={24}/></View></View>
        <View style={s.row}><View style={s.metric}><Icon name="arrow-down-left"/><Text style={s.small}>Ingresos del mes</Text><Text testID="income" style={s.metricValue}>{amount(t.income)}</Text></View><View style={s.metric}><Icon name="arrow-up-right" color="#b47950"/><Text style={s.small}>Gastos del mes</Text><Text testID="expense" style={s.metricValue}>{amount(t.expense)}</Text></View></View>
        <View style={s.daily}><View style={s.between}><View><Text style={[s.small, { color: palette.green }]}>Puedes destinar por día</Text><Text testID="daily" style={s.dailyAmount}>{amount(t.daily)}</Text></View><View style={[s.logo, { backgroundColor: '#daeabf', width: 48, height: 48 }]}><Icon name="sun" size={25}/></View></View><Text style={s.small}>{t.days} días hasta tu próximo ingreso · reserva protegida: {amount(store.goal.reserved)}</Text></View>
        {!wide && <Button title="Nuevo movimiento" icon="plus" onPress={() => setEditor('new')}/>}
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20 }}><View style={{ flex: wide ? 1 : undefined }}><Card title="¿A dónde se fue tu dinero?">{categoryRows()}</Card></View><View style={{ flex: wide ? 1 : undefined }}><Card title="Lo más reciente" right={<Pressable accessibilityRole="button" accessibilityLabel="Ver actividad" onPress={() => navigate('activity')}><Icon name="arrow-right"/></Pressable>}><View>{movementRows([...store.movements].reverse().slice(0, 4))}</View></Card></View></View>
      </>}
      {tab === 'learn' && <Learning/>}
      {tab === 'activity' && <Card title="Historial de movimientos"><TextInput accessibilityLabel="Buscar movimiento" placeholder="Buscar por descripción o categoría" value={query} onChangeText={setQuery} style={s.input}/><View style={s.row}>{[{ id: 'all', text: 'Todos' }, { id: 'expense', text: 'Gastos' }, { id: 'income', text: 'Ingresos' }].map(f => <Pressable key={f.id} accessibilityRole="button" accessibilityLabel={'Filtrar ' + f.text} onPress={() => setFilter(f.id)} style={[s.pill, filter === f.id && s.pillActive]}><Text style={[s.pillText, filter === f.id && s.pillActiveText]}>{f.text}</Text></Pressable>)}</View><View>{movementRows([...store.movements].reverse().filter(m => (filter === 'all' || m.type === filter) && (m.description + ' ' + m.category).toLowerCase().includes(query.toLowerCase())))}</View><Button title="Nuevo movimiento" icon="plus" onPress={() => setEditor('new')}/></Card>}
      {tab === 'budget' && <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20 }}><View style={{ flex: wide ? 1 : undefined }}><Card title="Diseña tu plan"><Field label="Presupuesto mensual en soles" value={plan || String(store.budget.monthly / 100)} keyboardType="decimal-pad" onChangeText={setPlan}/><Field label="Próximo ingreso AAAA-MM-DD" value={next || store.budget.nextIncome} onChangeText={setNext}/><Text style={s.cardTitle}>Límites por categoría</Text>{categories.map(c => <Field key={c} label={'Límite ' + c} value={limits[c] ?? String(store.budget.limits[c] / 100)} keyboardType="decimal-pad" onChangeText={value => setLimits(old => ({ ...old, [c]: value }))}/>)}<Button title="Guardar mi plan" icon="check" onPress={saveBudget}/></Card></View><View style={{ flex: wide ? 1 : undefined, gap: 20 }}><Goal/><Card title="Así vas este mes"><Text style={s.small}>Gasto mensual / presupuesto</Text><Text style={s.dailyAmount}>{amount(t.expense)} / {amount(store.budget.monthly)}</Text><Progress used={t.expense} limit={store.budget.monthly} color={palette.green}/><Text style={s.small}>{Math.round(t.expense / store.budget.monthly * 100)}% utilizado</Text>{categoryRows(true)}</Card></View></View>}
      {tab === 'stats' && <><Card title="Distribución del mes"><Text style={s.small}>Cada barra representa el gasto de una categoría en relación con el total mensual.</Text>{t.byCategory.map(c => <View key={c.name} style={{ gap: 7 }}><View style={s.between}><Text style={s.small}>{c.name}</Text><Text style={s.amount}>{t.expense ? Math.round(c.spent / t.expense * 100) : 0}%</Text></View><View style={{ backgroundColor: '#f1f4ef', borderRadius: 5 }}><View style={[s.bar, { backgroundColor: c.color, width: (t.expense ? c.spent / t.expense * 100 : 0) + '%' as `${number}%` }]}/></View></View>)}</Card><Card title="Tu lectura del mes"><View style={s.row}><Icon name="compass"/><Text style={[s.small, { flex: 1 }]}>La categoría con mayor consumo es {t.byCategory.reduce((a, b) => a.spent >= b.spent ? a : b).name}. Revisa sus movimientos antes de ajustar tu plan.</Text></View><Text style={s.small}>Saldo acumulado: {amount(t.balance)}. El límite diario usa el menor valor entre saldo y presupuesto restante.</Text></Card></>}
      <DataControls/>
      <View style={[s.between, { paddingHorizontal: 5 }]}><View style={s.row}><Icon name="eye-off" size={16}/><Text style={s.small}>Ocultar importes</Text></View><Switch accessibilityLabel="Ocultar importes" value={privateMode} onValueChange={setPrivateMode} trackColor={{ false: '#dce4da', true: '#9fbd80' }} thumbColor={privateMode ? palette.green : '#fff'}/></View>
      <Text style={s.notice}>Hecho para tu vida universitaria. Los registros se guardan localmente.</Text>
    </ScrollView>
    {!wide && <View style={s.bottomNav}>{tabs.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={'Ir a ' + item.label} onPress={() => navigate(item.id)} style={s.navItem}><Icon name={item.icon} color={tab === item.id ? palette.green : '#91a19e'} size={20}/><Text style={[s.navText, tab === item.id && s.navActive]}>{item.label}</Text></Pressable>)}</View>}
    </View>
    {!!editor && <MovementEditor current={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} onSave={saveMovement} onDelete={id => { setStore(old => ({ ...old, movements: old.movements.filter(m => m.id !== id) })); setEditor(null); setNotice('Movimiento eliminado'); }}/ >}
  </View>;
}
