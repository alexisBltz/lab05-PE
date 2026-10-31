export type Movement = { id: string; type: 'income' | 'expense'; cents: number; category: string; description: string; date: string };
export type Budget = { monthly: number; nextIncome: string; limits: Record<string, number> };
export type Store = { movements: Movement[]; budget: Budget; demo: boolean; goal: { name: string; target: number; reserved: number }; completedLessons: string[] };
export const categories = ['Alimentación', 'Movilidad', 'Materiales', 'Ocio', 'Otros'];
export const colors = ['#f1ab75', '#789deb', '#a994d4', '#dfb755', '#7bb8aa'];
export const today = () => new Date().toLocaleDateString('en-CA');
export const money = (cents: number) => 'S/ ' + (cents / 100).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const futureDate = () => { const d = new Date(); d.setDate(d.getDate() + 14); return d.toLocaleDateString('en-CA'); };
export function initialStore(demo = true): Store {
  return { demo, goal: { name: 'Materiales del próximo ciclo', target: 30000, reserved: demo ? 10000 : 0 }, completedLessons: [], budget: { monthly: 65000, nextIncome: futureDate(), limits: { Alimentación: 15000, Movilidad: 8000, Materiales: 10000, Ocio: 3500, Otros: 5000 } }, movements: demo ? [
    { id: '1', type: 'income', cents: 85000, category: 'Ingreso', description: 'Apoyo familiar', date: today() },
    { id: '2', type: 'income', cents: 32000, category: 'Ingreso', description: 'Tutorías de matemática', date: today() },
    { id: '3', type: 'expense', cents: 9700, category: 'Alimentación', description: 'Almuerzos de la semana', date: today() },
    { id: '4', type: 'expense', cents: 3600, category: 'Movilidad', description: 'Pasajes al campus', date: today() },
    { id: '5', type: 'expense', cents: 4500, category: 'Materiales', description: 'Cuaderno y copias', date: today() },
    { id: '6', type: 'expense', cents: 4200, category: 'Ocio', description: 'Salida de fin de semana', date: today() },
  ] : [] };
}
export function totals(store: Store) {
  const month = today().slice(0, 7);
  const current = store.movements.filter(m => m.date.startsWith(month));
  const income = current.filter(m => m.type === 'income').reduce((n, m) => n + m.cents, 0);
  const expense = current.filter(m => m.type === 'expense').reduce((n, m) => n + m.cents, 0);
  const balance = store.movements.reduce((n, m) => n + (m.type === 'income' ? m.cents : -m.cents), 0);
  const days = Math.max(0, Math.round((Date.parse(store.budget.nextIncome + 'T12:00:00') - Date.parse(today() + 'T12:00:00')) / 86400000) + 1);
  const daily = days ? Math.max(0, (Math.min(balance, store.budget.monthly - expense) - store.goal.reserved) / days) : 0;
  const byCategory = categories.map((name, i) => ({ name, color: colors[i], spent: current.filter(m => m.type === 'expense' && m.category === name).reduce((n, m) => n + m.cents, 0), limit: store.budget.limits[name] || 0 }));
  return { income, expense, balance, days, daily, byCategory };
}
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
