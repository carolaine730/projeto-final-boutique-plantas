import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { demoPlants, Plant } from '../data/plants';
import { db, firebaseReady } from '../services/firebase';

type Store = {
  plants: Plant[]; favorites: string[]; cart: Record<string, number>; loading: boolean;
  toggleFavorite: (id: string) => void; addToCart: (id: string) => void;
  changeQty: (id: string, by: number) => void; savePlant: (plant: Plant) => Promise<void>;
  removePlant: (id: string) => Promise<void>; placeOrder: () => Promise<void>;
};
const Context = createContext<Store | null>(null);

export function StoreProvider({ children }: PropsWithChildren) {
  const [plants, setPlants] = useState<Plant[]>(demoPlants);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.multiGet(['@boutique/favorites', '@boutique/cart'])
      .then(([favoriteEntry, cartEntry]) => {
        if (!active) return;
        try { if (favoriteEntry[1]) setFavorites(JSON.parse(favoriteEntry[1])); } catch { setFavorites([]); }
        try { if (cartEntry[1]) setCart(JSON.parse(cartEntry[1])); } catch { setCart({}); }
      })
      .catch(() => undefined)
      .finally(() => { if (active) { setHydrated(true); setLoading(false); } });
    return () => { active = false; };
  }, []);

  useEffect(() => { if (hydrated) AsyncStorage.setItem('@boutique/favorites', JSON.stringify(favorites)).catch(() => undefined); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem('@boutique/cart', JSON.stringify(cart)).catch(() => undefined); }, [cart, hydrated]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(collection(db, 'plants'), snapshot => {
      const cloudPlants = snapshot.docs.map(item => ({ ...item.data(), id: item.id } as Plant));
      setPlants(cloudPlants.length ? cloudPlants : demoPlants);
    }, error => {
      console.warn('Falha ao carregar catálogo do Firestore:', error.message);
      setPlants(demoPlants);
    });
  }, []);

  const value = useMemo<Store>(() => ({
    plants, favorites, cart, loading,
    toggleFavorite: id => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]),
    addToCart: id => setCart(current => ({ ...current, [id]: (current[id] || 0) + 1 })),
    changeQty: (id, by) => setCart(current => {
      const quantity = (current[id] || 0) + by;
      const next = { ...current };
      if (quantity <= 0) delete next[id]; else next[id] = quantity;
      return next;
    }),
    savePlant: async plant => {
      if (db) await setDoc(doc(db, 'plants', plant.id), plant);
      else setPlants(current => [plant, ...current.filter(item => item.id !== plant.id)]);
    },
    removePlant: async id => {
      if (db) await deleteDoc(doc(db, 'plants', id));
      else setPlants(current => current.filter(item => item.id !== id));
      setFavorites(current => current.filter(item => item !== id));
      setCart(current => { const next = { ...current }; delete next[id]; return next; });
    },
    placeOrder: async () => {
      if (!db) throw new Error('Firebase não configurado. O pedido não foi enviado.');
      const items = Object.entries(cart).map(([id, quantity]) => {
        const plant = plants.find(item => item.id === id);
        if (!plant) throw new Error(`Produto ${id} não está mais disponível.`);
        return { plantId: id, plantName: plant.name, unitPrice: plant.price, quantity, lineTotal: plant.price * quantity };
      });
      if (!items.length) throw new Error('A sacola está vazia.');
      const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
      await addDoc(collection(db, 'orders'), { items, total, createdAt: serverTimestamp(), status: 'recebido' });
      setCart({});
    },
  }), [plants, favorites, cart, loading]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error('StoreProvider ausente na raiz do aplicativo.');
  return value;
}
export const usingFirebase = firebaseReady;
