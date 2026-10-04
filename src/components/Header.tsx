import React from 'react';
import { BookOpen, Sparkles, GraduationCap, Languages, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                EduAdapt
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Inclusión Escolar
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Adaptación rápida de material didáctico (HTML y PDF) para alumnado no hispanohablante
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>Traducción pedagógica + Andamiaje curricular</span>
          </div>

          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Cómo funciona"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Guía docente</span>
          </button>
        </div>
      </div>
    </header>
  );
};
