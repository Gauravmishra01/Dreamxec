import React, { useEffect, useState } from 'react';
import { getEntityNotes, createEntityNote } from '../../services/adminService';

interface AdminNotesPanelProps {
  entityType: 'user' | 'club' | 'project' | 'donor' | 'donor_project';
  entityId: string;
}

export default function AdminNotesPanel({ entityType, entityId }: AdminNotesPanelProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [entityId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await getEntityNotes(entityType, entityId);
      setNotes(res.data.notes);
    } catch (error) {
      console.error("Failed to load notes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await createEntityNote(entityType, entityId, newNote);
      setNotes([res.data.note, ...notes]);
      setNewNote('');
    } catch (error) {
      alert("Failed to add note");
    }
  };

  return (
    <div className="bg-dreamxec-cream/50 rounded-xl p-4 border-2 border-dreamxec-navy/20 h-full flex flex-col">
      <h3 className="text-lg font-bold text-dreamxec-navy font-display mb-4">Internal Admin Notes</h3>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto max-h-60 space-y-3 mb-4 pr-2">
        {loading ? (
          <p className="text-sm text-gray-500 text-center">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm">
              <p className="text-dreamxec-navy whitespace-pre-wrap">{note.content}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span className="font-bold">{note.author?.name || 'Admin'}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleAddNote} className="mt-auto">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a private note..."
          className="w-full p-2 rounded-lg border-2 border-dreamxec-navy/20 focus:border-dreamxec-orange outline-none text-sm resize-none h-20"
        />
        <button 
          type="submit" 
          disabled={!newNote.trim()}
          className="mt-2 w-full py-2 bg-dreamxec-navy text-white rounded-lg font-bold text-xs hover:bg-dreamxec-orange transition-colors disabled:opacity-50"
        >
          Add Note
        </button>
      </form>
    </div>
  );
}