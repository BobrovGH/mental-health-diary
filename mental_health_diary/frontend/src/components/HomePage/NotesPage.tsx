import React, { useState, useEffect } from 'react';
import CreatingNotesPage from './CreatingNotesPage'; // Import the Create Note page component
import { convertUTCToLocal } from '../../utils/convertUTCtoLocal';

interface Note {
  id: number;
  date: string;
  time?: string;
  mood: string | null;
  emotions: string[];
  influences: string[];
  text_note: string | null;
}

interface NotesByDate {
  [date: string]: Note[];
}

const NotesPage: React.FC = () => {
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [notesByDate, setNotesByDate] = useState<NotesByDate>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/diary/get_notes/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data: NotesByDate = await response.json();
        setNotesByDate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {isCreatingNote ? (
        <div>
          <button
            onClick={() => setIsCreatingNote(false)}
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Назад
          </button>
          <CreatingNotesPage />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Заметки</h2>
          <button
            onClick={() => setIsCreatingNote(true)}
            className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none"
          >
            Добавить новую заметку
          </button>

          {Object.keys(notesByDate).length === 0 ? (
            <p>У вас нет заметок</p>
          ) : (
            Object.entries(notesByDate).map(([date, notes]) => (
              <div key={date} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{date}</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-2">Время</th>
                      <th className="p-2">Настроение</th>
                      <th className="p-2">Эмоции</th>
                      <th className="p-2">Влияния</th>
                      <th className="p-2">Заметка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note) => (
                      <tr key={note.id} className="border-t">
                        <td className="p-2">{note.time}</td>
                        <td className="p-2">{note.mood || '—'}</td>
                        <td className="p-2">{note.emotions.join(', ') || '—'}</td>
                        <td className="p-2">{note.influences.join(', ') || '—'}</td>
                        <td className="p-2">{note.text_note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPage;