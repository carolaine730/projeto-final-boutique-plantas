import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseReady } from '../services/firebase';
import { demoPlants, Plant } from '../data/plants';

type Store = { plants: Plant[]; favorites: string[]; cart: Record<string, number>; loading: boolean; plantsLoading: boolean; toggleFavorite: (id: string) => void; addToCart: (id: string) => void; changeQty: (id: string, by: number) => void; savePlant: (plant: Plant) => Promise<void>; removePlant: (id: string) => Promise<void>; placeOrder: () => Promise<void> };
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: PropsWithChildren) {
  const [plants, setPlants] = useState<Plant[]>(demoPlants);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(Boolean(db));
  useEffect(() => { AsyncStorage.multiGet(['@rf/favorites','@rf/cart']).then(([f,c]) => { if (f[1]) setFavorites(JSON.parse(f[1])); if (c[1]) setCart(JSON.parse(c[1])); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { AsyncStorage.setItem('@rf/favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { AsyncStorage.setItem('@rf/cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'plants'), snap => { const cloud = snap.docs.map(d => ({ ...d.data(), id: d.id } as Plant)); setPlants(cloud.length ? cloud : demoPlants); setPlantsLoading(false); }, () => { setPlants(demoPlants); setPlantsLoading(false); });
  }, []);
  const value = useMemo<Store>(() => ({ plants, favorites, cart, loading, plantsLoading,
    toggleFavorite: id => setFavorites(v => v.includes(id) ? v.filter(x => x !== id) : [...v,id]),
    addToCart: id => setCart(v => ({ ...v, [id]: (v[id] || 0) + 1 })),
    changeQty: (id, by) => setCart(v => { const n=(v[id]||0)+by; const next={...v}; if(n<=0) delete next[id]; else next[id]=n; return next; }),
    savePlant: async p => { if (db) await setDoc(doc(db,'plants',p.id),JSON.parse(JSON.stringify(p))); else setPlants(v => [p,...v.filter(x=>x.id!==p.id)]); },
    removePlant: async id => { if (db) await deleteDoc(doc(db,'plants',id)); else setPlants(v=>v.filter(x=>x.id!==id)); },
    placeOrder: async () => { const items=Object.entries(cart).map(([id,qty])=>({plantId:id,qty,plantName:plants.find(p=>p.id===id)?.name||id})); if(db) await addDoc(collection(db,'orders'),{items,createdAt:serverTimestamp(),status:'recebido'}); setCart({}); }
  }),[plants,favorites,cart,loading,plantsLoading]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useStore = () => { const v=useContext(Context); if(!v) throw new Error('StoreProvider ausente'); return v; };
export const usingFirebase = firebaseReady;
