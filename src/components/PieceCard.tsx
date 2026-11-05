import React from 'react';
import { Product } from '../types';
import { Calendar, Tag, Pencil } from 'lucide-react';

interface PieceCardProps {
  piece: Product;
  onClick: () => void;
  onEdit?: () => void;
}

export const PieceCard: React.FC<PieceCardProps> = ({ piece, onClick, onEdit }) => {
  const formattedDate = new Date(piece.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <div
      onClick={onClick}
      className="tactile-button group w-full bg-white rounded-3xl overflow-hidden border-2 border-[#EAD7C3] shadow-sm hover:shadow-md active:scale-98 transition flex flex-col text-left cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ver detalhes do produto ${piece.name}`}
    >
      {/* Imagem do Produto */}
      <div className="relative w-full aspect-square bg-[#F3ECE1] overflow-hidden">
        <img
          src={piece.photoData}
          alt={piece.name}
          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
          loading="lazy"
        />

        {piece.price && (
          <div className="absolute top-2.5 right-2.5 bg-[#2D6A4F] text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md text-xs font-black">
            <Tag size={12} />
            <span>{piece.price}</span>
          </div>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-2.5 left-2.5 bg-white/95 hover:bg-white text-[#2D6A4F] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-black border border-[#2D6A4F]/20 active:scale-95 transition"
            title="Editar produto"
            aria-label={`Editar produto ${piece.name}`}
          >
            <Pencil size={12} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* Título, Descrição e Data */}
      <div className="p-3.5 flex flex-col justify-between flex-1 w-full bg-[#FAF6F0]/50">
        <div>
          <h3 className="font-extrabold text-[#221510] text-base line-clamp-1 leading-snug">
            {piece.name || 'Produto Artesanal'}
          </h3>
          {piece.description && (
            <p className="text-xs text-[#8C5B3E] font-medium line-clamp-2 mt-1">
              {piece.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8C5B3E]/80 font-semibold mt-2.5">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>

          {onEdit && (
            <span className="text-[#2D6A4F] font-black text-xs flex items-center gap-0.5">
              <Pencil size={11} />
              Editar
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
