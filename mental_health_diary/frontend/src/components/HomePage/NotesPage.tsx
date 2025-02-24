import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faSquareXmark } from '@fortawesome/free-solid-svg-icons';

interface Emotion {
  name: string;
  icon: string | null;
}

interface Influence {
  name: string;
  icon: string | null;
}

interface Note {
  id: number;
  date: string;
  time?: string;
  mood: string | null;
  emotions: Emotion[];
  influences: Influence[];
  text_note: string | null;
}

interface NotesByDate {
  [date: string]: Note[];
}

const NotesPage: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Function to open the modal with note details
  const openModal = (note: Note, date: string) => {
    setSelectedNote(note);
    setSelectedDate(date)
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedNote(null);
  };
  
  const deleteNote = async (noteId: number, date: string) => {
    try {
      const response = await fetch(`${apiUrl}/diary/delete_note/${noteId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const [notesByDate, setNotesByDate] = useState<NotesByDate>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateRU = (date: string) => {
    return date.split("-").reverse().join(".");
  }
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${apiUrl}/diary/get_notes/`, {
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
    <div className="flex gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Заметки</h2>
        <button
          className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none"
        >
          <Link to="/notes/create">Добавить новую заметку</Link>
        </button>
        </div>

        {Object.keys(notesByDate).length === 0 ? (
          <p>У вас нет заметок</p>
        ) : (
          Object.entries(notesByDate).map(([date, notes]) => (
            <div key={date} id={date} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{formatDateRU(date)}</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2 w-[10%]">Время</th>
                    <th className="p-2 w-[20%]">Настроение</th>
                    <th className="p-2 w-[20%]">Эмоции</th>
                    <th className="p-2 w-[20%]">Влияния</th>
                    <th className="p-2 w-[20%]">Заметка</th>
                    <th className="p-2 w-[10%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id} className="border-t">
                      <td className="p-2">{note.time}</td>
                      <td className="p-2">{note.mood}</td>

                      {/* Emotions */}
                      <td className="p-2">
                        <div className="flex gap-1">
                          {note.emotions.length > 0 ? (
                            note.emotions.map((emotion, index) =>
                              emotion.icon ? (
                                <img
                                  key={index}
                                  src={emotion.icon}
                                  alt={emotion.name}
                                  title={emotion.name}
                                  className="w-8 h-8"
                                />
                              ) : (
                                <span key={index} className="text-sm">
                                  {emotion.name}
                                </span>
                              )
                            )
                          ) : (
                            "—"
                          )}
                        </div>
                      </td>

                      {/* Influences */}
                      <td className="p-2">
                        <div className="flex gap-1">
                          {note.influences.length > 0 ? (
                            note.influences.map((influence, index) =>
                              influence.icon ? (
                                <img
                                  key={index}
                                  src={influence.icon}
                                  alt={influence.name}
                                  title={influence.name}
                                  className="w-8 h-8"
                                />
                              ) : (
                                <span key={index} className="text-sm">
                                  {influence.name}
                                </span>
                              )
                            )
                          ) : (
                            "—"
                          )}
                        </div>
                      </td>

                      <td className="p-2">{note.text_note || "—"}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          className="fa-solid fa-user px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() => openModal(note, formatDateRU(date))}><FontAwesomeIcon icon={faEye} /></button>
                        <button 
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => deleteNote(note.id, date)}><FontAwesomeIcon icon={faTrash} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      {/* SideBar */}
      <aside className="w-32 right-0 top-0 h-full bg-white shadow-lg overflow-auto p-4">
        <h3 className="text-lg font-bold mb-2">Даты</h3>
        <ul className="space-y-2">
          {Object.keys(notesByDate).map((date) => (
            <li key={date}>
              <a
                href={`#${date}`}
                className="block p-2 rounded-md hover:bg-gray-200 transition"
              >
                {formatDateRU(date)}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Modal for Viewing Note */}
      {selectedNote && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal} // Close when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Заметка от {selectedDate} в {selectedNote.time} </h3>
              <button
                className="px-2 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faSquareXmark} />
              </button>
            </div>

            {/* Mood */}
            <p>
              <strong>Настроение:</strong> {selectedNote.mood}
            </p>

            {/* Emotions */}
            <div className="mt-2">
              <strong>Эмоции</strong>
              <div className="flex gap-2 mt-1">
                {selectedNote.emotions.length > 0 ? (
                  selectedNote.emotions.map((emotion, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      {emotion.icon && (
                        <img
                          src={emotion.icon}
                          alt={emotion.name}
                          title={emotion.name}
                          className="w-8 h-8"
                        />
                      )}
                      <span className="text-xs">{emotion.name}</span>
                    </div>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            {/* Influences */}
            <div className="mt-2">
              <strong>Влияния</strong>
              <div className="flex gap-2 mt-1">
                {selectedNote.influences.length > 0 ? (
                  selectedNote.influences.map((influence, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      {influence.icon && (
                        <img
                          src={influence.icon}
                          alt={influence.name}
                          title={influence.name}
                          className="w-8 h-8"
                        />
                      )}
                      <span className="text-xs">{influence.name}</span>
                    </div>
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            {/* Note Text */}
            <p className="mt-2">
              <strong>Заметка</strong> 
            </p>
            {selectedNote.text_note || "—"}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;