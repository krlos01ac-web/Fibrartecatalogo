import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface PhotoCaptureProps {
  photoData: string | null;
  onPhotoSelected: (base64: string) => void;
  onResetPhoto: () => void;
}

// Imagens de exemplo de artesanato em fibra de bananeira (SVG estilizado para teste rápido)
const SAMPLE_CRAFT_PHOTOS = [
  {
    name: 'Cesto em Fibra de Bananeira',
    data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23EAD7C3"/><circle cx="300" cy="300" r="220" fill="%23C89D70" stroke="%238C5B3E" stroke-width="12"/><circle cx="300" cy="300" r="160" fill="%23B88655" stroke="%23704328" stroke-width="10"/><circle cx="300" cy="300" r="100" fill="%23996839"/><path d="M120 300 Q300 200 480 300 Q300 400 120 300" stroke="%235A331A" stroke-width="8" fill="none"/><path d="M300 120 Q200 300 300 480 Q400 300 300 120" stroke="%235A331A" stroke-width="8" fill="none"/><text x="300" y="550" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Cesto em Fibra de Bananeira</text></svg>'
  },
  {
    name: 'Bolsa em Fibra de Bananeira',
    data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23F4EDE4"/><path d="M220 180 C220 100 380 100 380 180" fill="none" stroke="%23996839" stroke-width="18" stroke-linecap="round"/><path d="M160 180 L440 180 L410 480 L190 480 Z" fill="%23DDB98B" stroke="%238B5A2B" stroke-width="10"/><line x1="200" y1="240" x2="400" y2="240" stroke="%238B5A2B" stroke-width="6"/><line x1="190" y1="320" x2="410" y2="320" stroke="%238B5A2B" stroke-width="6"/><line x1="180" y1="400" x2="420" y2="400" stroke="%238B5A2B" stroke-width="6"/><text x="300" y="550" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Bolsa em Fibra de Bananeira</text></svg>'
  },
  {
    name: 'Sousplat em Fibra de Bananeira',
    data: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="%23FAF6F0"/><circle cx="300" cy="300" r="230" fill="%23C29B72" stroke="%23684224" stroke-width="12" stroke-dasharray="8 6"/><circle cx="300" cy="300" r="180" fill="%23DFBE99" stroke="%238B5A2B" stroke-width="10"/><circle cx="300" cy="300" r="120" fill="%23F3DFCA" stroke="%23A06B37" stroke-width="8"/><circle cx="300" cy="300" r="50" fill="%23A06B37"/><text x="300" y="560" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234A2E1B" text-anchor="middle">Sousplat em Bananeira</text></svg>'
  }
];

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photoData,
  onPhotoSelected,
  onResetPhoto
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [showSamples, setShowSamples] = useState(false);

  // Comprime e converte imagem selecionada
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Redimensiona para max 900px mantendo proporção para alta qualidade e leveza na nuvem
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
          onPhotoSelected(compressedDataUrl);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
      cameraInputRef.current.click();
    }
  };

  const triggerGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
      galleryInputRef.current.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Input 1: Câmera traseira do celular */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Input 2: Biblioteca de fotos / Galeria local */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {photoData ? (
        // Prévia da foto em tamanho grande
        <div className="w-full flex flex-col items-center animate-fadeIn">
          <div className="relative w-full aspect-square max-w-sm rounded-3xl overflow-hidden border-4 border-[#2D6A4F] shadow-xl bg-black/5">
            <img
              src={photoData}
              alt="Foto da peça de artesanato"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-[#2D6A4F] text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md font-bold text-sm">
              <CheckCircle2 size={18} />
              <span>Foto pronta</span>
            </div>
          </div>

          {/* Opções para trocar a foto */}
          <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 mt-4">
            <button
              type="button"
              onClick={triggerCamera}
              className="tactile-button py-3 px-3 rounded-2xl bg-[#FAF6F0] border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Camera size={18} />
              <span>Tirar outra foto</span>
            </button>

            <button
              type="button"
              onClick={triggerGallery}
              className="tactile-button py-3 px-3 rounded-2xl bg-[#FAF6F0] border-2 border-[#B85D3B] text-[#B85D3B] hover:bg-[#B85D3B] hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <ImageIcon size={18} />
              <span>Pegar da galeria</span>
            </button>
          </div>
        </div>
      ) : (
        // Dois Botões Táteis: Câmera ou Galeria Local
        <div className="w-full flex flex-col items-center gap-3.5">
          {/* Opção 1: Tirar Foto com a Câmera */}
          <button
            type="button"
            onClick={triggerCamera}
            className="tactile-button w-full max-w-sm bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#1B4332] text-white rounded-3xl p-5 sm:p-6 flex items-center gap-4 shadow-lg border-b-4 border-[#1B4332] transition"
            aria-label="Tirar foto com a câmera"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Camera size={36} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-xl sm:text-2xl font-black uppercase tracking-wide leading-tight">
                Tirar Foto
              </span>
              <span className="block text-xs sm:text-sm text-emerald-100 font-semibold mt-0.5">
                Abrir a câmera do aparelho
              </span>
            </div>
          </button>

          {/* Opção 2: Pegar Imagem da Biblioteca Local / Galeria */}
          <button
            type="button"
            onClick={triggerGallery}
            className="tactile-button w-full max-w-sm bg-[#B85D3B] hover:bg-[#8C3A1E] active:bg-[#8C3A1E] text-white rounded-3xl p-5 sm:p-6 flex items-center gap-4 shadow-lg border-b-4 border-[#8C3A1E] transition"
            aria-label="Pegar foto da biblioteca local ou galeria"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <ImageIcon size={36} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <span className="block text-xl sm:text-2xl font-black uppercase tracking-wide leading-tight">
                Pegar da Galeria
              </span>
              <span className="block text-xs sm:text-sm text-orange-100 font-semibold mt-0.5">
                Escolher foto salva na biblioteca
              </span>
            </div>
          </button>

          {/* Atalho para fotos de teste (para computadores ou testes rápidos sem câmera) */}
          <div className="mt-2 w-full max-w-sm">
            <button
              type="button"
              onClick={() => setShowSamples(!showSamples)}
              className="w-full text-center text-[#8C5B3E] underline font-semibold text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={15} />
              <span>{showSamples ? 'Ocultar exemplos de teste' : 'Ou escolha um exemplo em fibra de bananeira para testar'}</span>
            </button>

            {showSamples && (
              <div className="grid grid-cols-3 gap-2 mt-2 p-2 bg-[#F3ECE1] rounded-2xl border border-[#D4A373]">
                {SAMPLE_CRAFT_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onPhotoSelected(sample.data)}
                    className="flex flex-col items-center p-1.5 rounded-xl bg-white border border-[#D4A373] text-center hover:bg-emerald-50 active:scale-95 transition"
                  >
                    <img src={sample.data} alt={sample.name} className="w-14 h-14 rounded-lg object-cover" />
                    <span className="text-[11px] font-bold text-[#221510] mt-1 line-clamp-1 leading-tight">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
