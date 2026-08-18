import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2, Save, BookOpen, ChevronDown, ChevronUp, Download, Upload, Edit3, Eye, X } from 'lucide-react';
import { Document, addDocument, updateDocument, deleteDocument, getDocumentsBySubject, loadState } from '../../lib/store';

const SUBJECTS = ['Matemáticas', 'Física', 'Química', 'Historia', 'Comunicación', 'Biología', 'Computación', 'Inglés', 'General'];

export default function MiDocumentos() {
  const [state, setState] = useState(loadState);
  const [selectedSubject, setSelectedSubject] = useState('Todos');
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('General');
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');

  const filtered = selectedSubject === 'Todos'
    ? state.documents
    : state.documents.filter((d) => d.subject === selectedSubject);

  const startNewDoc = () => {
    setEditingDoc(null);
    setTitle('');
    setContent('');
    setSubject('General');
    setViewMode('editor');
    setNewDoc(true);
  };

  const startEdit = (doc: Document) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setContent(doc.content);
    setSubject(doc.subject);
    setViewMode('editor');
    setNewDoc(false);
  };

  const saveDoc = () => {
    if (!title.trim()) return;
    if (editingDoc) {
      updateDocument(editingDoc.id, { title, content, subject });
    } else {
      addDocument({ title, content, subject, courseId: undefined, isPublic: false });
    }
    setViewMode('list');
    setState(loadState());
  };

  const removeDoc = (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return;
    deleteDocument(id);
    setState(loadState());
  };

  const exportDoc = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" /> Mis Documentos
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Crea, edita y organiza tus apuntes por materia
          </p>
        </div>
        <button onClick={startNewDoc}
          className="btn-primary flex items-center gap-2 text-sm !py-3 !px-5">
          <Plus className="w-4 h-4" /> Nuevo documento
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'editor' ? (
          <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">
                {editingDoc ? 'Editar documento' : 'Nuevo documento'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-surface-400">{wordCount} palabras</span>
                <button onClick={() => setViewMode('list')}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 dark:text-surface-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 block">Título</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título del documento"
                  className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400" />
              </div>
              <div>
                <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 block">Materia</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1 block">Contenido</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                rows={15}
                placeholder="Escribe tu contenido aquí... Usa **negrita** para destacar y `código` para fragmentos."
                className="w-full border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400 resize-none font-mono" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => exportDoc({ id: '', title, content, subject, createdAt: '', updatedAt: '', isPublic: false })}
                  className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Download className="w-4 h-4" /> Exportar .md
                </button>
                {editingDoc && (
                  <button onClick={() => removeDoc(editingDoc.id)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                )}
              </div>
              <button onClick={saveDoc}
                className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-5">
                <Save className="w-4 h-4" /> Guardar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {/* Subject filter */}
            <div className="flex flex-wrap gap-2">
              {['Todas', ...SUBJECTS].map(s => (
                <button key={s} onClick={() => setSelectedSubject(s === 'Todas' ? 'Todos' : s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    selectedSubject === (s === 'Todas' ? 'Todos' : s)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white dark:cyber-card-dark text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-primary-300'
                  }`}>
                  {s}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 p-12 text-center">
                <FileText className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                <p className="text-surface-500 dark:text-surface-400 mb-2">
                  {selectedSubject === 'Todos' ? 'No tienes documentos aún' : `Sin documentos en ${selectedSubject}`}
                </p>
                <p className="text-sm text-surface-400 dark:text-surface-500">Crea tu primer documento para empezar a organizar tus apuntes</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filtered.map((doc, i) => (
                  <motion.div key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:cyber-card-dark rounded-2xl border border-surface-100 shadow-sm p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-surface-900 dark:text-white text-sm flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(doc)} className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-400 dark:text-surface-500 hover:text-primary-600">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => exportDoc(doc)} className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 text-surface-400 dark:text-surface-500 hover:text-primary-600">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeDoc(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-surface-400 dark:text-surface-500 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-3">
                      {doc.content.slice(0, 120)}{doc.content.length > 120 ? '...' : ''}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {doc.subject}
                      </span>
                      <span className="text-[10px] text-surface-400 dark:text-surface-500">{formatDate(doc.updatedAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center pt-4">
              <button onClick={startNewDoc}
                className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors">
                <Plus className="w-4 h-4" /> Crear nuevo documento
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}