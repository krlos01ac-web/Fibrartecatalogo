import React, { useState, useEffect } from 'react';
import { Product, AppScreen } from '../types';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Archive,
  ArrowLeft,
  Calendar,
  Trash2,
  CheckCircle,
  QrCode,
  Printer,
  ExternalLink,
  Store,
  Tag
} from 'lucide-react';
import JSZip from 'jszip';
import QRCode from 'qrcode';

interface AdminScreenProps {
  allPieces: Product[];
  onNavigate: (screen: AppScreen) => void;
  onDeletePiece: (id: string) => Promise<void>;
  artisans?: any[];
  onDeleteArtisan?: (id: string) => Promise<void>;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  allPieces,
  onNavigate,
  onDeletePiece
}) => {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // QR Code para Vitrine da Loja Física
  const defaultShowcaseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?modo=vitrine`
      : 'http://localhost:3000/?modo=vitrine';
  const [showcaseUrl, setShowcaseUrl] = useState(defaultShowcaseUrl);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (!showcaseUrl) return;
    QRCode.toDataURL(showcaseUrl, {
      width: 450,
      margin: 2,
      color: {
        dark: '#2D6A4F',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Erro ao gerar QR Code:', err));
  }, [showcaseUrl]);

  // Imprimir Placa da Loja com QR Code
  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Placa Fibrarte - QR Code da Loja</title>
          <style>
            @page { size: auto; margin: 15mm; }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 90vh;
              margin: 0;
              padding: 20px;
              color: #221510;
              background: #FAF6F0;
            }
            .card {
              border: 5px solid #2D6A4F;
              border-radius: 32px;
              padding: 40px 32px;
              text-align: center;
              max-width: 420px;
              background: #FFFFFF;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            .logo {
              font-size: 36px;
              margin-bottom: 8px;
            }
            h1 {
              color: #2D6A4F;
              margin: 0 0 6px 0;
              font-size: 34px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            p.sub {
              color: #B85D3B;
              font-weight: 800;
              margin: 0 0 24px 0;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            img.qr {
              width: 260px;
              height: 260px;
              border-radius: 20px;
              border: 3px solid #EAD7C3;
              margin-bottom: 20px;
              padding: 8px;
              background: #FAF6F0;
            }
            p.inst {
              font-size: 17px;
              font-weight: 700;
              color: #3D2B1F;
              margin: 0 0 16px 0;
              line-height: 1.4;
            }
            .badge {
              display: inline-block;
              background: #25D366;
              color: #FFFFFF;
              font-weight: 800;
              padding: 10px 22px;
              border-radius: 25px;
              font-size: 15px;
            }
            .footer-info {
              margin-top: 20px;
              font-size: 11px;
              color: #8C5B3E;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">🧶</div>
            <h1>FIBRARTE</h1>
            <p class="sub">Catálogo & Vitrine da Loja</p>
            <img class="qr" src="${qrCodeDataUrl}" alt="QR Code da Loja" />
            <p class="inst">Aponte a câmera do seu celular para ver todos os nossos produtos em fibra da bananeira.</p>
            <div class="badge">Faça seu pedido direto pelo WhatsApp 💬</div>
            <div class="footer-info">Projeto Fibrarte • Artesanato em Fibra da Bananeira</div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => window.print(), 300); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Baixar QR Code em PNG
  const handleDownloadQrPng = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = 'fibrarte_qrcode_loja.png';
    link.click();
  };

  // Exportar CSV
  const handleExportCSV = () => {
    if (allPieces.length === 0) {
      alert('Não há produtos cadastrados para exportar.');
      return;
    }

    const headers = ['ID', 'Nome do Produto', 'Descrição', 'Preço', 'Data de Registro'];
    const rows = allPieces.map((p) => {
      const dateStr = new Date(p.createdAt).toLocaleDateString('pt-BR');
      return [
        `"${p.id}"`,
        `"${(p.name || 'Sem nome').replace(/"/g, '""')}"`,
        `"${(p.description || '').replace(/"/g, '""')}"`,
        `"${(p.price || '').replace(/"/g, '""')}"`,
        `"${dateStr}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fibrarte_catalogo_produtos_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setExportMessage('Planilha CSV gerada com sucesso!');
    setTimeout(() => setExportMessage(null), 4000);
  };

  // Exportar JSON Completo
  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      system: 'Fibrarte - Catálogo Único',
      products: allPieces
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fibrarte_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setExportMessage('Backup completo em JSON exportado com sucesso!');
    setTimeout(() => setExportMessage(null), 4000);
  };

  // Exportar Pacote ZIP com Fotos
  const handleExportZIP = async () => {
    if (allPieces.length === 0) {
      alert('Não há produtos cadastrados para exportar.');
      return;
    }

    setIsExportingZip(true);
    setExportMessage('Empacotando fotos dos produtos no ZIP...');

    try {
      const zip = new JSZip();
      const photosFolder = zip.folder('fotos');

      for (let i = 0; i < allPieces.length; i++) {
        const piece = allPieces[i];
        const safeName = (piece.name || 'produto').replace(/[^a-zA-Z0-9]/g, '_');
        const filenamePrefix = `${i + 1}_${safeName}`;

        if (piece.photoData && photosFolder) {
          const photoBase64 = piece.photoData.split(',')[1];
          if (photoBase64) {
            photosFolder.file(`${filenamePrefix}.jpg`, photoBase64, { base64: true });
          }
        }
      }

      zip.file(
        'LEIAME.txt',
        `PROJETO FIBRARTE - CATÁLOGO DE PRODUTOS\n\nTotal de produtos: ${allPieces.length}\nData de geração: ${new Date().toLocaleString('pt-BR')}\n`
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fibrarte_fotos_${new Date().toISOString().slice(0, 10)}.zip`;
      link.click();
      URL.revokeObjectURL(url);

      setExportMessage('Pacote ZIP com fotos baixado com sucesso!');
    } catch (err) {
      console.error(err);
      setExportMessage('Houve um erro ao gerar o arquivo ZIP.');
    } finally {
      setIsExportingZip(false);
      setTimeout(() => setExportMessage(null), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 pb-20 animate-fadeIn">
      {/* Barra de Topo do Painel */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAD7C3]">
        <button
          type="button"
          onClick={() => onNavigate('manage')}
          className="tactile-button px-3.5 py-2 rounded-xl bg-white border border-[#D4A373] text-[#2D6A4F] font-bold text-sm flex items-center gap-1.5 shadow-xs"
        >
          <ArrowLeft size={18} />
          <span>Voltar à Gestão</span>
        </button>

        <div className="text-right">
          <span className="block text-xs uppercase font-extrabold text-[#B85D3B] tracking-wider">
            Área Técnica
          </span>
          <span className="block text-base font-black text-[#221510]">
            Relatórios & QR Code
          </span>
        </div>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-2 gap-3 my-5">
        <div className="bg-white p-4 rounded-2xl border border-[#EAD7C3] shadow-xs">
          <span className="text-xs font-bold text-[#8C5B3E] block">Produtos no Catálogo</span>
          <span className="text-3xl font-black text-[#2D6A4F] mt-1 block">
            {allPieces.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#EAD7C3] shadow-xs">
          <span className="text-xs font-bold text-[#8C5B3E] block">Status do Catálogo</span>
          <span className="text-sm font-black text-[#25D366] mt-2 block flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]"></span>
            Online & Integrado
          </span>
        </div>
      </div>

      {/* Mensagem de Feedback de Exportação */}
      {exportMessage && (
        <div className="p-3.5 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-900 font-bold text-sm flex items-center gap-2 mb-4 animate-fadeIn">
          <CheckCircle size={20} className="text-emerald-700 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Botões de Exportação */}
      <div className="bg-[#F3ECE1] border-2 border-[#D4A373] p-5 rounded-3xl mb-6 shadow-xs">
        <h3 className="text-lg font-black text-[#221510] mb-1 flex items-center gap-2">
          <Download size={20} className="text-[#2D6A4F]" />
          <span>Exportação de Dados</span>
        </h3>
        <p className="text-xs text-[#8C5B3E] font-medium mb-4">
          Gere relatórios tabulares ou baixe o acervo de fotos dos produtos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="tactile-button bg-[#2D6A4F] hover:bg-[#1B4332] text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <FileSpreadsheet size={20} />
            <span>Planilha (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportZIP}
            disabled={isExportingZip}
            className="tactile-button bg-[#B85D3B] hover:bg-[#8C3A1E] text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Archive size={20} />
            <span>{isExportingZip ? 'Gerando ZIP...' : 'Fotos (ZIP)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="tactile-button bg-stone-700 hover:bg-stone-900 text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <FileJson size={20} />
            <span>Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* Gerador de QR Code para Loja Física */}
      <div className="bg-white border-2 border-[#2D6A4F] p-5 sm:p-6 rounded-3xl mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EAD7C3]">
          <div>
            <h3 className="text-xl font-black text-[#221510] flex items-center gap-2">
              <QrCode size={24} className="text-[#2D6A4F]" />
              <span>QR Code para a Loja Física & Feiras</span>
            </h3>
            <p className="text-xs text-[#8C5B3E] font-semibold mt-0.5">
              Imprima uma placa para exibir no balcão da loja
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('showcase')}
            className="tactile-button px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#2D6A4F] text-[#2D6A4F] font-bold text-xs flex items-center gap-1.5 hover:bg-[#2D6A4F] hover:text-white transition"
          >
            <Store size={15} />
            <span>Ver Vitrine</span>
            <ExternalLink size={13} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {qrCodeDataUrl && (
            <div className="flex flex-col items-center bg-[#FAF6F0] p-4 rounded-2xl border-2 border-[#EAD7C3] shrink-0 shadow-inner">
              <img
                src={qrCodeDataUrl}
                alt="QR Code do Catálogo"
                className="w-44 h-44 rounded-xl border border-white shadow-xs"
              />
              <span className="text-[11px] font-extrabold text-[#2D6A4F] mt-2 uppercase tracking-wide">
                Catálogo Fibrarte
              </span>
            </div>
          )}

          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#8C5B3E] uppercase tracking-wider mb-1">
                Link de Destino do QR Code:
              </label>
              <input
                type="text"
                value={showcaseUrl}
                onChange={(e) => setShowcaseUrl(e.target.value)}
                placeholder="https://sua-loja.com/?modo=vitrine"
                className="w-full bg-[#FAF6F0] border border-[#D4A373] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#221510] focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handlePrintCard}
                className="tactile-button bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={18} />
                <span>Imprimir Placa da Loja</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQrPng}
                className="tactile-button bg-[#F3ECE1] hover:bg-[#EAD7C3] border border-[#D4A373] text-[#221510] py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <Download size={18} />
                <span>Baixar PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Produtos Cadastrados */}
      <div className="mb-3">
        <h3 className="font-extrabold text-[#221510] text-lg">
          Produtos no Banco ({allPieces.length})
        </h3>
      </div>

      {allPieces.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl text-center text-[#8C5B3E] font-semibold text-sm border border-[#EAD7C3]">
          Nenhum produto cadastrado.
        </div>
      ) : (
        <div className="space-y-4">
          {allPieces.map((piece) => {
            const dateStr = new Date(piece.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={piece.id}
                className="bg-white border-2 border-[#EAD7C3] rounded-3xl p-4 sm:p-5 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={piece.photoData}
                    alt={piece.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#EAD7C3] shrink-0"
                  />

                  <div>
                    <h4 className="font-black text-[#221510] text-lg line-clamp-1">
                      {piece.name || 'Produto sem nome'}
                    </h4>

                    {piece.price && (
                      <span className="text-xs font-black text-[#2D6A4F] flex items-center gap-1 mt-0.5">
                        <Tag size={12} />
                        {piece.price}
                      </span>
                    )}

                    {piece.description && (
                      <p className="text-xs text-[#8C5B3E] font-medium line-clamp-2 mt-1">
                        {piece.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-[#8C5B3E]/80 font-semibold mt-1">
                      <Calendar size={13} />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Deseja realmente apagar o produto "${piece.name}"?`)) {
                      onDeletePiece(piece.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50"
                  title="Apagar produto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

