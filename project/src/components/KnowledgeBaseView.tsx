import { useState, useEffect } from 'react';
import { BookOpen, Edit2, Trash2, Check, X } from 'lucide-react';
import { KnowledgeBaseEntry } from '../lib/supabase';
import { getAllKnowledgeBaseEntries, updateKnowledgeBaseEntry, deleteKnowledgeBaseEntry } from '../services/knowledgeBaseService';

export default function KnowledgeBaseView() {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await getAllKnowledgeBaseEntries();
    setEntries(data);
  };

  const handleStartEdit = (entry: KnowledgeBaseEntry) => {
    setEditingId(entry.id);
    setEditQuestion(entry.question);
    setEditAnswer(entry.answer);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const success = await updateKnowledgeBaseEntry(editingId, editQuestion, editAnswer);
    if (success) {
      setEditingId(null);
      setEditQuestion('');
      setEditAnswer('');
      await loadEntries();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const success = await deleteKnowledgeBaseEntry(id);
      if (success) {
        await loadEntries();
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-emerald-700 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-7 h-7" />
            Knowledge Base
          </h1>
          <p className="text-emerald-100 mt-1">
            Learned answers from supervisor responses
          </p>
        </div>

        <div className="p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No learned answers yet</p>
              <p className="text-sm mt-2">Answers will appear here after supervisors respond to requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  {editingId === entry.id ? (
                    <div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Question:
                        </label>
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Answer:
                        </label>
                        <textarea
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 font-medium mb-1">Question:</p>
                          <p className="text-slate-900 font-medium">{entry.question}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-emerald-700 font-medium mb-1">Answer:</p>
                        <p className="text-emerald-900">{entry.answer}</p>
                      </div>

                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Learned: {formatTime(entry.created_at)}</span>
                        {entry.updated_at !== entry.created_at && (
                          <span>Updated: {formatTime(entry.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
