import React from 'react';
import { Linking, Text, View } from 'react-native';
import { Button, Card, Icon, Progress } from './ui';
import { s, palette } from './styles';
import { useBudgetStore } from './store';

const source = 'https://www.sbs.gob.pe/usuarios/aprende-con-la-sbs/claves-para-ahorrar';
const lessons = [
  { id: 'budget', title: '01 · Reconoce tus gastos', text: 'Anota lo que recibes y lo que gastas. Separar alimentación, movilidad y materiales te ayuda a revisar el presupuesto antes de decidir.', action: 'Hoy: registra un gasto que normalmente olvidarías.' },
  { id: 'goal', title: '02 · Ahorra con un propósito', text: 'Define qué quieres lograr y cuánto necesitas. Reservar una parte de tus ingresos facilita dar seguimiento a esa meta.', action: 'Hoy: escribe una meta concreta en Mi plan.' },
  { id: 'review', title: '03 · Revisa y ajusta', text: 'Compara tu consumo con los límites que definiste. Un presupuesto se revisa cuando cambian los ingresos o las necesidades.', action: 'Hoy: revisa una categoría antes de la próxima compra.' },
];
export function Learning() {
  const { store, setStore } = useBudgetStore();
  const count = lessons.filter(l => store.completedLessons.includes(l.id)).length;
  return <View style={{ gap: 20 }}><View style={s.daily}><View style={s.between}><View><Text style={s.cardTitle}>Aprender también es avanzar</Text><Text style={s.subtitle}>{count} de 3 lecturas marcadas</Text></View><Icon name="book-open" size={26}/></View><Progress used={count} limit={3} color={palette.green}/><Text style={s.small}>Material gratuito para estudiantes y sus familias. Marcar una lectura registra tu avance, sin evaluar conocimientos.</Text></View>
    {lessons.map(lesson => { const done = store.completedLessons.includes(lesson.id); return <Card key={lesson.id} title={lesson.title}><Text style={s.subtitle}>{lesson.text}</Text><Text style={[s.small, { color: palette.green }]}>{lesson.action}</Text><Button title={done ? 'Lectura completada' : 'Marcar como leída'} accessibilityLabel={(done ? 'Desmarcar lectura ' : 'Marcar lectura ') + lesson.title.slice(0, 2)} icon={done ? 'check-circle' : 'circle'} secondary={done} onPress={() => setStore(old => ({ ...old, completedLessons: done ? old.completedLessons.filter(id => id !== lesson.id) : [...old.completedLessons, lesson.id] }))}/></Card>; })}
    <Card title="Consulta una fuente confiable"><Text style={s.small}>Contenido breve adaptado a partir de las orientaciones de la SBS sobre presupuesto y ahorro. La aplicación no está afiliada a la SBS.</Text><Button title="Abrir recurso de la SBS" secondary icon="external-link" onPress={() => { Linking.openURL(source).catch(() => undefined); }}/></Card>
  </View>;
}
