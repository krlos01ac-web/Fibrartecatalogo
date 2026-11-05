import React, { useState, useEffect } from 'react';
import { Product, AppScreen } from '../types';
import { PhotoCapture } from '../components/PhotoCapture';
import { CheckCircle2, Store, Home, ArrowLeft, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterPieceScreenProps {
  onSavePiece: (piece: Product) => Promise<void>;
  onNavigate: (screen: AppScreen) => void;
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
}

export const RegisterPieceScreen: React.FC<RegisterPieceScreenProps> = ({
  onSavePiece,
  onNavigate,
  editingProduct,
  onCancelEdit
}) => {
  const isEditing = Boolean(editingProduct);

  const [photoData, setPhotoData] = useState<string | null>(editingProduct?.photoData || null);
  const [name, setName] = useState<string>(editingProduct?.name || '');
  const [description, setDescription] = useState<string>(editingProduct?.description || '');
  const [price, setPrice] = useState<string>(editingProduct?.price || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setPhotoData(editingProduct.photoData);
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price || '');
      setIsSavedSuccess(false);
    } else {
      setPhotoData(null);
      setName('');
      setDescription('');
      setPrice('');
      setIsSavedSuccess(false);
    }
  }, [editingProduct]);

  const handlePhotoSelected = (base64: string) => {
    setPhotoData(base64);
  };

  const handleResetPhoto = () => {
    setPhotoData(null);
  };

  const handleSave = async () => {
    if (!photoData) {
      alert('Por favor, tire ou escolha uma foto do produto primeiro.');
      return;
    }

    if (!name.trim()) {
      alert('Por favor, informe o nome do produto.');
      return;
    }

    setIsSaving(true);

    const productToSave: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Artesanato autêntico em fibra de bananeira.',
      price: price.trim() || undefined,
      photoData,
      createdAt: editingProduct ? editingProduct.createdAt : Date.now()
    };

    await onSavePiece(productToSave);
    setIsSaving(false);
    setIsSavedSuccess(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D6A4F', '#B85D3B', '#D4A373', '#FFD700']
      });
    } catch (e) {
      // Ignora erro opcional de animação
    }
  };

  const handleBackToManage = () => {
    if (onCancelEdit) onCancelEdit();
    onNavigate('manage');
  };

  // TELA DE SUCESSO / COMEMORAÇÃO
  if (isSavedSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh] text-center animate-fadeIn">
        <div className="w-28 h-28 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center shadow-2xl mb-6">
          <CheckCircle2 size={72} strokeWidth={2.5} />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#221510] leading-tight mb-2">
          {isEditing ? 'Produto atualizado com sucesso! 🎉' : 'Produto salvo com sucesso! 🎉'}
        </h2>

        <p className="text-lg text-[#8C5B3E] font-bold mb-8">
          {isEditing
            ? 'As alterações já estão salvas e visíveis para os clientes no catálogo.'
            : 'Já está visível para os clientes no catálogo da loja.'}
        </p>

        <div className="w-full space-y-4">
          <button
            type="button"
            onClick={() => {
              if (onCancelEdit) onCancelEdit();
              onNavigate('showcase');
            }}
            className="tactile-button w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-5 px-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-3 shadow-xl border-b-6 border-[#1B4332]"
          >
            <Store size={28} />
            <span>VER NA VITRINE</span>
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setPhotoData(null);
                setName('');
                setDescription('');
                setPrice('');
                setIsSavedSuccess(false);
              }}
              className="tactile-button w-full bg-[#B85D3B] hover:bg-[#8C3A1E] text-white py-4 px-6 rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-md border-b-4 border-[#8C3A1E]"
            >
              <span>📸 Cadastrar outro produto</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleBackToManage}
            className="tactile-button w-full py-4 text-[#8C5B3E] hover:text-[#221510] font-bold text-lg underline flex items-center justify-center gap-1.5"
          >
            <Home size={20} />
            <span>Voltar para o Painel de Gestão</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 space-y-6 pb-16">
      {/* Topo com Voltar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBackToManage}
          className="tactile-button inline-flex items-center gap-1.5 text-sm font-extrabold text-[#2D6A4F] bg-white border border-[#EAD7C3] px-3.5 py-2 rounded-2xl shadow-xs"
        >
          <ArrowLeft size={18} />
          <span>Voltar para Gestão</span>
        </button>

        <span className="text-xs uppercase font-black text-[#2D6A4F] tracking-widest">
          {isEditing ? '✏️ Editando Peça' : 'Catálogo Fibrarte'}
        </span>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-black text-[#221510]">
          {isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}
        </h2>
        <p className="text-base text-[#8C5B3E] font-semibold mt-1">
          {isEditing
            ? 'Altere a foto, nome, descrição ou preço e salve as alterações'
            : 'Preencha a foto e os dados para adicionar à vitrine'}
        </p>
      </div>

      {/* PASSO 1: FOTO DO PRODUTO */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EAD7C3] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center font-black text-lg">
            1
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#221510] leading-none">
              Foto do Produto
            </h3>
            <span className="text-xs font-semibold text-[#8C5B3E]">
              {isEditing
                ? 'Foto atual da peça (pode manter ou trocar)'
                : 'Obrigatório • Tire a foto ou pegue da biblioteca local'}
            </span>
          </div>
        </div>

        <PhotoCapture
          photoData={photoData}
          onPhotoSelected={handlePhotoSelected}
          onResetPhoto={handleResetPhoto}
        />
      </section>

      {/* PASSO 2: NOME DO PRODUTO */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EAD7C3] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-[#B85D3B] text-white flex items-center justify-center font-black text-lg">
            2
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#221510] leading-none">
              Nome do Produto
            </h3>
            <span className="text-xs font-semibold text-[#8C5B3E]">
              Obrigatório • Nome claro para os clientes
            </span>
          </div>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Bolsa em Fibra de Bananeira, Cesto Trançado..."
          className="w-full text-lg sm:text-xl font-bold p-4 rounded-2xl border-2 border-[#D4A373] bg-[#FAF6F0] focus:bg-white focus:outline-hidden focus:border-[#2D6A4F] text-[#221510]"
        />
      </section>

      {/* PASSO 3: DESCRIÇÃO DO PRODUTO */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EAD7C3] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-[#D4A373] text-white flex items-center justify-center font-black text-lg">
            3
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#221510] leading-none">
              Descrição e Medidas do Produto
            </h3>
            <span className="text-xs font-semibold text-[#8C5B3E]">
              Detalhes de tamanho, medidas (P, M, G) e acabamento
            </span>
          </div>
        </div>

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Luminária artesanal em fibra de bananeira. Medidas: P: 37cm x 80cm; M: 42cm x 98cm; G: 150cm x 115cm..."
          className="w-full text-base sm:text-lg font-medium p-4 rounded-2xl border-2 border-[#D4A373] bg-[#FAF6F0] focus:bg-white focus:outline-hidden focus:border-[#2D6A4F] text-[#221510] resize-none"
        />
      </section>

      {/* PASSO 4: VALOR / PREÇO */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#EAD7C3] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-[#606c38] text-white flex items-center justify-center font-black text-lg">
            4
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#221510] leading-none">
              Preço ou Valores (Opcional)
            </h3>
            <span className="text-xs font-semibold text-[#8C5B3E]">
              Ex: R$ 45,00 ou por tamanho: P: R$110,00 M: R$140,00 G: R$170,00
            </span>
          </div>
        </div>

        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex: P: R$110,00 M: R$140,00 G: R$170,00"
          className="w-full text-lg font-bold p-3.5 rounded-2xl border-2 border-[#D4A373] bg-[#FAF6F0] focus:bg-white focus:outline-hidden focus:border-[#2D6A4F] text-[#221510]"
        />
      </section>

      {/* BOTÃO SALVAR PRODUTO */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!photoData || !name.trim() || isSaving}
          onClick={handleSave}
          className={`tactile-button w-full py-5 sm:py-6 px-8 rounded-3xl flex items-center justify-center gap-4 text-2xl sm:text-3xl font-black shadow-2xl transition border-b-6 ${
            photoData && name.trim() && !isSaving
              ? 'bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#1B4332] text-white border-[#1B4332] cursor-pointer'
              : 'bg-stone-300 text-stone-500 border-stone-400 cursor-not-allowed opacity-80'
          }`}
          aria-label={isEditing ? 'Salvar alterações do produto' : 'Salvar produto no catálogo'}
        >
          {isEditing ? <Pencil size={32} /> : <CheckCircle2 size={36} strokeWidth={3} />}
          <span>
            {isSaving
              ? (isEditing ? 'SALVANDO ALTERAÇÕES...' : 'SALVANDO...')
              : (isEditing ? 'SALVAR ALTERAÇÕES' : 'SALVAR PRODUTO')}
          </span>
        </button>

        {(!photoData || !name.trim()) && (
          <p className="text-center text-sm font-bold text-[#B85D3B] mt-2">
            ⚠️ Adicione a foto e o nome do produto para salvar.
          </p>
        )}
      </div>
    </div>
  );
};
