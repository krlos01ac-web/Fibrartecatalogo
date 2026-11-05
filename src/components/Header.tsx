import React from 'react';
import { AppScreen } from '../types';
import { ArrowLeft, Store, Lock } from 'lucide-react';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  onLock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, onLock }) => {
  const isShowcase = currentScreen === 'showcase';
  const isManage = currentScreen === 'manage';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EAD7C3] px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Lado Esquerdo: Voltar ou Logo */}
        <div className="flex items-center gap-2.5">
          {!isShowcase && !isManage && (
            <button
              type="button"
              onClick={() => onNavigate('manage')}
              className="tactile-button p-2 -ml-2 rounded-2xl text-[#2D6A4F] hover:bg-[#EAD7C3]/50 flex items-center gap-1 font-bold text-base"
              aria-label="Voltar para a gestão"
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
              <span className="text-base font-extrabold">Voltar</span>
            </button>
          )}

          {(isShowcase || isManage) && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-sm font-black text-xl">
                🧶
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-[#221510] leading-none">
                  FIBRARTE
                </h1>
                <span className="text-xs font-bold text-[#B85D3B] tracking-wide uppercase">
                  {isShowcase ? 'Catálogo da Loja' : 'Painel de Gestão'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Indicador ou Botão de Alternância e Bloqueio */}
        <div className="flex items-center gap-2">
          {isShowcase ? (
            <span className="text-[11px] font-bold text-[#8C5B3E] uppercase tracking-wider bg-[#F5EBE1] px-3 py-1 rounded-full border border-[#EAD7C3]">
              Vitrine
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('showcase')}
                className="tactile-button bg-white border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white px-3 py-1.5 rounded-full text-xs font-black shadow-2xs transition flex items-center gap-1.5"
              >
                <Store size={14} />
                <span className="hidden sm:inline">Ver Vitrine</span>
              </button>

              {onLock && (
                <button
                  type="button"
                  onClick={onLock}
                  className="tactile-button bg-[#FAF6F0] border border-[#B85D3B]/40 text-[#B85D3B] hover:bg-[#B85D3B] hover:text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-2xs transition flex items-center gap-1"
                  title="Bloquear e sair da gestão"
                >
                  <Lock size={13} />
                  <span>Sair</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
