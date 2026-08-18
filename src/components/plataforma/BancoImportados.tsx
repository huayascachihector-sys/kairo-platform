import { useRef } from 'react';
import { Archive, Upload, FileText, HardDrive } from 'lucide-react';
import type { StoreState, ImportedQuestionBank } from '../../lib/store';
import { removeImportedBank, loadState } from '../../lib/store';

const DIFF_META: Record<string, { color: string; label: string }> = {
  facil: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', label: 'Fácil' },
  medio: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', label: 'Medio' },
  dificil: { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', label: 'Difícil' },
};

interface BancoImportadosProps {
  state: StoreState;
  processing: boolean;
  processingStatus: string;
  dragOver: boolean;
  importError: string;
  onDrop: (e: React.DragEvent) => void;
  onDragOver?: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartQuiz: () => void;
  onRemoved?: () => void;
  onSetBank: (b: ImportedQuestionBank) => void;
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function BancoImportados({
  state, processing, processingStatus, dragOver, importError,
  onDrop, onDragOver, onFileSelect, onStartQuiz, onRemoved, onSetBank,
}: BancoImportadosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-6">
      {processing ? (
        <div className="border-2 border-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-2xl p-8 md:p-12 text-center transition-all">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Procesando...</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400">{processingStatus}</p>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
          onDragLeave={() => {}} onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${dragOver ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30' : 'border-surface-200 dark:border-surface-700 bg-white dark:cyber-card-dark'}`}>
          <Archive className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-primary-600' : 'text-surface-300 dark:text-surface-600'}`} />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Importar banco de preguntas</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Sube un archivo <strong>.zip</strong> con preguntas</p>
          {importError && <p className="text-xs text-red-600 dark:text-red-400 mb-4">{importError}</p>}
          <button onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-primary-600 text-white rounded-xl px-6 py-3 hover:bg-primary-700 transition-all cursor-pointer shadow-md">
            <Upload className="w-4 h-4" /> Seleccionar .zip
          </button>
          <input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={onFileSelect} />
        </div>
      )}
      {state.importedBanks.length === 0 ? (
        <div className="text-center py-8">
          <HardDrive className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-sm text-surface-500 dark:text-surface-400">No hay bancos importados aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400">Bancos importados ({state.importedBanks.length})</h3>
          {state.importedBanks.map(b => (
            <div key={b.id} className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{b.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-500">{b.subject}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${DIFF_META[b.difficulty]?.color || ''}`}>{DIFF_META[b.difficulty]?.label || b.difficulty}</span>
                  <span className="text-[10px] text-surface-400">{b.questions.length} preguntas</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { onSetBank(b); onStartQuiz(); }}
                  className="text-xs font-semibold bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-all">Practicar</button>
                <button onClick={() => { removeImportedBank(b.id); onRemoved?.(); }}
                  className="text-xs text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
