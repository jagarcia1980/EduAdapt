import React, { useState } from 'react';
import { RefreshCw, X, MessageSquare, Sparkles, Send, ArrowRight } from 'lucide-react';

interface FeedbackRegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: string) => Promise<void>;
  isRegenerating: boolean;
  targetLanguage: string;
  level: string;
}

const QUICK_OBSERVATIONS = [
  'Simplificar aún más el vocabulario y usar oraciones más cortas.',
  'Añadir más términos clave con su traducción al glosario bilingüe.',
  'En las consignas de los ejercicios, resaltar en negrita los verbos de acción.',
  'Mantener los títulos principales en formato bilingüe (español y lengua materna).',
  'Añadir una pequeña nota aclaratoria sobre las unidades métricas o culturales españolas.',
  'Asegurar que la sopa de letras tenga palabras fáciles de localizar.',
];

export const FeedbackRegenerateModal: React.FC<FeedbackRegenerateModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
  isRegenerating,
  targetLanguage,
  level,
}) => {
  const [feedbackText, setFeedbackText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || isRegenerating) return;
    await onSubmitFeedback(feedbackText);
    setFeedbackText('');
  };

  const handleAddQuickObservation = (obs: string) => {
    setFeedbackText((prev) => (prev ? `${prev}\n- ${obs}` : `- ${obs}`));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Regenerar con Observaciones Docentes
              </h3>
              <p className="text-xs text-slate-500">
                Ajusta detalles específicos manteniendo el formato y código
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRegenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Indica qué aspectos deseas modificar (por ejemplo: nivel de simplificación, detalles de la sopa de letras o ejercicios de unir, términos del glosario o diseño).
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tus observaciones o correcciones:
            </label>
            <textarea
              rows={4}
              required
              disabled={isRegenerating}
              placeholder="Ej: 'El vocabulario de la pregunta 2 es un poco elevado para este alumno; por favor usa términos más básicos y añade una pista explicativa entre corchetes...'"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition leading-relaxed"
            />
          </div>

          {/* Quick suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Sugerencias rápidas para añadir:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_OBSERVATIONS.map((obs, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isRegenerating}
                  onClick={() => handleAddQuickObservation(obs)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-left"
                >
                  + {obs}
                </button>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isRegenerating}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isRegenerating || !feedbackText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Regenerando material...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Aplicar observaciones y regenerar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
