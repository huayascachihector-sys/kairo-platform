import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Upload, Globe, Library, ChevronRight } from 'lucide-react';
import type { StoreState, ImportedQuestion } from '../../lib/store';
import type { IbCourseDef } from '../../data/ibCourses';
import { IB_COURSES, detectCourse } from '../../data/ibCourses';
import { getIbBanksByCourse } from '../../lib/store';

interface BancoIBProps {
  ibImportStage: 'idle' | 'scanning' | 'confirm' | 'extracting' | 'done';
  ibProcessing: boolean;
  ibProcessingStatus: string;
  ibDetected: { folderName: string; course: IbCourseDef; count: number }[];
  ibProgress: { current: number; total: number; currentFolder: string };
  ibImportError: string;
  importError: string;
  dragOver: boolean;
  ibCoursesList: { slug: string; name: string; edition: string; count: number }[];
  ibLoading: boolean;
  ibFlashcardLoading: boolean;
  state: StoreState;
  onDrop: (e: React.DragEvent) => void;
  onCancelImport: () => void;
  onConfirmExtract: () => void;
  onContinue: () => void;
  onLoadCourse: (slug: string, name: string) => void;
  onStartIbQuiz: (questions: ImportedQuestion[]) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function BancoIB({
  ibImportStage, ibProcessing, ibProcessingStatus, ibDetected, ibProgress, ibImportError,
  importError, dragOver, ibCoursesList, ibLoading, ibFlashcardLoading, state,
  onDrop, onCancelImport, onConfirmExtract, onContinue, onLoadCourse, onStartIbQuiz, onFileSelect,
}: BancoIBProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-6">
      {ibImportStage === 'scanning' && (
        <div className="border-2 border-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 md:p-12 text-center transition-all">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600" />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Escaneando archivo...</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">{ibProcessingStatus}</p>
        </div>
      )}

      {ibImportStage === 'confirm' && ibDetected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Cursos detectados</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
            Se encontraron {ibDetected.length} carpetas de cursos en el archivo .zip.
            {!ibProcessing && ' Confirma para extraer las preguntas de cada curso.'}
          </p>
          <div className="space-y-2 mb-6">
            {ibDetected.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${d.course.color} flex items-center justify-center text-sm shadow-sm`}>
                  {d.course.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-surface-900 dark:text-white">{d.course.name}</p>
                  <p className="text-[10px] text-surface-400">{d.count} archivos · carpeta: {d.folderName}</p>
                </div>
              </div>
            ))}
          </div>
          {!ibProcessing && (
            <div className="flex gap-3">
              <button onClick={onCancelImport}
                className="flex-1 text-sm font-semibold bg-white dark:cyber-card-dark border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-xl py-3 hover:border-red-300 transition-all">
                Cancelar
              </button>
              <button onClick={onConfirmExtract}
                className="flex-1 text-sm font-semibold bg-primary-600 text-white rounded-xl py-3 hover:bg-primary-700 transition-all shadow-md flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Extraer preguntas
              </button>
            </div>
          )}
        </motion.div>
      )}

      {ibImportStage === 'extracting' && (
        <div className="border-2 border-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 md:p-12 text-center transition-all">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600" />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Extrayendo preguntas con IA...</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{ibProcessingStatus}</p>
          <div className="w-full max-w-md mx-auto bg-white dark:bg-surface-800 rounded-full h-2.5 overflow-hidden">
            <div className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${ibProgress.total > 0 ? (ibProgress.current / ibProgress.total) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
            Curso {ibProgress.current + 1} de {ibProgress.total}
          </p>
        </div>
      )}

      {ibImportStage === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">¡Importación completada!</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-4">{ibProcessingStatus}</p>
          <button onClick={onContinue}
            className="text-sm font-semibold bg-emerald-600 text-white rounded-xl px-6 py-3 hover:bg-emerald-700 transition-all">
            Continuar
          </button>
        </motion.div>
      )}

      {ibImportStage === 'idle' && (
        <div onDragOver={(e) => { e.preventDefault(); onDrop(e as any); }}
          onDragLeave={() => {/* parent */}} onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${dragOver ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30' : 'border-surface-200 dark:border-surface-700 bg-white dark:cyber-card-dark'}`}>
          <Globe className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-primary-600' : 'text-surface-300 dark:text-surface-600'}`} />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Importar banco IB</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
            Sube un archivo <strong>.zip</strong> con exámenes pasados IB
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            Las ediciones HTML (5th/4th Topic) se procesan al instante sin IA.
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
            Los PDFs se procesan con IA (solo opción múltiple).
          </p>
          {importError && <p className="text-xs text-red-600 dark:text-red-400 mb-4">{importError}</p>}
          <button onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-primary-600 text-white rounded-xl px-6 py-3 hover:bg-primary-700 transition-all cursor-pointer shadow-md">
            <Upload className="w-4 h-4" /> Seleccionar .zip IB
          </button>
          <input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={onFileSelect} />
        </div>
      )}

