import React, { useEffect, useState } from 'react';
import { getCalendarDate } from '../../utils/GetCalendarDate';
import { getDiaryData, createNote } from '../../utils/api';

const CreatingNotesPage: React.FC = () => {
  const [moods, setMoods] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [influences, setInfluences] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [textNote, setTextNote] = useState('');
  const [selectedMoodType, setSelectedMoodType] = useState<'with a timestamp' | 'of the day'>('with a timestamp');
  const { selectedDate } = getCalendarDate();
  const [selectedTime, setSelectedTime] = useState<string>(() =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  // Conditional button label based on logic
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
  const conditionalButtonLabel = () => {
    if (selectedMoodType === 'with a timestamp') {
      if (isToday && selectedTime === currentTime) {
        return 'Настроение сейчас';
      }
      return `Настроение в ${selectedTime}`;
    }
    return 'Настроение в ...';
  };

  // Fetch data for moods, emotions, and influences
  useEffect(() => {
    getDiaryData()
      .then((data) => {
        setMoods(data.moods);
        setEmotions(data.emotions);
        setInfluences(data.influences);
      })
      .catch(console.error);
  }, []);

  // Toggle selection for emotions and influences
  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddNote = async () => {
    console.log(`selected date and time ${selectedDate} ${selectedTime}`);

    const dateToPass = selectedDate;
    const timeToPass = selectedMoodType === 'with a timestamp' ? selectedTime : null;

    console.log(`date-to-pass: ${dateToPass}, time-to-pass: ${timeToPass}`);

    try {
      await createNote({
        date: dateToPass,
        time: timeToPass,
        mood: selectedMood,
        emotions: selectedEmotions,
        influences: selectedInfluences,
        text_note: textNote,
      });

      // Erase fields
      setSelectedMood('');
      setSelectedEmotions([]);
      setSelectedInfluences([]);
      setTextNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {`Добавить заметку ${selectedDate.split('-').reverse().join('.')}`}
      </h2>

      {/* Mood Type Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        {/* Conditional Button */}
        <button
          type="button"
          onClick={() => setSelectedMoodType('with a timestamp')}
          className={`px-4 py-2 border rounded-md ${selectedMoodType === 'with a timestamp' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
        >
          {conditionalButtonLabel()}
        </button>

        {/* Static Button */}
        <button
          type="button"
          onClick={() => setSelectedMoodType('of the day')}
          className={`px-4 py-2 border rounded-md ${selectedMoodType === 'of the day' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
        >
          Общее настроение за день
        </button>
      </div>

      {/* Timepicker (Only visible for conditional mood type) */}
      {selectedMoodType === 'with a timestamp' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Выберите время</label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Mood */}
      < div className="mb-4" >
        <label className="block text-sm font-medium text-gray-700 mb-2">Настроение</label> {/* add here little button with label сейчас and this button is showed only when date on the calendar is today and it changes time in the picker to the current time */}
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="" disabled>
            Выберите настроение
          </option>
          {moods.map((mood: any) => (
            <option key={mood.id} value={mood.id}>
              {mood.name}
            </option>
          ))}
        </select>
      </div >

      {/* Emotions */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Эмоции</label>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion: any) => (
            <button
              key={emotion.id}
              type="button"
              className={`flex flex-col items-center p-2 border rounded-md ${selectedEmotions.includes(emotion.id)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
                }`}
              onClick={() => toggleSelection(emotion.id, selectedEmotions, setSelectedEmotions)}
            >
              {emotion.icon ? (
                <img
                  src={emotion.icon}
                  alt={emotion.name}
                  className="w-12 h-12 mb-1"
                />
              ) : (
                <div className="w-12 h-12 mb-1 bg-gray-200 rounded-full"></div>
              )}
              <span className="text-xs">{emotion.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Influences */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Влияния</label>
        <div className="flex flex-wrap gap-2"> {/* Changed from grid to flex */}
          {influences.map((influence: any) => (
            <button
              key={influence.id}
              type="button"
              className={`flex flex-col items-center p-2 border rounded-md ${selectedInfluences.includes(influence.id)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
                }`}
              onClick={() => toggleSelection(influence.id, selectedInfluences, setSelectedInfluences)}
            >
              {influence.icon ? (
                <img
                  src={influence.icon}
                  alt={influence.name}
                  className="w-12 h-12 mb-1"  // Matched emotion icon size
                />
              ) : (
                <div className="w-12 h-12 mb-1 bg-gray-200 rounded-full"></div>
              )}
              <span className="text-xs">{influence.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Note */}
      < div className="mb-4" >
        <label className="block text-sm font-medium text-gray-700 mb-2">Текст заметки</label>
        <textarea
          value={textNote}
          onChange={(e) => setTextNote(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
        />
      </div >

      {/* Buttons */}
      < div className="flex justify-end gap-4" >
        <button
          type="button"
          onClick={() => {
            setSelectedMood('');
            setSelectedEmotions([]);
            setSelectedInfluences([]);
            setTextNote('');
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 focus:outline-none"
        >
          Очистить
        </button>
        <button
          type="button"
          onClick={handleAddNote}
          className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none"
        >
          Добавить заметку
        </button>
      </div >
    </div >
  );
};

export default CreatingNotesPage;