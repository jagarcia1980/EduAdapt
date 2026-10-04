/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { StudentProfileConfig, AdaptationSettings } from './components/StudentProfileConfig';
import { MaterialUploader, UploadedMaterial } from './components/MaterialUploader';
import { PreviewViewer } from './components/PreviewViewer';
import { FeedbackRegenerateModal } from './components/FeedbackRegenerateModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  History,
  CheckCircle2,
  Wand2,
  Check,
} from 'lucide-react';

interface VersionItem {
  id: string;
  version: number;
  html: string;
  timestamp: string;
  feedback?: string;
}

export default function App() {
  // Material state
  const [material, setMaterial] = useState<UploadedMaterial | null>(null);

  // Student adaptation settings
  const [settings, setSettings] = useState<AdaptationSettings>({
    targetLanguage: 'Ucraniano',
    targetLanguageCode: 'uk',
    isRtl: false,
    level: 'A0',
    includeGlossary: true,
    includeExplanations: true,
    highlightVerbs: true,
    studentNotes: '',
  });

  // Processing & adaptation output
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  // Versions history
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [currentVersionIdx, setCurrentVersionIdx] = useState<number>(0);

  // Modals
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Ref to scroll to preview
  const previewSectionRef = useRef<HTMLDivElement>(null);

  // Update settings handler
  const handleSettingsChange = (updated: Partial<AdaptationSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // Main adaptation trigger
  const handleStartAdaptation = async () => {
    if (!material) {
      setError('Por favor, selecciona o sube primero un material original (HTML o PDF).');
      return;
    }

    setError(null);
    setSuccessNotice(false);
    setIsProcessing(true);
    setProcessingStatus(
      material.type === 'html'
        ? 'Analizando código HTML, interactividad JavaScript y estilos...'
        : 'Analizando documento PDF, tablas y ejercicios didácticos...'
    );

    try {
      const endpoint = material.type === 'html' ? '/api/adapt-html' : '/api/adapt-pdf';

      const payload =
        material.type === 'html'
          ? {
              htmlContent: material.content,
              targetLanguage: settings.targetLanguage,
              targetLanguageCode: settings.targetLanguageCode,
              level: settings.level,
              studentProfileNotes: settings.studentNotes,
              includeGlossary: settings.includeGlossary,
              includeExplanations: settings.includeExplanations,
              isRtl: settings.isRtl,
            }
          : {
              pdfBase64: material.content,
              fileName: material.fileName,
              targetLanguage: settings.targetLanguage,
              targetLanguageCode: settings.targetLanguageCode,
              level: settings.level,
              studentProfileNotes: settings.studentNotes,
              includeGlossary: settings.includeGlossary,
              includeExplanations: settings.includeExplanations,
              isRtl: settings.isRtl,
            };

      const statusTimer = setTimeout(() => {
        setProcessingStatus(
          material.type === 'html'
            ? 'Traduciendo textos, preservando scripts y aplicando andamiaje pedagógico...'
            : 'Reconstruyendo formato A4, tablas y adaptando juegos (sopa de letras / unir)...'
        );
      }, 3500);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      clearTimeout(statusTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en el servidor (${response.status})`);
      }

      const data = await response.json();

      if (!data.adaptedHtml) {
        throw new Error('No se recibió el código adaptado del servidor.');
      }

      const newVersion: VersionItem = {
        id: `v1-${Date.now()}`,
        version: 1,
        html: data.adaptedHtml,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setVersions([newVersion]);
      setCurrentVersionIdx(0);
      setSuccessNotice(true);

      // Smooth scroll to preview section
      setTimeout(() => {
        previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error during adaptation:', err);
      setError(err.message || 'Ocurrió un error inesperado al adaptar el material.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Regeneration with teacher feedback
  const handleRegenerateWithFeedback = async (feedbackText: string) => {
    if (!material || versions.length === 0) return;

    setError(null);
    setSuccessNotice(false);
    setIsProcessing(true);
    setProcessingStatus('Aplicando observaciones del docente y regenerando material...');

    try {
      const currentHtml = versions[currentVersionIdx]?.html || '';

      const response = await fetch('/api/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalType: material.type,
          originalContent: material.content,
          currentAdaptedHtml: currentHtml,
          teacherFeedback: feedbackText,
          targetLanguage: settings.targetLanguage,
          level: settings.level,
          isRtl: settings.isRtl,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Error al regenerar con observaciones.');
      }

      const data = await response.json();

      if (!data.adaptedHtml) {
        throw new Error('No se recibió el resultado regenerado.');
      }

      const nextVersionNum = versions.length + 1;
      const newVersion: VersionItem = {
        id: `v${nextVersionNum}-${Date.now()}`,
        version: nextVersionNum,
        html: data.adaptedHtml,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: feedbackText,
      };

      const updatedList = [newVersion, ...versions];
      setVersions(updatedList);
      setCurrentVersionIdx(0);
      setIsFeedbackModalOpen(false);
      setSuccessNotice(true);

      setTimeout(() => {
        previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Regeneration error:', err);
      setError(err.message || 'Error al regenerar el material.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const currentAdaptedHtml = versions[currentVersionIdx]?.html || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header onOpenHelp={() => setIsGuideModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Intro Hero Banner */}
        <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Adaptación Didáctica Curricular Inteligente</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Adapta material escolar para alumnos no hispanohablantes al instante
            </h1>

            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Sube tus tareas o apuntes en <strong>HTML</strong> o <strong>PDF</strong>. Traducimos el contenido a la lengua materna del estudiante, añadimos andamiajes y glosarios para el desfase curricular, y <strong>conservamos fielmente el código, interactividad, tablas, sopas de letras y ejercicios de unir con flechas</strong>.
            </p>
          </div>
        </section>

        {/* Global Error Banner (if error exists) */}
        {error && (
          <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start justify-between gap-3 text-rose-900 text-xs shadow-sm animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block mb-0.5">Atención: No se pudo completar la adaptación</span>
                <span className="text-rose-700 leading-relaxed">{error}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleStartAdaptation}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
              >
                Reintentar
              </button>
              <button
                onClick={() => setError(null)}
                className="p-1.5 text-rose-400 hover:text-rose-700 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Step 1 & 2: Input Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student Profile & Language */}
          <div className="lg:col-span-6 space-y-6">
            <StudentProfileConfig
              settings={settings}
              onChange={handleSettingsChange}
              disabled={isProcessing}
            />
          </div>

          {/* Right Column: Material Uploader & Ready Samples */}
          <div className="lg:col-span-6 space-y-6">
            <MaterialUploader
              material={material}
              onMaterialSelect={(mat) => {
                setMaterial(mat);
                setError(null);
              }}
              onClear={() => {
                setMaterial(null);
                setVersions([]);
                setSuccessNotice(false);
              }}
              disabled={isProcessing}
            />

            {/* Launch Action Card */}
            <div className="p-5 rounded-2xl bg-indigo-50/90 border border-indigo-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <span>Generar Adaptación Escolar</span>
                    {material && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 uppercase">
                        {material.type}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    Idioma destino: <strong>{settings.targetLanguage}</strong> • Nivel: <strong>{settings.level}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!material || isProcessing}
                  onClick={handleStartAdaptation}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Adaptando material...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Adaptar Material</span>
                    </>
                  )}
                </button>
              </div>

              {/* In-place Live Progress when processing */}
              {isProcessing && (
                <div className="pt-3 border-t border-indigo-200/80 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-indigo-900 font-semibold">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      {processingStatus || 'Procesando adaptación con inteligencia artificial...'}
                    </span>
                    <span className="text-[11px] text-indigo-600 font-normal">Puede tomar 10-25s</span>
                  </div>
                  <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full w-2/3 animate-progress rounded-full"></div>
                  </div>
                </div>
              )}

              {/* Success badge */}
              {successNotice && !isProcessing && currentAdaptedHtml && (
                <div className="pt-2 border-t border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ¡Adaptación completada con éxito! Revisa la vista previa a continuación.
                  </span>
                  <button
                    onClick={() => previewSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-indigo-600 hover:text-indigo-800 underline text-xs font-bold"
                  >
                    Ver resultado ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3 & 4: Preview Viewer & Download / Feedback section */}
        {currentAdaptedHtml && !isProcessing && (
          <div ref={previewSectionRef} className="space-y-4 pt-4 border-t border-slate-200">
            {/* Version History bar if multiple iterations exist */}
            {versions.length > 1 && (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>Historial de versiones generadas:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {versions.map((ver, idx) => (
                    <button
                      key={ver.id}
                      onClick={() => setCurrentVersionIdx(idx)}
                      className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                        idx === currentVersionIdx
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      <span>v{ver.version}</span>
                      <span className="text-[10px] opacity-80">({ver.timestamp})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* The main Viewer with preview, split screen, code, download PDF/HTML, print */}
            <PreviewViewer
              originalContent={material?.content || ''}
              originalType={material?.type || 'html'}
              originalFileName={material?.fileName || 'documento'}
              adaptedHtml={currentAdaptedHtml}
              targetLanguage={settings.targetLanguage}
              level={settings.level}
              onOpenRegenerate={() => setIsFeedbackModalOpen(true)}
              versionCount={versions.length}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400">
        <p>
          EduAdapt • Herramienta de Inclusión y Adaptación Didáctica Escolar para Alumnado de Incorporación Tardía
        </p>
      </footer>

      {/* Modals */}
      <FeedbackRegenerateModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={handleRegenerateWithFeedback}
        isRegenerating={isProcessing}
        targetLanguage={settings.targetLanguage}
        level={settings.level}
      />

      <TeacherGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
