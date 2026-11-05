import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import { Product, StoreSettings } from '../types';

// Configuração do Firebase obtida estritamente de variáveis de ambiente
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
};

if (!isFirebaseConfigured() && import.meta.env.DEV) {
  console.warn(
    '⚠️ [Fibrarte] Variáveis de ambiente do Firebase não configuradas. ' +
    'Certifique-se de preencher as chaves VITE_FIREBASE_* no arquivo .env ou no painel da Vercel.'
  );
}

let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (err) {
    console.error('Erro ao inicializar Firebase Firestore:', err);
  }
}

// -------------------------------------------------------------
// OPERAÇÕES EM TEMPO REAL: PRODUTOS
// -------------------------------------------------------------

export function subscribeToProducts(
  onProductsUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    return () => {};
  }

  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || undefined,
          photoData: data.photoData || '',
          createdAt: data.createdAt || Date.now()
        });
      });
      onProductsUpdate(items);
    },
    (error) => {
      console.error('Erro ao escutar produtos no Firestore:', error);
      if (onError) onError(error);
    }
  );
}

export async function getCloudProductsOnce(): Promise<Product[]> {
  if (!db) return [];
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items: Product[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || undefined,
        photoData: data.photoData || '',
        createdAt: data.createdAt || Date.now()
      });
    });
    return items;
  } catch (e) {
    console.warn('Erro ao obter produtos da nuvem:', e);
    return [];
  }
}

export async function saveProductToCloud(product: Product): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, {
    name: product.name,
    description: product.description,
    price: product.price || null,
    photoData: product.photoData,
    createdAt: product.createdAt
  });
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// OPERAÇÕES EM TEMPO REAL: CONFIGURAÇÕES DA LOJA (WHATSAPP)
// -------------------------------------------------------------

export function subscribeToStoreSettings(
  onSettingsUpdate: (settings: StoreSettings) => void
): () => void {
  if (!db) {
    return () => {};
  }

  const settingsDocRef = doc(db, 'settings', 'store');
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onSettingsUpdate({
          contactPhone: data.contactPhone || '85999999999',
          storeName: data.storeName || 'Fibrarte'
        });
      }
    },
    (error) => {
      console.warn('Configurações não encontradas ou erro ao carregar:', error);
    }
  );
}

export async function saveStoreSettingsToCloud(settings: StoreSettings): Promise<void> {
  if (!db) return;
  const settingsDocRef = doc(db, 'settings', 'store');
  await setDoc(
    settingsDocRef,
    {
      contactPhone: settings.contactPhone,
      storeName: settings.storeName || 'Fibrarte',
      updatedAt: Date.now()
    },
    { merge: true }
  );
}
