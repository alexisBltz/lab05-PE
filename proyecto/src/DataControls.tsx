import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { Button } from './ui';
import { s } from './styles';
import { initialStore } from './model';
import { useBudgetStore } from './store';
export function DataControls() {
  const { store, setStore } = useBudgetStore();
  const [confirm, setConfirm] = useState(false);
  return <><View style={{ gap: 10 }}><Text style={s.notice}>{store.demo ? 'Estás explorando datos ficticios de demostración.' : 'Estás usando tus registros personales locales.'}</Text><Button title={store.demo ? 'Empezar con mis datos' : 'Cargar datos de ejemplo'} secondary onPress={() => setConfirm(true)}/></View><Modal visible={confirm} transparent animationType="fade" onRequestClose={() => setConfirm(false)}><View style={s.overlay}><View style={[s.modal, { gap: 16 }]}><Text style={s.cardTitle}>Reemplazar los registros actuales</Text><Text style={s.small}>Esta acción reemplazará movimientos, plan, meta y lecturas guardadas en este dispositivo. ¿Deseas continuar?</Text><Button title="Confirmar reemplazo de datos" onPress={() => { setStore(initialStore(!store.demo)); setConfirm(false); }}/><Button title="Cancelar reemplazo" secondary onPress={() => setConfirm(false)}/></View></View></Modal></>;
}
