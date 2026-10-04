import React from 'react';
import { X, BookOpen, FileCode, FileText, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Guía Docente: EduAdapt</h3>
              <p className="text-xs text-slate-400">
                Adaptación inclusiva de material escolar sin perder rigor ni diseño
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-slate-700 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
          {/* Section 1: HTML */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>1. Fichas y Contenidos en HTML</span>
            </div>
            <p>
              Cuando subes un archivo HTML, el sistema analiza la estructura completa del documento. <strong>Conserva todo el código original</strong>: librerías externas, scripts JavaScript, botones interactivos, formularios de autoevaluación, estilos CSS, fuentes y colores.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Traduce enunciados, párrafos, botones, encabezados y tablas al idioma seleccionado.</li>
              <li>Inyecta andamiaje pedagógico: glosario de términos y notas contextuales para salvar el desfase curricular.</li>
              <li>Permite interactuar directamente en la vista previa y descargar el archivo <code>.html</code> listo para el aula o aula virtual.</li>
            </ul>
          </div>

          {/* Section 2: PDF */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-rose-600" />
              <span>2. Fichas y Ejercicios en PDF</span>
            </div>
            <p>
              Al subir un PDF con ejercicios o apuntes, la IA multimodal analiza las páginas, el encabezado escolar, las tablas y las actividades didácticas:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Sopas de letras:</strong> Reconstruye la cuadrícula de letras oculta con las palabras clave traducidas y lista de búsqueda bilingüe.</li>
              <li><strong>Unir con flechas:</strong> Replica las dos columnas con puntos conectores adaptados al idioma del alumno.</li>
              <li><strong>Tablas y esquemas:</strong> Preserva bordes, filas, encabezados y formato escolar exacto.</li>
              <li><strong>Descarga en PDF y A4:</strong> Puedes descargar un nuevo archivo <code>.pdf</code> o usar la impresión directa de alta resolución.</li>
            </ul>
          </div>

          {/* Section 3: Feedback */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>3. Vista Previa y Regeneración con Observaciones</span>
            </div>
            <p>
              Si el resultado inicial necesita ajustes (por ejemplo, vocabulario más simple, añadir pronunciación o modificar una actividad), usa el botón <strong>«Regenerar con observaciones»</strong>. Podrás escribir tus indicaciones exactas y el modelo generará una nueva versión iterativa al instante.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Procesamiento server-side seguro con modelos avanzados de razonamiento y visión de Google Gemini.
            </span>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Entendido, comenzar
          </button>
        </div>
      </div>
    </div>
  );
};
