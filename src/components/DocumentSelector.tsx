import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Search } from 'lucide-react';
import { Document as AppDocument, loadState, getDocumentsBySubject } from '../lib/store';

const SUBJECTS = ['Todas', 'Matemáticas', 'Física', 'Química', 'Historia', 'Comunicación', 'Biología', 'Computación', 'Inglés', 'General'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (doc: AppDocument) => void;
}

export default function DocumentSelector({ open, onClose, onSelect }: Props) {
  const [state] = useState(loadState);
  const [filterSubject, setFilterSubject] = useState('Todas');
  const [search, setSearch] = useState('');

  const docs = filterSubject === 'Todas' ? state.documents : getDocumentsBySubject(state, filterSubject);
  const filtered = search.trim()
    ? docs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    : docs;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-white dark:cyber-card-dark rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-surface-800">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Mis Documentos
              </h2>
              <button onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 dark:text-surface-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-surface-100 dark:border-surface-800 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar documentos..."
                  className="w-full bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-surface-900 dark:text-white placeholder-surface-400 outline-none focus:border-primary-400" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map(s => (
                  <button key={s} onClick={() => setFilterSubject(s)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                      filterSubject === s
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {search ? 'Sin resultados de búsqueda' : 'No hay documentos aún'}
                  </p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                    Crea documentos desde la sección "Mis Documentos"
                  </p>
                </div>
              ) : (
                filtered.map((doc) => (
                  <button key={doc.id} onClick={() => onSelect(doc)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 border border-transparent hover:border-surface-200 dark:hover:border-surface-700 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{doc.subject}</span>
                        <span className="text-[10px] text-surface-400 dark:text-surface-500">{doc.content.split(/\s+/).filter(Boolean).length} palabras</span>
                      </div>
                    </div>
                    <span className="text-xs text-primary-600 dark:text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Adjuntar
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
