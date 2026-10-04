import React from 'react';
import { TARGET_LANGUAGES, PROFICIENCY_LEVELS } from '../data/sampleMaterials';
import { Languages, ShieldAlert, Sparkles, BookText, Lightbulb, UserCheck } from 'lucide-react';

export interface AdaptationSettings {
  targetLanguage: string;
  targetLanguageCode: string;
  isRtl: boolean;
  level: string;
  includeGlossary: boolean;
  includeExplanations: boolean;
  highlightVerbs: boolean;
  studentNotes: string;
}

interface StudentProfileConfigProps {
  settings: AdaptationSettings;
  onChange: (updated: Partial<AdaptationSettings>) => void;
  disabled?: boolean;
}

export const StudentProfileConfig: React.FC<StudentProfileConfigProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const isCustomLang = !TARGET_LANGUAGES.some(
    (l) => l.name.toLowerCase() === settings.targetLanguage.toLowerCase()
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Languages className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            1. Perfil del Alumno e Idioma Destino
          </h2>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          Paso obligatorio
        </span>
      </div>

      {/* Target Language Selection */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Idioma materno o lengua del estudiante
        </label>
        
        {/* Quick Language Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {TARGET_LANGUAGES.map((lang) => {
            const isSelected = settings.targetLanguageCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    targetLanguage: lang.name,
                    targetLanguageCode: lang.code,
                    isRtl: lang.isRtl,
                  })
                }
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl shrink-0">{lang.flag}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate">{lang.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{lang.nativeName}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Language input if needed */}
        <div className="pt-1 flex items-center gap-2">
          <span className="text-xs text-slate-500">¿Otro idioma?</span>
          <input
            type="text"
            disabled={disabled}
            placeholder="Escribe otro idioma (ej: Tagalo, Bambara, Polaco...)"
            value={isCustomLang ? settings.targetLanguage : ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                targetLanguage: val,
                targetLanguageCode: 'other',
                isRtl: false,
              });
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 flex-1 max-w-xs bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Proficiency Level Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Nivel de competencia en español
          </label>
          <span className="text-xs text-indigo-600 font-medium">
            Define la intensidad del andamiaje
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PROFICIENCY_LEVELS.map((level) => {
            const isSelected = settings.level === level.code;
            return (
              <div
                key={level.code}
                onClick={() => !disabled && onChange({ level: level.code })}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{level.title}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {level.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {level.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Toggles */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Andamiajes y adaptaciones pedagógicas
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              disabled={disabled}
              checked={settings.includeGlossary}
              onChange={(e) => onChange({ includeGlossary: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <BookText className="w-3.5 h-3.5 text-indigo-600" />
                Glosario bilingüe de vocabulario
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Incluye tabla de términos clave (Idioma alumno - Español - Definición).
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              disabled={disabled}
              checked={settings.includeExplanations}
              onChange={(e) => onChange({ includeExplanations: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                Aclaraciones por desfase curricular
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Añade notas contextuales en conceptos científicos, métricos o culturales.
              </p>
            </div>
          </label>
        </div>

        {/* Optional student notes */}
        <div className="pt-1">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Observaciones opcionales del alumno / curso (ej: "Llegó hace 2 semanas, sin escolarizar previamente"):
          </label>
          <input
            type="text"
            disabled={disabled}
            placeholder="Ej: Alumno de 5º de primaria que necesita instrucciones muy pautadas y apoyo visual"
            value={settings.studentNotes}
            onChange={(e) => onChange({ studentNotes: e.target.value })}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>
    </div>
  );
};
