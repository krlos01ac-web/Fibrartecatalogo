import React, { useState, useMemo } from 'react';
import { Product, AppScreen } from '../types';
import { PieceDetailModal } from '../components/PieceDetailModal';
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  Search,
  Tag
} from 'lucide-react';

interface PublicCatalogScreenProps {
  pieces: Product[];
  contactPhone: string;
  onNavigate: (screen: AppScreen) => void;
}

export const PublicCatalogScreen: React.FC<PublicCatalogScreenProps> = ({
  pieces,
  contactPhone
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePiece, setActivePiece] = useState<Product | null>(null);

  // Filtragem por busca
  const filteredPieces = useMemo(() => {
    if (!searchQuery.trim()) return pieces;
    const q = searchQuery.toLowerCase();
    return pieces.filter(
      (piece) =>
        piece.name.toLowerCase().includes(q) ||
        (piece.description && piece.description.toLowerCase().includes(q))
    );
  }, [pieces, searchQuery]);

  // Ação de Fazer Pedido no WhatsApp
  const handleOrderWhatsApp = (piece: Product) => {
    const cleanPhone = (contactPhone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone ? (cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone) : '';
    const textMessage = `Olá! Gostaria de fazer o pedido do produto "${piece.name || 'Artesanato'}" da Fibrarte!\n${
      piece.description ? `\nDetalhes: ${piece.description}` : ''
    }${piece.price ? `\nValor: ${piece.price}` : ''}\n\nPodemos combinar a entrega e o pagamento?`;
    const encoded = encodeURIComponent(textMessage);
    const url = fullPhone ? `https://wa.me/${fullPhone}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 pb-24 animate-fadeIn">
      {/* Topo do Catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAD7C3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAD7C3]/60 text-[#8C5B3E] font-bold text-xs mb-1.5">
            <Sparkles size={14} className="text-[#B85D3B]" />
            <span>Catálogo Oficial da Loja</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#221510] tracking-tight">
            Catálogo Fibrarte
          </h1>
          <p className="text-sm font-semibold text-[#8C5B3E] mt-0.5">
            Peças artesanais autênticas em fibra de bananeira sustentável
          </p>
        </div>

        {/* Selo Informativo */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white px-4 py-2.5 rounded-2xl border border-[#EAD7C3] shadow-xs">
          <span className="text-2xl">🌿</span>
          <div className="text-left">
            <span className="block text-xs font-extrabold text-[#2D6A4F] uppercase tracking-wide">
              100% Feito à Mão
            </span>
            <span className="block text-[11px] text-[#8C5B3E] font-bold">
              Fibra da Bananeira • Sustentável
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa Rápida */}
      <div className="my-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3.5 top-3.5 text-[#8C5B3E]" />
          <input
            type="text"
            placeholder="Buscar peças em fibra de bananeira..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border-2 border-[#EAD7C3] font-bold text-[#221510] focus:outline-hidden focus:border-[#2D6A4F] text-base placeholder-[#8C5B3E]/60 shadow-xs"
          />
        </div>
      </div>

      {/* Grade de Produtos */}
      {filteredPieces.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border-2 border-dashed border-[#D4A373] text-center my-6">
          <p className="text-xl font-bold text-[#221510]">Nenhum produto encontrado.</p>
          <p className="text-sm text-[#8C5B3E] font-medium mt-1">
            Tente outro termo de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPieces.map((piece) => {
            const dateStr = new Date(piece.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short'
            });

            return (
              <div
                key={piece.id}
                className="bg-white rounded-3xl overflow-hidden border-2 border-[#EAD7C3] shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  {/* Foto da Peça */}
                  <div
                    onClick={() => setActivePiece(piece)}
                    className="relative aspect-square bg-[#F5EBE1] cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={piece.photoData}
                      alt={piece.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition duration-300"
                    />

                    {piece.price && (
                      <div className="absolute top-3 right-3 bg-[#2D6A4F] text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md text-xs font-black">
                        <Tag size={12} />
                        <span>{piece.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Informações da Peça */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-[#8C5B3E] font-bold mb-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {dateStr}
                      </span>
                    </div>

                    <h3
                      onClick={() => setActivePiece(piece)}
                      className="text-xl font-black text-[#221510] cursor-pointer hover:text-[#2D6A4F] transition line-clamp-1"
                    >
                      {piece.name || 'Produto Artesanal'}
                    </h3>

                    {piece.description && (
                      <p className="text-xs text-[#8C5B3E] font-medium line-clamp-2 mt-1 leading-relaxed">
                        {piece.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão Fazer Pedido no WhatsApp */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handleOrderWhatsApp(piece)}
                    className="tactile-button w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-black text-base shadow-md border-b-4 border-[#128C7E]"
                  >
                    <ShoppingBag size={20} />
                    <span>Fazer Pedido no WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes da Peça com Foto HD e Pedido */}
      {activePiece && (
        <PieceDetailModal
          piece={activePiece}
          contactPhone={contactPhone}
          onClose={() => setActivePiece(null)}
        />
      )}
    </div>
  );
};
