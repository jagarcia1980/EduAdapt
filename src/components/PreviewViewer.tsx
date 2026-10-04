import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Columns,
  Eye,
  Code2,
  FileDown,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Maximize2,
} from 'lucide-react';
import { exportElementToPdf, printHtmlDirectly, downloadHtmlFile } from '../utils/pdfExport';

interface PreviewViewerProps {
  originalContent: string;
  originalType: 'html' | 'pdf';
  originalFileName: string;
  adaptedHtml: string;
  targetLanguage: string;
  level: string;
  onOpenRegenerate: () => void;
  versionCount: number;
}

export const PreviewViewer: React.FC<PreviewViewerProps> = ({
  originalContent,
  originalType,
  originalFileName,
  adaptedHtml,
  targetLanguage,
  level,
  onOpenRegenerate,
  versionCount,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'split' | 'code'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);

  const printContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const baseFileName = originalFileName.replace(/\.(html|htm|pdf)$/i, '');
  const adaptedFileName = `${baseFileName}-adaptado-${targetLanguage.toLowerCase()}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(adaptedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(adaptedHtml, `${adaptedFileName}.html`);
  };

  const handlePrint = () => {
    printHtmlDirectly(adaptedHtml, `${adaptedFileName}`);
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setExportProgress('Preparando PDF...');

    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc && iframeDoc.body) {
        await exportElementToPdf(iframeDoc.body, {
          fileName: `${adaptedFileName}.pdf`,
          onProgress: (_, msg) => setExportProgress(msg),
        });
      } else {
        handlePrint();
      }
    } catch (err) {
      console.warn('PDF export fallback to print dialogue:', err);
      handlePrint();
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'tablet':
        return 'max-w-[768px]';
      case 'mobile':
        return 'max-w-[420px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Mode switcher */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'preview'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Adaptada</span>
          </button>

          {originalType === 'html' && (
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'split'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Comparativa (Original vs Adaptado)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'code'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código HTML</span>
          </button>
        </div>

        {/* Center: Viewport resize for preview */}
        {viewMode === 'preview' && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-slate-600 text-xs">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg transition ${
                viewport === 'desktop' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Escritorio / A4 Completo"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg transition ${
                viewport === 'tablet' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Tableta"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg transition ${
                viewport === 'mobile' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Móvil"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Actions (Download PDF, HTML, Print, Regenerate) */}
        <div className="flex items-center gap-2">
          {/* Regenerate with feedback button */}
          <button
            type="button"
            onClick={onOpenRegenerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition shadow-xs"
            title="Pedir ajustes al modelo si la vista previa no te convence"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>Regenerar con observaciones</span>
            {versionCount > 1 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px]">
                v{versionCount}
              </span>
            )}
          </button>

          {/* Download HTML */}
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition shadow-xs"
            title="Descargar archivo .html"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Descargar</span>
            <span>.HTML</span>
          </button>

          {/* Download PDF button (Crucial for PDF original or print materials) */}
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs disabled:opacity-50"
            title="Descargar como archivo PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? exportProgress || 'Exportando...' : 'Descargar PDF'}</span>
          </button>

          {/* Native Print Dialog for vector crisp output */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs"
            title="Imprimir / Guardar en PDF nativo de alta resolución"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 bg-slate-100/70 min-h-[600px] flex justify-center items-start overflow-auto">
        {viewMode === 'preview' && (
          <div className={`transition-all duration-300 ${getViewportWidth()} w-full flex flex-col items-center`}>
            {/* Document sheet card */}
            <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Document Header bar inside frame */}
              <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-white">Vista Previa Adaptada</span>
                  <span className="text-slate-400">({targetLanguage} • {level})</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Código, JS y estilos activos</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 hover:text-white transition"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Rendered sandboxed iframe */}
              <iframe
                ref={iframeRef}
                srcDoc={adaptedHtml}
                title="Vista previa del material adaptado"
                sandbox="allow-scripts allow-same-origin allow-forms"
                className="w-full min-h-[750px] border-none bg-white"
              />
            </div>
          </div>
        )}

        {viewMode === 'split' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
                <span>Original (Español)</span>
                <span className="text-slate-300 font-normal">{originalFileName}</span>
              </div>
              <iframe
                srcDoc={originalContent}
                title="Material original"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-[650px] border-none bg-white"
              />
            </div>

            {/* Adapted */}
            <div className="bg-white rounded-xl shadow-md border border-indigo-200 overflow-hidden flex flex-col">
              <div className="bg-indigo-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
                <span>Adaptado ({targetLanguage} • {level})</span>
                <span className="text-indigo-200 font-normal">Con andamiaje y glosario</span>
              </div>
              <iframe
                srcDoc={adaptedHtml}
                title="Material adaptado"
                sandbox="allow-scripts allow-same-origin allow-forms"
                className="w-full h-[650px] border-none bg-white"
              />
            </div>
          </div>
        )}

        {viewMode === 'code' && (
          <div className="w-full bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-slate-300 px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-700">
              <span className="font-mono font-semibold text-indigo-300">
                {adaptedFileName}.html
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar código'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-auto max-h-[700px] leading-relaxed">
              <code>{adaptedHtml}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
