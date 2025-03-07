import React, { useEffect, useState } from 'react';
import { getCalendarDate } from '../../utils/GetCalendarDate';
import { getDiaryData, createNote } from '../../utils/api';

const CreatingNotesPage: React.FC = () => {
  const [moods, setMoods] = useState([]);
  const [posEmotions, setPosEmotions] = useState([]);
  const [negEmotions, setNegEmotions] = useState([]);
  const [energy, setEnergy] = useState([]);
  const [influences, setInfluences] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const [textNote, setTextNote] = useState('');
  const [selectedMoodType, setSelectedMoodType] = useState<'with a timestamp' | 'of the day'>('with a timestamp');
  const { selectedDate, setSelectedDate } = getCalendarDate();
  const [selectedTime, setSelectedTime] = useState<string>(() =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Conditional button label based on logic
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const [maxTime, setMaxTime] = useState<string>(
    isToday ? new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false }) : '23:59'
  );

  // Update maxTime dynamically
  useEffect(() => {
    if (isToday) {
      const updateMaxTime = () => {
        setMaxTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false }));
      };
      updateMaxTime(); // Set initially
      const interval = setInterval(updateMaxTime, 60000); // Update every minute
      return () => clearInterval(interval);
    } else {
      setMaxTime('23:59');
    }
  }, [selectedDate]);

  // Reset time to current when returning to today
  useEffect(() => {
    if (isToday) {
      setSelectedTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
  }, [selectedDate]);

  const conditionalButtonLabel = () => {
    if (selectedMoodType === 'with a timestamp') {
      return isToday && selectedTime === maxTime ? 'Настроение сейчас' : `Настроение в ${selectedTime}`;
    }
    return 'Настроение в ...';
  };


  // Fetch data for moods, emotions, and influences
  useEffect(() => {
    getDiaryData()
      .then((data) => {
        setMoods(data.moods);
        setPosEmotions(data.positive_emotions);
        setNegEmotions(data.negative_emotions);
        setEnergy(data.energy);
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

  // Creating a new note
  const handleAddNote = async () => {
    const dateToPass = selectedDate;
    const timeToPass = selectedMoodType === 'with a timestamp' ? selectedTime : null;

    try {
      await createNote({
        date: dateToPass,
        time: timeToPass,
        mood: selectedMood,
        emotions: selectedEmotions,
        influences: selectedInfluences,
        text_note: textNote,
      });

      // Success message
      setSuccessMessage('Добавлена новая заметка');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Erase fields
      setSelectedMood('');
      setSelectedEmotions([]);
      setSelectedInfluences([]);
      setTextNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Prevent user from entering future time (if today is selected)
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let enteredTime = e.target.value;
    if (isToday && enteredTime > maxTime) {
      enteredTime = maxTime;
    }
    setSelectedTime(enteredTime);
  };

  const handleSelectNow = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {`Добавить заметку ${selectedDate.split('-').reverse().join('.')}`}
      </h2>

      <div>
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
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Выберите время</label>
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-26 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                max={maxTime}
              />
              {isToday && (
                <button
                  type="button"
                  onClick={handleSelectNow}
                  className="px-3 py-1 text-sm border rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  сейчас
                </button>
              )}
            </div>
          </div>
        )
        }
      </div>

      {/* Mood */}
      < div className="mb-4" >
        <label className="text-md font-semibold mb-2">Настроение</label>
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
        <label className="text-md font-semibold mb-2">Эмоции</label>

        {[
          { label: "Позитивные эмоции", data: posEmotions, color: "bg-orange-500" },
          { label: "Негативные эмоции", data: negEmotions, color: "bg-orange-500" },
          { label: "Энергия", data: energy, color: "bg-orange-500" }
        ].map(({ label, data, color }) => (
          <div key={label} className="mb-2">
            <label className="text-sm font-semibold">{label}</label>
            <div className="flex flex-wrap gap-2">
              {data.map((emotion: any) => (
                <button
                  key={emotion.id}
                  type="button"
                  className={`flex flex-col items-center p-2 border rounded-md ${selectedEmotions.includes(emotion.id) ? `${color} text-white` : "bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => toggleSelection(emotion.id, selectedEmotions, setSelectedEmotions)}
                >
                  {emotion.icon ? (
                    <img src={emotion.icon} alt={emotion.name} className="w-12 h-12 mb-1" />
                  ) : (
                    <div className="w-12 h-12 mb-1 bg-gray-200 rounded-full"></div>
                  )}
                  <span className="text-xs">{emotion.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Influences */}
      <div className="mb-4">
        <label className="text-md font-semibold mb-2">Влияния</label>
        <div className="flex flex-wrap gap-2">
          {influences.map((influence: any) => (
            <button
              key={influence.id}
              type="button"
              className={`flex flex-col items-center p-2 border rounded-md ${selectedInfluences.includes(influence.id) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              onClick={() => toggleSelection(influence.id, selectedInfluences, setSelectedInfluences)}
            >
              {influence.icon ? (
                <img src={influence.icon} alt={influence.name} className="w-12 h-12 mb-1" />
              ) : (
                <div className="w-12 h-12 mb-1 bg-gray-200 rounded-full"></div>
              )}
              <span className="text-xs">{influence.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Note */}
      <div className="mb-4">
        <label className="text-md font-semibold mb-2">Текст заметки</label>
        <textarea
          value={textNote}
          onChange={(e) => setTextNote(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
        />
      </div>

      {/* Success message */}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4">
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
          className={`px-4 py-2 text-white font-semibold rounded-md focus:outline-none ${!selectedMood || selectedEmotions.length === 0
              ? 'bg-orange-300'
              : 'bg-orange-500 hover:bg-orange-600'
            }`}
          disabled={!selectedMood || selectedEmotions.length === 0}
        >
          Добавить заметку
        </button>
      </div>
    </div >
  );
};

export default CreatingNotesPage;