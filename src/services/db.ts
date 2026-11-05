import { Product, CraftPiece, StoreSettings } from '../types';

const DB_NAME = 'fibrarte_db';
const DB_VERSION = 1;
const STORE_PIECES = 'pieces';
const STORE_ARTISANS = 'artisans';
const STORAGE_SETTINGS_KEY = 'fibrarte_store_settings';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_ARTISANS)) {
        db.createObjectStore(STORE_ARTISANS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORE_PIECES)) {
        const pieceStore = db.createObjectStore(STORE_PIECES, { keyPath: 'id' });
        pieceStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Configurações da Loja (Telefone de Contato para Pedidos)
export function getStoreSettings(): StoreSettings {
  try {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.contactPhone === 'string') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao ler configurações da loja:', e);
  }

  // Número padrão inicial (pode ser editado a qualquer momento na Gestão)
  return {
    contactPhone: '85999999999',
    storeName: 'Fibrarte'
  };
}

export function saveStoreSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Erro ao salvar configurações da loja:', e);
  }
}

// Inicializa produtos modelo se o banco estiver vazio ou atualiza antigos
export async function initDatabase(): Promise<void> {
  const pieces = await getAllProducts();

  const samplePhotos = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23EAD7C3"/><circle cx="300" cy="300" r="220" fill="%23C89D70" stroke="%238C5B3E" stroke-width="12"/><circle cx="300" cy="300" r="160" fill="%23B88655" stroke="%23704328" stroke-width="10"/><circle cx="300" cy="300" r="100" fill="%23996839"/><path d="M120 300 Q300 200 480 300 Q300 400 120 300" stroke="%235A331A" stroke-width="8" fill="none"/><path d="M300 120 Q200 300 300 480 Q400 300 300 120" stroke="%235A331A" stroke-width="8" fill="none"/><text x="300" y="550" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Cesto em Fibra de Bananeira</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23FAF6F0"/><circle cx="300" cy="300" r="230" fill="%23C29B72" stroke="%23684224" stroke-width="12" stroke-dasharray="8 6"/><circle cx="300" cy="300" r="180" fill="%23DFBE99" stroke="%238B5A2B" stroke-width="10"/><circle cx="300" cy="300" r="120" fill="%23F3DFCA" stroke="%23A06B37" stroke-width="8"/><circle cx="300" cy="300" r="50" fill="%23A06B37"/><text x="300" y="560" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Sousplat em Bananeira</text></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23F4EDE4"/><path d="M220 180 C220 100 380 100 380 180" fill="none" stroke="%23996839" stroke-width="18" stroke-linecap="round"/><path d="M160 180 L440 180 L410 480 L190 480 Z" fill="%23DDB98B" stroke="%238B5A2B" stroke-width="10"/><line x1="200" y1="240" x2="400" y2="240" stroke="%238B5A2B" stroke-width="6"/><line x1="190" y1="320" x2="410" y2="320" stroke="%238B5A2B" stroke-width="6"/><line x1="180" y1="400" x2="420" y2="400" stroke="%238B5A2B" stroke-width="6"/><text x="300" y="550" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Bolsa em Fibra de Bananeira</text></svg>'
  ];

  // Atualiza automaticamente produtos de exemplo antigos para fibra de bananeira
  for (const p of pieces) {
    if (p.id === 'prod-1' && (p.name.includes('Taboa') || p.description.includes('taboa'))) {
      p.name = 'Cesto Trançado em Fibra de Bananeira';
      p.description = 'Cesto artesanal trançado com a fibra extraída do tronco da bananeira. Ideal para pães, frutas ou decoração aconchegante de mesa posta.';
      p.photoData = samplePhotos[0];
      await saveProduct(p);
    } else if (p.id === 'prod-2' && (p.name.includes('Carnaúba') || p.description.includes('carnaúba'))) {
      p.name = 'Sousplat em Fibra de Bananeira';
      p.description = 'Conjunto artesanal de sousplat trançado com fibra de bananeira selecionada. Trama circular com acabamento reforçado e toque rústico sofisticado.';
      p.photoData = samplePhotos[1];
      await saveProduct(p);
    } else if (p.id === 'prod-3' && (p.name.includes('Carnaúba') || p.description.includes('carnaúba'))) {
      p.name = 'Bolsa Alça em Fibra de Bananeira';
      p.description = 'Bolsa espaçosa e elegante em fibra natural de bananeira, com alça de mão reforçada. Leve, resistente e 100% ecológica.';
      p.photoData = samplePhotos[2];
      await saveProduct(p);
    }
  }

  if (pieces.length === 0) {
    const defaultProducts: Product[] = [
      {
        id: 'prod-1',
        name: 'Cesto Trançado em Fibra de Bananeira',
        description: 'Cesto artesanal trançado com a fibra extraída do tronco da bananeira. Ideal para pães, frutas ou decoração aconchegante de mesa posta.',
        price: 'R$ 45,00',
        photoData: samplePhotos[0],
        createdAt: Date.now() - 86400000 * 2
      },
      {
        id: 'prod-2',
        name: 'Sousplat em Fibra de Bananeira',
        description: 'Conjunto artesanal de sousplat trançado com fibra de bananeira selecionada. Trama circular com acabamento reforçado e toque rústico sofisticado.',
        price: 'R$ 35,00',
        photoData: samplePhotos[1],
        createdAt: Date.now() - 86400000
      },
      {
        id: 'prod-3',
        name: 'Bolsa Alça em Fibra de Bananeira',
        description: 'Bolsa espaçosa e elegante em fibra natural de bananeira, com alça de mão reforçada. Leve, resistente e 100% ecológica.',
        price: 'R$ 80,00',
        photoData: samplePhotos[2],
        createdAt: Date.now() - 3600000 * 4
      }
    ];

    for (const prod of defaultProducts) {
      await saveProduct(prod);
    }
  }
}

// Produtos do Catálogo Único
export async function getAllProducts(): Promise<Product[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PIECES, 'readonly');
    const store = tx.objectStore(STORE_PIECES);
    const req = store.getAll();
    req.onsuccess = () => {
      const products: Product[] = req.result || [];
      // Ordena pelos mais recentes
      products.sort((a, b) => b.createdAt - a.createdAt);
      resolve(products);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveProduct(product: Product): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PIECES, 'readwrite');
    const store = tx.objectStore(STORE_PIECES);
    const req = store.put(product);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PIECES, 'readwrite');
    const store = tx.objectStore(STORE_PIECES);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Aliases para manter compatibilidade
export const getAllPieces = getAllProducts;
export const savePiece = saveProduct;
export const deletePiece = deleteProduct;

// Stubs para compatibilidade temporária
export async function getAllArtisans(): Promise<any[]> {
  return [];
}
export async function getArtisanById(_id: string): Promise<any> {
  return undefined;
}
export async function saveArtisan(_artisan: any): Promise<void> {}
export async function deleteArtisan(_id: string): Promise<void> {}
export async function getPiecesByArtisan(_artisanId: string): Promise<CraftPiece[]> {
  return getAllProducts();
}
