'use client';

import { MessageSquare, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { ReportNote } from '@/lib/types';

interface PersonalNotesProps {
  reportId: string;
  userId: string;
}

export default function PersonalNotes({ reportId, userId }: PersonalNotesProps) {
  const [noteContent, setNoteContent] = useState('');
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar nota existente al montar el componente
  useEffect(() => {
    loadNote();
  }, [reportId, userId]);

  const loadNote = async () => {
    try {
      setIsLoading(true);
      const notesRef = collection(db, 'reportNotes');
      const q = query(
        notesRef,
        where('userId', '==', userId),
        where('reportId', '==', reportId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const noteDoc = snapshot.docs[0];
        const note = { id: noteDoc.id, ...noteDoc.data() } as ReportNote;
        setNoteContent(note.content);
        setExistingNoteId(note.id);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading note:', error);
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      alert('La nota no puede estar vacía');
      return;
    }

    try {
      setIsSaving(true);

      if (existingNoteId) {
        // Actualizar nota existente
        await updateDoc(doc(db, 'reportNotes', existingNoteId), {
          content: noteContent,
          updatedAt: new Date(),
        });
      } else {
        // Crear nueva nota
        const newNote: Omit<ReportNote, 'id'> = {
          userId,
          reportId,
          content: noteContent,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'reportNotes'), newNote);
        setExistingNoteId(docRef.id);
      }

      alert('Nota guardada exitosamente');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error al guardar la nota');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900">Notas Personales</h3>
        </div>
        <p className="text-sm text-gray-500">Cargando nota...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">Notas Personales</h3>
          <p className="text-xs text-gray-500">
            Solo tú puedes ver estas notas (asociadas a tu cuenta)
          </p>
        </div>
      </div>

      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Agrega tus propias observaciones o preguntas para después..."
        className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
      />

      <Button
        onClick={handleSaveNote}
        disabled={isSaving || !noteContent.trim()}
        className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {existingNoteId ? 'Actualizar Nota' : 'Guardar Nota'}
          </>
        )}
      </Button>

      {existingNoteId && (
        <p className="text-xs text-green-600 mt-2">
          ✓ Nota guardada en tu cuenta
        </p>
      )}
    </div>
  );
}
