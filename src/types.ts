export interface Product {
  id: string;
  name: string;
  description: string;
  price?: string;
  photoData: string; // Base64 data URL
  createdAt: number;
  // Campos opcionais para compatibilidade retroativa
  artisanId?: string;
  artisanName?: string;
}

export type CraftPiece = Product;

export interface StoreSettings {
  contactPhone: string; // Telefone WhatsApp da loja para onde os pedidos serão enviados
  storeName?: string;
}

export type AppScreen = 'showcase' | 'manage' | 'register' | 'admin';


