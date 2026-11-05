import { useState, useEffect } from 'react';
import { Product, AppScreen, StoreSettings } from './types';
import {
  initDatabase,
  getAllProducts,
  saveProduct,
  deleteProduct,
  getStoreSettings,
  saveStoreSettings
} from './services/db';
import {
  isFirebaseConfigured,
  subscribeToProducts,
  saveProductToCloud,
  deleteProductFromCloud,
  subscribeToStoreSettings,
  saveStoreSettingsToCloud
} from './services/firebase';
import { Header } from './components/Header';
import { ManageScreen } from './screens/ManageScreen';
import { RegisterPieceScreen } from './screens/RegisterPieceScreen';
import { AdminScreen } from './screens/AdminScreen';
import { PublicCatalogScreen } from './screens/PublicCatalogScreen';
import { PinAuthModal } from './components/PinAuthModal';
import { Store, Lock, QrCode } from 'lucide-react';

export function App() {
  const [allPieces, setAllPieces] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    contactPhone: '85999999999',
    storeName: 'Fibrarte'
  });
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('showcase');
  const [pendingScreen, setPendingScreen] = useState<AppScreen | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);

  // Inicializa banco local e sincronização em tempo real na nuvem Firebase
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;

    async function loadData() {
      try {
        await initDatabase();
        const loadedPieces = await getAllProducts();
        const loadedSettings = getStoreSettings();

        // 1. Estado inicial imediato via IndexedDB/LocalStorage
        setAllPieces(loadedPieces);
        setStoreSettings(loadedSettings);

        // 2. Se o Firebase estiver ativo, conecta em tempo real para sincronizar entre todos os aparelhos
        if (isFirebaseConfigured()) {
          unsubscribeProducts = subscribeToProducts((cloudPieces) => {
            if (cloudPieces.length > 0) {
              setAllPieces(cloudPieces);
              // Mantém cache local atualizado para uso offline
              cloudPieces.forEach((p) => saveProduct(p));
            } else if (loadedPieces.length > 0) {
              // Se a nuvem estiver vazia, sobe os produtos deste aparelho para o Firestore
              loadedPieces.forEach((p) => saveProductToCloud(p));
            }
          });

          unsubscribeSettings = subscribeToStoreSettings((cloudSettings) => {
            if (cloudSettings && cloudSettings.contactPhone) {
              setStoreSettings(cloudSettings);
              saveStoreSettings(cloudSettings);
            }
          });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const isUnlocked = sessionStorage.getItem('fibrarte_unlocked') === 'true';

        const requestedModo = urlParams.get('modo');
        const isManagementRequested =
          requestedModo === 'gestao' ||
          requestedModo === 'artesa' ||
          urlParams.get('gestao') === '1' ||
          urlParams.get('artesa') === '1';

        const isAdminRequested =
          requestedModo === 'equipe' ||
          requestedModo === 'admin' ||
          requestedModo === 'ceart';

        // URL de equipe / admin: exige senha se não estiver autenticado
        if (isAdminRequested) {
          if (isUnlocked) {
            setCurrentScreen('admin');
          } else {
            setPendingScreen('admin');
            setShowPinModal(true);
            setCurrentScreen('showcase');
          }
          return;
        }

        // URL de gestão (?modo=gestao): exige senha de acesso se não estiver autenticado
        if (isManagementRequested) {
          if (isUnlocked) {
            setCurrentScreen('manage');
          } else {
            setPendingScreen('manage');
            setShowPinModal(true);
            setCurrentScreen('showcase');
          }
          return;
        }

        // Se for modo vitrine ou se NÃO estiver autenticado nesta sessão:
        if (
          requestedModo === 'vitrine' ||
          urlParams.get('loja') === '1' ||
          !isUnlocked
        ) {
          setCurrentScreen('showcase');
          return;
        }

        // Se já estava autenticado na sessão anterior:
        setCurrentScreen('manage');
      } catch (err) {
        console.error('Erro ao inicializar dados:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  // Guarda de Navegação Segura: protege telas de gestão contra acesso de clientes
  const handleNavigate = (screen: AppScreen) => {
    if (screen !== 'showcase' && sessionStorage.getItem('fibrarte_unlocked') !== 'true') {
      setPendingScreen(screen);
      setShowPinModal(true);
      return;
    }
    if (screen !== 'register') {
      setEditingProduct(null);
    }
    setCurrentScreen(screen);
  };

  // Iniciar Cadastro de Novo Produto
  const handleCreatePiece = () => {
    setEditingProduct(null);
    handleNavigate('register');
  };

  // Iniciar Edição de Produto Existente
  const handleEditPiece = (product: Product) => {
    setEditingProduct(product);
    setCurrentScreen('register');
  };

  // Bloquear e Sair da Área de Gestão
  const handleLock = () => {
    sessionStorage.removeItem('fibrarte_unlocked');
    setPendingScreen(null);
    setEditingProduct(null);
    setCurrentScreen('showcase');
    // Limpa parâmetros da URL
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  };

  // Salvar Produto (Novo ou Editado) (Nuvem Firestore + Cache Local)
  const handleSavePiece = async (product: Product) => {
    // Salva localmente (substitui caso já exista pelo mesmo id)
    await saveProduct(product);
    // Envia para o Firebase Firestore para sincronizar com todos os aparelhos
    if (isFirebaseConfigured()) {
      await saveProductToCloud(product);
    }
    const updated = await getAllProducts();
    setAllPieces(updated);
    setEditingProduct(null);
  };

  // Apagar Produto (Nuvem Firestore + Cache Local)
  const handleDeletePiece = async (id: string) => {
    // Remove localmente
    await deleteProduct(id);
    // Remove da nuvem para atualizar todos os aparelhos
    if (isFirebaseConfigured()) {
      await deleteProductFromCloud(id);
    }
    const updated = await getAllProducts();
    setAllPieces(updated);
  };

  // Atualizar Configurações de Contato da Loja (WhatsApp)
  const handleUpdateStoreSettings = async (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    saveStoreSettings(newSettings);
    if (isFirebaseConfigured()) {
      await saveStoreSettingsToCloud(newSettings);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full border-4 border-[#2D6A4F] border-t-transparent animate-spin mb-4" />
        <h2 className="text-2xl font-black text-[#221510]">Fibrarte</h2>
        <p className="text-sm font-bold text-[#8C5B3E] mt-1">Sincronizando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      {/* Cabeçalho */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLock={handleLock}
      />

      {/* Conteúdo Principal de cada Tela */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'showcase' && (
          <PublicCatalogScreen
            pieces={allPieces}
            contactPhone={storeSettings.contactPhone}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'manage' && (
          <ManageScreen
            pieces={allPieces}
            storeSettings={storeSettings}
            onUpdateStoreSettings={handleUpdateStoreSettings}
            onNavigate={handleNavigate}
            onDeletePiece={handleDeletePiece}
            onEditPiece={handleEditPiece}
            onCreatePiece={handleCreatePiece}
          />
        )}

        {currentScreen === 'register' && (
          <RegisterPieceScreen
            onSavePiece={handleSavePiece}
            onNavigate={handleNavigate}
            editingProduct={editingProduct}
            onCancelEdit={() => setEditingProduct(null)}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            allPieces={allPieces}
            onNavigate={handleNavigate}
            onDeletePiece={handleDeletePiece}
          />
        )}
      </main>

      {/* Rodapé da Vitrine Pública (100% Protegido para Clientes) */}
      {currentScreen === 'showcase' && (
        <footer className="py-6 px-4 text-center border-t border-[#EAD7C3]/60 bg-[#FAF6F0]/90 flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs text-[#8C5B3E] font-bold">
            Fibrarte • Artesanato em Fibra de Bananeira do Ceará
          </p>
          <p className="text-[11px] text-[#8C5B3E]/70 font-medium">
            Peças feitas à mão com fibra da bananeira, sustentabilidade e tradição
          </p>
          <button
            type="button"
            onClick={() => {
              setPendingScreen('manage');
              setShowPinModal(true);
            }}
            className="inline-flex items-center gap-1 text-[11px] text-[#8C5B3E]/35 hover:text-[#8C5B3E] pt-2 transition"
            title="Acesso da gestão da loja"
          >
            <Lock size={11} />
            <span>Acesso da Gestão</span>
          </button>
        </footer>
      )}

      {/* Rodapé do Painel de Gestão */}
      {currentScreen === 'manage' && (
        <footer className="py-4 px-4 text-center border-t border-[#EAD7C3]/60 bg-[#FAF6F0]/80 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('showcase')}
            className="tactile-button inline-flex items-center gap-1.5 text-xs text-[#2D6A4F] bg-white border-2 border-[#2D6A4F]/40 hover:bg-[#2D6A4F] hover:text-white font-extrabold py-2 px-4 rounded-full transition shadow-xs"
          >
            <Store size={16} />
            <span>🛍️ Ver Vitrine da Loja</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('admin')}
            className="inline-flex items-center gap-1.5 text-xs text-[#8C5B3E]/80 hover:text-[#221510] font-bold py-2 px-3 rounded-full hover:bg-[#EAD7C3]/40 transition"
          >
            <QrCode size={15} />
            <span>QR Code & Relatórios</span>
          </button>
        </footer>
      )}

      {/* Modal de Senha para Desbloqueio da Gestão */}
      {showPinModal && (
        <PinAuthModal
          onSuccess={() => {
            sessionStorage.setItem('fibrarte_unlocked', 'true');
            setShowPinModal(false);
            const nextScreen = pendingScreen || 'manage';
            setPendingScreen(null);
            setCurrentScreen(nextScreen);
          }}
          onClose={() => {
            setShowPinModal(false);
            setPendingScreen(null);
            setCurrentScreen('showcase');
            // Limpa parâmetros restritos da URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }}
        />
      )}
    </div>
  );
}
