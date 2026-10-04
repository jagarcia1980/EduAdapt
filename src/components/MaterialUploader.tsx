import React, { useRef, useState } from 'react';
import {
  Upload,
  FileCode,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { SAMPLE_MATERIALS, SampleMaterial } from '../data/sampleMaterials';

export interface UploadedMaterial {
  type: 'html' | 'pdf';
  fileName: string;
  fileSize: number;
  content: string; // HTML string or base64 data URL for PDF
  previewSnippet?: string;
}

interface MaterialUploaderProps {
  material: UploadedMaterial | null;
  onMaterialSelect: (material: UploadedMaterial) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const MaterialUploader: React.FC<MaterialUploaderProps> = ({
  material,
  onMaterialSelect,
  onClear,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'samples'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    const fileName = file.name;
    const isHtml = fileName.endsWith('.html') || fileName.endsWith('.htm');
    const isPdf = fileName.endsWith('.pdf');

    if (!isHtml && !isPdf) {
      setErrorMsg('Formato no válido. Por favor, sube un archivo .html o .pdf.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('El archivo excede el límite recomendado de 25MB.');
      return;
    }

    const reader = new FileReader();

    if (isHtml) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onMaterialSelect({
          type: 'html',
          fileName,
          fileSize: file.size,
          content: text,
          previewSnippet: text.slice(0, 300),
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onMaterialSelect({
          type: 'pdf',
          fileName,
          fileSize: file.size,
          content: base64,
          previewSnippet: 'Documento PDF listo para procesar',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: SampleMaterial) => {
    onMaterialSelect({
      type: sample.type,
      fileName: sample.fileName,
      fileSize: new Blob([sample.content]).size,
      content: sample.content,
      previewSnippet: sample.description,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <Upload className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            2. Material de Clase Original (HTML o PDF)
          </h2>
        </div>

        {/* Navigation between my upload and pre-made educational samples */}
        <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1 rounded-md transition flex items-center gap-1 ${
              activeTab === 'samples'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Ejemplos listos</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected Material Banner */}
      {material ? (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 shadow-xs">
              {material.type === 'html' ? (
                <FileCode className="w-6 h-6 text-indigo-600" />
              ) : (
                <FileText className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800">
                  {material.type.toUpperCase()}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate max-w-[240px] sm:max-w-md">
                  {material.fileName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {(material.fileSize / 1024).toFixed(1)} KB • Listo para adaptar
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition"
            title="Quitar archivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : activeTab === 'upload' ? (
        /* Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Arrastra aquí tu documento o haz clic para seleccionarlo
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Soporta archivos <strong className="text-slate-700">HTML</strong> (con código, interactividad, estilos y JS) o <strong className="text-slate-700">PDF</strong> (fichas, tablas, ejercicios y sopas de letras).
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100">
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              HTML (.html, .htm)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100">
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              PDF (.pdf)
            </span>
          </div>
        </div>
      ) : (
        /* Educational Samples to test instantly */
        <div className="space-y-2">
          <p className="text-xs text-slate-500 mb-2">
            Selecciona un material de prueba para comprobar la adaptación de código interactivo o actividades didácticas:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_MATERIALS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSampleSelect(sample)}
                className="cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800">
                      {sample.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {sample.grade}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 leading-tight mb-1">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-3">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Probar este
                  </span>
                  <span>{sample.subject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
