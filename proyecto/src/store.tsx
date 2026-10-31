import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialStore, validDate, type Store } from './model';

const KEY = 'unibudget-social-lab05-v1';
type State = { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; ready: boolean; storageError: string };
const Context = createContext<State | null>(null);
function validate(value: unknown): value is Store {
  const s = value as Store;
  return !!s && Array.isArray(s.movements) && s.movements.every(m => typeof m.id === 'string' && ['income', 'expense'].includes(m.type) && Number.isSafeInteger(m.cents) && m.cents > 0 && typeof m.description === 'string' && typeof m.category === 'string' && validDate(m.date))
    && !!s.budget && Number.isSafeInteger(s.budget.monthly) && s.budget.monthly > 0 && validDate(s.budget.nextIncome) && !!s.budget.limits && Object.values(s.budget.limits).every(n => Number.isSafeInteger(n) && n >= 0)
    && !!s.goal && typeof s.goal.name === 'string' && Number.isSafeInteger(s.goal.target) && s.goal.target > 0 && Number.isSafeInteger(s.goal.reserved) && s.goal.reserved >= 0 && s.goal.reserved <= s.goal.target
    && Array.isArray(s.completedLessons) && s.completedLessons.every(id => typeof id === 'string') && typeof s.demo === 'boolean';
}
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(() => initialStore());
  const [ready, setReady] = useState(false);
  const [storageError, setError] = useState('');
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (!validate(saved)) throw new Error('Datos incompatibles');
          if (active) setStore(saved);
        }
      } catch { if (active) setError('No se pudieron recuperar los datos locales. Comprueba el almacenamiento del dispositivo.'); }
      finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (ready && !storageError) AsyncStorage.setItem(KEY, JSON.stringify(store)).catch(() => setError('No se pudieron guardar los cambios. El almacenamiento no está disponible.'));
  }, [store, ready, storageError]);
  return <Context.Provider value={{ store, setStore, ready, storageError }}>{children}</Context.Provider>;
}
export function useBudgetStore() { const state = useContext(Context); if (!state) throw new Error('StoreProvider no disponible'); return state; }