      {ibImportStage !== 'scanning' && ibImportStage !== 'extracting' && (
        <div>
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-3">
            Cursos IB pre-cargados
          </h3>
          {ibLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="ml-2 text-sm text-surface-500">Cargando cursos...</span>
            </div>
          ) : ibCoursesList.length === 0 ? (
            <div className="text-center py-8">
              <Library className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
              <p className="text-sm text-surface-500 dark:text-surface-400">No hay cursos precargados disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ibCoursesList.map(c => {
                const courseDef = IB_COURSES.find(co => c.slug.includes(co.id.replace(/^\d+-dp-/, ''))) || null;
                return (
                  <button key={c.slug} onClick={() => onLoadCourse(c.slug, c.name)}
                    disabled={ibFlashcardLoading}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left group border-surface-100 bg-white dark:cyber-card-dark hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${courseDef?.color || 'from-primary-500 to-accent-600'} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                      {courseDef?.icon || '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold block text-surface-700 dark:text-surface-200 truncate">{c.name}</span>
                      <span className="text-[10px] text-surface-400">{c.count} flashcards</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {(() => {
        const legacyEntries = state.ibBanks.reduce((acc: any[], b: any) => {
          if (!acc.find(a => a.courseId === b.courseId)) {
            const course = IB_COURSES.find(c => c.id === b.courseId);
            acc.push({
              courseId: b.courseId,
              label: b.courseName,
              count: state.ibBanks.filter((x: any) => x.courseId === b.courseId).reduce((s: number, x: any) => s + x.questions.length, 0),
              color: course?.color || 'from-surface-500 to-surface-700',
              icon: course?.icon || '📄',
            });
          }
          return acc;
        }, []);

        if (legacyEntries.length === 0) return null;

        return (
          <div>
            <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-3 mt-6">Bancos IB importados (PDF)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {legacyEntries.map((entry: any) => (
                <button key={'legacy-' + entry.courseId} onClick={() => {
                  const banks = getIbBanksByCourse(state, entry.courseId);
                  if (banks.length > 0) {
                    const allQs = banks.flatMap((b: any) => b.questions);
                    onStartIbQuiz(allQs as ImportedQuestion[]);
                  }
                }}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left group border-surface-100 bg-white dark:cyber-card-dark hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${entry.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold block text-surface-700 dark:text-surface-200 truncate">{entry.label}</span>
                    <span className="text-[10px] text-surface-400">{entry.count} preguntas</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {state.ibBanks.length > 0 && (
        <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-surface-900 dark:text-white">Bancos IB importados</p>
            <span className="text-[10px] text-surface-400">{state.ibBanks.length} bancos</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {state.ibBanks.slice(0, 20).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  {(() => {
                    const c = IB_COURSES.find(c => c.id === b.courseId);
                    return c ? <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-[10px] flex-shrink-0`}>{c.icon}</span> : null;
                  })()}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate">{b.courseName}</p>
                    <p className="text-[10px] text-surface-400">{b.folderName} · {b.questions.length} preguntas</p>
                  </div>
                </div>
                <button onClick={() => onStartIbQuiz(b.questions as ImportedQuestion[])}
                  className="text-[10px] font-semibold text-primary-600 hover:text-primary-700 flex-shrink-0 ml-2">
                  Practicar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
