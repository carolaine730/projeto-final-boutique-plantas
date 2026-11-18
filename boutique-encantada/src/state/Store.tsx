import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { demoPlants, Plant } from '../data/plants';
import {
  authenticateVisitor,
  auth,
  db,
  firebaseReady,
} from '../services/firebase';
import { ADMIN_UID } from '../services/admin';

type Store = {
  plants: Plant[];
  favorites: string[];
  cart: Record<string, number>;
  loading: boolean;
  toggleFavorite: (id: string) => void;
  addToCart: (id: string) => void;
  changeQty: (id: string, by: number) => void;
  savePlant: (plant: Plant) => Promise<void>;
  removePlant: (id: string) => Promise<void>;
  placeOrder: () => Promise<void>;
};

const Context = createContext<Store | null>(null);

async function requireAdmin() {
  if (!auth || !db) {
    throw new Error('Firebase não configurado.');
  }

  await auth.authStateReady();

  if (auth.currentUser?.uid !== ADMIN_UID) {
    throw new Error('Entre com a conta de administrador.');
  }
}

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

        try {
          const saved: unknown = JSON.parse(favoriteEntry[1] || '[]');

          if (Array.isArray(saved)) {
            setFavorites(
              saved.filter((id): id is string => typeof id === 'string')
            );
          }
        } catch {
          setFavorites([]);
        }

        try {
          const saved: unknown = JSON.parse(cartEntry[1] || '{}');

          if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
            const validCart: Record<string, number> = {};

            for (const [id, quantity] of Object.entries(saved)) {
              if (
                typeof quantity === 'number' &&
                Number.isInteger(quantity) &&
                quantity > 0
              ) {
                validCart[id] = quantity;
              }
            }

            setCart(validCart);
          }
        } catch {
          setCart({});
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setHydrated(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(
      '@boutique/favorites',
      JSON.stringify(favorites)
    ).catch(() => undefined);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(
      '@boutique/cart',
      JSON.stringify(cart)
    ).catch(() => undefined);
  }, [cart, hydrated]);

  useEffect(() => {
    if (!db) return;

    return onSnapshot(
      collection(db, 'plants'),
      snapshot => {
        const catalog = new Map(
          demoPlants.map(plant => [plant.id, plant])
        );

        for (const item of snapshot.docs) {
          const data = item.data();

          if (data.deleted === true) {
            catalog.delete(item.id);
          } else {
            catalog.set(item.id, {
              ...catalog.get(item.id),
              ...data,
              id: item.id,
            } as Plant);
          }
        }

        setPlants(Array.from(catalog.values()));
      },
      error => {
        console.warn(
          'Falha ao atualizar o catálogo do Firestore:',
          error.message
        );
      }
    );
  }, []);

  const value = useMemo<Store>(
    () => ({
      plants,
      favorites,
      cart,
      loading,

      toggleFavorite: id => {
        setFavorites(current =>
          current.includes(id)
            ? current.filter(item => item !== id)
            : [...current, id]
        );
      },

      addToCart: id => {
        if (!plants.some(plant => plant.id === id)) return;

        setCart(current => ({
          ...current,
          [id]: (current[id] || 0) + 1,
        }));
      },

      changeQty: (id, by) => {
        if (!Number.isInteger(by)) return;

        setCart(current => {
          const quantity = (current[id] || 0) + by;
          const next = { ...current };

          if (quantity <= 0) {
            delete next[id];
          } else {
            next[id] = quantity;
          }

          return next;
        });
      },

      savePlant: async plant => {
        await requireAdmin();

        if (!db) throw new Error('Firebase não configurado.');

        const fields = Object.fromEntries(
          Object.entries(plant).filter(([, value]) => value !== undefined)
        );

        const existing = plants.find(item => item.id === plant.id);

        const data = Object.fromEntries(
          Object.entries({
            ...existing,
            ...fields,
            id: plant.id,
            deleted: false,
          }).filter(([, value]) => value !== undefined)
        );

        await setDoc(doc(db, 'plants', plant.id), data);
      },

      removePlant: async id => {
        await requireAdmin();

        if (!db) throw new Error('Firebase não configurado.');

        // Mantém um registro para ocultar também os produtos locais.
        await setDoc(doc(db, 'plants', id), {
          id,
          deleted: true,
        });

        setFavorites(current => current.filter(item => item !== id));

        setCart(current => {
          const next = { ...current };
          delete next[id];
          return next;
        });
      },

      placeOrder: async () => {
        if (!db) {
          throw new Error(
            'Firebase não configurado. O pedido não foi enviado.'
          );
        }

        if (!hydrated) {
          throw new Error('Aguarde o carregamento da sacola.');
        }

        const user = await authenticateVisitor();

        const items = Object.entries(cart).map(([id, quantity]) => {
          const plant = plants.find(item => item.id === id);

          if (!plant) {
            throw new Error(
              'Um produto da sacola não está mais disponível. Remova-o antes de continuar.'
            );
          }

          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('Quantidade inválida na sacola.');
          }

          if (!Number.isFinite(plant.price) || plant.price <= 0) {
            throw new Error(`Preço inválido para ${plant.name}.`);
          }

          const unitPriceInCents = Math.round(plant.price * 100);

          return {
            plantId: id,
            plantName: plant.name,
            unitPrice: unitPriceInCents / 100,
            quantity,
            lineTotal: (unitPriceInCents * quantity) / 100,
          };
        });

        if (!items.length) {
          throw new Error('A sacola está vazia.');
        }

        if (items.length > 50) {
          throw new Error('O pedido permite até 50 produtos diferentes.');
        }

        const totalInCents = items.reduce(
          (sum, item) => sum + Math.round(item.lineTotal * 100),
          0
        );

        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          items,
          total: totalInCents / 100,
          createdAt: serverTimestamp(),
          status: 'recebido',
        });

        setCart(current => {
          const next = { ...current };

          for (const item of items) {
            const remaining = (next[item.plantId] || 0) - item.quantity;

            if (remaining > 0) {
              next[item.plantId] = remaining;
            } else {
              delete next[item.plantId];
            }
          }

          return next;
        });
      },
    }),
    [plants, favorites, cart, loading, hydrated]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

export function useStore() {
  const value = useContext(Context);

  if (!value) {
    throw new Error('StoreProvider ausente na raiz do aplicativo.');
  }

  return value;
}

export const usingFirebase = firebaseReady;