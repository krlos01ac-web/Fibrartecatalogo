import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

interface PinAuthModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const VALID_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export const PinAuthModal: React.FC<PinAuthModalProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    // Se a senha de gestão não estiver configurada no ambiente, bloqueia o acesso por segurança
    if (!VALID_PASSWORD) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ [Fibrarte] VITE_ADMIN_PASSWORD não configurada no arquivo de ambiente.');
      }
      setError(true);
      return;
    }

    setIsSubmitting(true);
    const cleaned = password.trim();

    // Aceita a senha configurada (ou variação em minúsculas para facilidade de digitação no teclado mobile)
    if (cleaned === VALID_PASSWORD || cleaned.toLowerCase() === VALID_PASSWORD.toLowerCase()) {
      sessionStorage.setItem('fibrarte_unlocked', 'true');
      setError(false);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 150);
    } else {
      setIsSubmitting(false);
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#FAF6F0] rounded-3xl p-6 sm:p-7 border-2 border-[#D4A373] shadow-2xl flex flex-col items-center">
        {/* Topo do Modal */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center shadow-md">
            <Lock size={22} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tactile-button p-2.5 rounded-full bg-[#F3ECE1] text-[#221510] hover:bg-[#EAD7C3] transition"
            aria-label="Fechar e voltar para a vitrine"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-black text-[#221510] text-center">
          Acesso à Gestão
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-[#8C5B3E] text-center mt-1 mb-6">
          Área restrita. Digite a senha para gerenciar produtos e configurações.
        </p>

        {/* Formulário de Senha */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Digite a senha..."
              autoFocus
              className={`w-full py-4 pl-4 pr-12 rounded-2xl border-2 font-bold text-lg text-[#221510] bg-white transition focus:outline-hidden ${
                error
                  ? 'border-red-500 bg-red-50 text-red-900 animate-shake'
                  : 'border-[#D4A373] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-4 text-[#8C5B3E] hover:text-[#221510] p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold text-center animate-fadeIn">
              ⚠️ Senha incorreta ou não configurada. Verifique e tente novamente.
            </div>
          )}

          <button
            type="submit"
            disabled={!password.trim() || isSubmitting}
            className="tactile-button w-full bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#1B4332] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg border-b-4 border-[#1B4332] transition"
          >
            <ShieldCheck size={22} />
            <span>ENTRAR NA GESTÃO</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-xs font-bold text-[#8C5B3E] hover:text-[#221510] underline"
        >
          Voltar para o catálogo público
        </button>
      </div>
    </div>
  );
};
