import React, { useState } from 'react';
import { Product } from '../types';
import { X, Trash2, Calendar, AlertTriangle, ShoppingBag, Tag, Pencil } from 'lucide-react';

interface PieceDetailModalProps {
  piece: Product;
  contactPhone?: string;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (piece: Product) => void;
}

export const PieceDetailModal: React.FC<PieceDetailModalProps> = ({
  piece,
  contactPhone,
  onClose,
  onDelete,
  onEdit
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formattedDate = new Date(piece.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleOrderWhatsApp = () => {
    const cleanPhone = (contactPhone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone ? (cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone) : '';
    const textMessage = `Olá! Gostaria de fazer o pedido do produto "${piece.name || 'Artesanato'}" da Fibrarte!\n${
      piece.description ? `\nDetalhes: ${piece.description}` : ''
    }${piece.price ? `\nValor: ${piece.price}` : ''}\n\nPodemos combinar o envio?`;
    const encoded = encodeURIComponent(textMessage);
    const url = fullPhone ? `https://wa.me/${fullPhone}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FAF6F0] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#EAD7C3]">
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-[#EAD7C3] flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#2D6A4F] block">
              Catálogo Fibrarte
            </span>
            <h2 className="text-xl font-black text-[#221510] leading-tight">
              {piece.name || 'Produto Artesanal'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tactile-button p-2.5 rounded-full bg-[#F3ECE1] text-[#221510] hover:bg-[#EAD7C3] active:bg-[#EAD7C3]"
            aria-label="Fechar detalhes do produto"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Foto Grande em Alta Resolução */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black/10 border-2 border-[#EAD7C3] shadow-inner">
            <img
              src={piece.photoData}
              alt={piece.name}
              className="w-full h-full object-cover"
            />
            {piece.price && (
              <div className="absolute top-3 right-3 bg-[#2D6A4F] text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg text-sm font-black">
                <Tag size={14} />
                <span>{piece.price}</span>
              </div>
            )}
          </div>

          {/* Nome, Preço e Data */}
          <div className="bg-white p-4 rounded-2xl border border-[#EAD7C3] shadow-xs space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-2xl font-black text-[#221510] leading-tight">
                {piece.name || 'Produto Artesanal'}
              </h3>
              {piece.price && (
                <span className="text-base sm:text-lg font-black text-[#2D6A4F] text-right shrink-0">
                  {piece.price}
                </span>
              )}
            </div>

            {/* Descrição do Produto */}
            {piece.description && (
              <div className="pt-2 border-t border-[#EAD7C3]/60">
                <span className="text-xs uppercase font-extrabold text-[#8C5B3E] block mb-1">
                  Sobre esta peça:
                </span>
                <p className="text-sm sm:text-base text-[#221510] leading-relaxed whitespace-pre-line font-medium">
                  {piece.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[#8C5B3E] font-semibold pt-1">
              <Calendar size={14} />
              <span>Cadastrado em {formattedDate}</span>
            </div>
          </div>

          {/* Botão Fazer Pedido no WhatsApp */}
          <button
            type="button"
            onClick={handleOrderWhatsApp}
            className="tactile-button w-full bg-[#25D366] hover:bg-[#1EBE5D] active:bg-[#1EBE5D] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-xl font-black shadow-lg border-b-5 border-[#128C7E]"
            aria-label="Fazer pedido no WhatsApp"
          >
            <ShoppingBag size={24} />
            <span>Fazer Pedido no WhatsApp</span>
          </button>

          <p className="text-center text-xs text-[#8C5B3E] font-medium">
            Você conversará diretamente com a loja para combinar envio e pagamento.
          </p>

          {/* AÇÕES EXCLUSIVAS DA GESTÃO: EDITAR E EXCLUIR */}
          {(onEdit || onDelete) && (
            <div className="pt-3 border-t-2 border-dashed border-[#EAD7C3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-black text-[#8C5B3E] tracking-wider">
                  Opções do Painel de Gestão:
                </span>
              </div>

              {/* Botão de Editar Produto */}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(piece);
                  }}
                  className="tactile-button w-full bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#1B4332] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-base sm:text-lg font-black shadow-md border-b-4 border-[#1B4332] transition"
                  aria-label="Editar este produto"
                >
                  <Pencil size={20} />
                  <span>Editar Preço, Descrição ou Nome</span>
                </button>
              )}

              {/* Botão de Excluir Peça */}
              {onDelete && (
                <div>
                  {!showConfirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(true)}
                      className="w-full py-2.5 text-red-600 hover:text-red-800 text-sm font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 size={16} />
                      <span>Excluir este produto do catálogo</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex flex-col gap-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                        <AlertTriangle size={20} className="shrink-0" />
                        <span>Tem certeza que deseja apagar este produto?</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onDelete(piece.id)}
                          className="flex-1 bg-red-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-sm"
                        >
                          Sim, apagar
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmDelete(false)}
                          className="flex-1 bg-stone-200 text-[#221510] font-bold py-2.5 px-4 rounded-xl text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
