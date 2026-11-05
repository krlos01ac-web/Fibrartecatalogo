import React, { useState } from 'react';
import { Product, AppScreen, StoreSettings } from '../types';
import { PieceCard } from '../components/PieceCard';
import { PieceDetailModal } from '../components/PieceDetailModal';
import {
  Camera,
  Plus,
  Phone,
  Check,
  Store,
  QrCode,
  Sparkles
} from 'lucide-react';

interface ManageScreenProps {
  pieces: Product[];
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onNavigate: (screen: AppScreen) => void;
  onDeletePiece: (id: string) => Promise<void>;
  onEditPiece: (piece: Product) => void;
  onCreatePiece: () => void;
}

export const ManageScreen: React.FC<ManageScreenProps> = ({
  pieces,
  storeSettings,
  onUpdateStoreSettings,
  onNavigate,
  onDeletePiece,
  onEditPiece,
  onCreatePiece
}) => {
  const [phoneInput, setPhoneInput] = useState(storeSettings.contactPhone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Product | null>(null);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneInput.replace(/\D/g, '');
    onUpdateStoreSettings({
      ...storeSettings,
      contactPhone: clean
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = async (id: string) => {
    await onDeletePiece(id);
    setSelectedPiece(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 pb-24 space-y-6 animate-fadeIn">
      {/* Topo do Painel de Gestão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAD7C3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] font-bold text-xs mb-1.5">
            <Sparkles size={14} />
            <span>Gestão do Catálogo Único</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#221510] tracking-tight">
            Painel da Loja
          </h1>
          <p className="text-sm font-semibold text-[#8C5B3E] mt-0.5">
            Gerencie os produtos do catálogo e o número para receber pedidos
          </p>
        </div>

        {/* Botão para ver a vitrine */}
        <button
          type="button"
          onClick={() => onNavigate('showcase')}
          className="tactile-button self-start sm:self-auto bg-white border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white px-4 py-2.5 rounded-2xl text-sm font-black shadow-xs transition flex items-center gap-2"
        >
          <Store size={18} />
          <span>Ver Vitrine da Loja</span>
        </button>
      </div>

      {/* BLOCO DE CONFIGURAÇÃO: NÚMERO DO WHATSAPP PARA PEDIDOS */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EAD7C3] shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center font-black">
              <Phone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#221510] leading-tight">
                WhatsApp para Receber Pedidos
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#8C5B3E]">
                Quando o cliente clicar em "Fazer Pedido", a conversa abrirá neste número
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSavePhone} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-base font-bold text-[#8C5B3E]">
              🇧🇷 +55
            </span>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="DDD + Número (ex: 85999999999)"
              className="w-full pl-20 pr-4 py-3.5 rounded-2xl border-2 border-[#D4A373] bg-[#FAF6F0] focus:bg-white focus:outline-hidden focus:border-[#2D6A4F] text-[#221510] font-black text-lg"
            />
          </div>

          <button
            type="submit"
            className="tactile-button bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-6 py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition shrink-0"
          >
            {saveSuccess ? (
              <>
                <Check size={20} />
                <span>Salvo com sucesso!</span>
              </>
            ) : (
              <span>Salvar Contato</span>
            )}
          </button>
        </form>

        {storeSettings.contactPhone ? (
          <p className="text-xs text-[#2D6A4F] font-bold mt-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
            <span>Número ativo atual: +55 {storeSettings.contactPhone}</span>
          </p>
        ) : (
          <p className="text-xs text-[#B85D3B] font-bold mt-2.5">
            ⚠️ Nenhum número cadastrado. Insira seu WhatsApp para que os clientes possam enviar pedidos.
          </p>
        )}
      </section>

      {/* BOTÃO PRINCIPAL GIGANTE: CADASTRAR NOVO PRODUTO */}
      <div>
        <button
          type="button"
          onClick={onCreatePiece}
          className="tactile-button group w-full bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#1B4332] text-white rounded-3xl p-6 sm:p-7 flex items-center justify-between gap-4 shadow-xl border-b-6 border-[#1B4332] transition"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Camera size={44} className="text-white" />
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase font-black tracking-wider text-emerald-200">
                Adicionar à Loja
              </span>
              <span className="block text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5">
                CADASTRAR NOVO PRODUTO
              </span>
              <span className="block text-sm text-emerald-100 font-semibold mt-1">
                📸 Foto, nome, preço e descrição da peça
              </span>
            </div>
          </div>

          <div className="hidden sm:flex w-12 h-12 rounded-full bg-white/20 items-center justify-center shrink-0">
            <Plus size={32} className="text-white" />
          </div>
        </button>
      </div>

      {/* LISTA DE PRODUTOS CADASTRADOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#221510]">
              Produtos Cadastrados
            </h2>
            <span className="text-xs sm:text-sm font-bold text-[#8C5B3E]">
              {pieces.length === 0
                ? 'Nenhum produto cadastrado'
                : pieces.length === 1
                ? '1 produto no catálogo (toque para editar ou excluir)'
                : `${pieces.length} produtos no catálogo (toque para editar ou excluir)`}
            </span>
          </div>

          {pieces.length > 0 && (
            <button
              type="button"
              onClick={onCreatePiece}
              className="tactile-button bg-[#FAF6F0] border border-[#D4A373] text-[#2D6A4F] hover:bg-[#EAD7C3] px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs"
            >
              <Plus size={16} />
              <span>Adicionar Produto</span>
            </button>
          )}
        </div>

        {pieces.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border-2 border-dashed border-[#D4A373] text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-3xl">
              🧺
            </div>
            <div>
              <h3 className="text-xl font-black text-[#221510]">
                O catálogo está vazio
              </h3>
              <p className="text-sm text-[#8C5B3E] font-semibold mt-1 max-w-sm">
                Cadastre o primeiro produto com foto e descrição para começar a receber pedidos no WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={onCreatePiece}
              className="tactile-button bg-[#2D6A4F] text-white py-3 px-6 rounded-2xl font-black text-base shadow-md"
            >
              Cadastrar 1º Produto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pieces.map((piece) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                onClick={() => setSelectedPiece(piece)}
                onEdit={() => onEditPiece(piece)}
              />
            ))}
          </div>
        )}
      </section>

      {/* BLOCO EXTRA: ÁREA TÉCNICA E QR CODE */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3 border-t border-[#EAD7C3]">
        <button
          type="button"
          onClick={() => onNavigate('admin')}
          className="tactile-button inline-flex items-center gap-2 text-xs font-black text-[#8C5B3E] bg-white border border-[#EAD7C3] hover:bg-[#F5EBE1] py-2.5 px-4 rounded-2xl shadow-xs transition"
        >
          <QrCode size={16} className="text-[#2D6A4F]" />
          <span>Imprimir QR Code da Loja & Relatórios</span>
        </button>
      </div>

      {/* Modal de Detalhes, Edição e Exclusão do Produto */}
      {selectedPiece && (
        <PieceDetailModal
          piece={selectedPiece}
          contactPhone={storeSettings.contactPhone}
          onClose={() => setSelectedPiece(null)}
          onDelete={handleDelete}
          onEdit={(p) => {
            setSelectedPiece(null);
            onEditPiece(p);
          }}
        />
      )}
    </div>
  );
};
