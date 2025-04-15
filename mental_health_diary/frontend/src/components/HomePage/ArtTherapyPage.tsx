import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLessons, toggleFavorite, markCompleted } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHeart } from '@fortawesome/free-solid-svg-icons';

interface Lesson {
  id: number;
  title: string;
  cover: string;
  description: string;
  is_favorite: boolean;
  is_completed: boolean;
  last_action?: 'favorite' | 'completed' | null;
}

const ArtTherapyPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { lessons } = await getLessons();
        setLessons(lessons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка загрузки уроков');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLessonClick = (lessonId: number) => {
    navigate(`/arttherapy/${lessonId}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    try {
      const { is_favorite } = await toggleFavorite(lessonId);
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId ? { 
          ...lesson, 
          is_favorite,
          last_action: is_favorite ? 'favorite' : null
        } : lesson
      ));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleCompleteClick = async (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    try {
      const { is_completed } = await markCompleted(lessonId);
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId ? { 
          ...lesson, 
          is_completed,
          last_action: is_completed ? 'completed' : null
        } : lesson
      ));
    } catch (err) {
      console.error('Error marking complete:', err);
    }
  };

  const getButtonOrder = (lesson: Lesson) => {
    if (!lesson.is_favorite && !lesson.is_completed) return [];
    if (lesson.is_favorite && !lesson.is_completed) return ['favorite'];
    if (!lesson.is_favorite && lesson.is_completed) return ['completed'];
    
    // Both are true, order by last action
    return lesson.last_action === 'favorite' 
      ? ['favorite', 'completed'] 
      : ['completed', 'favorite'];
  };

  if (loading) {
    return <div className="p-4 text-center">Загрузка уроков...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Арт-терапия</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          const buttonOrder = getButtonOrder(lesson);
          const showButtons = hoveredLesson === lesson.id || buttonOrder.length > 0;
          
          return (
            <div
              key={lesson.id}
              className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative ${
                lesson.is_completed ? 'border-green-300 bg-green-50' : ''
              }`}
              onClick={() => handleLessonClick(lesson.id)}
              onMouseEnter={() => setHoveredLesson(lesson.id)}
              onMouseLeave={() => setHoveredLesson(null)}
            >
              <div className="relative">
                <img
                  src={lesson.cover}
                  alt={lesson.title}
                  className="w-full h-48 object-cover"
                />

                {/* Persistent buttons in bottom right */}
                {showButtons && (
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    {buttonOrder.map(action => {
                      if (action === 'favorite') {
                        return (
                          <button
                            key="favorite"
                            className={`px-3 py-1 rounded-md ${
                              lesson.is_favorite 
                                ? 'bg-red-600 text-white' 
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                            title={lesson.is_favorite ? "Удалить из избранного" : "Добавить в избранное"}
                            onClick={(e) => handleFavoriteClick(e, lesson.id)}
                          >
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                        );
                      } else {
                        return (
                          <button
                            key="completed"
                            className={`px-3 py-1 rounded-md ${
                              lesson.is_completed
                                ? 'bg-green-600 text-white'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            title={lesson.is_completed ? "Отметить невыполненным" : "Отметить выполненным"}
                            onClick={(e) => handleCompleteClick(e, lesson.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        );
                      }
                    })}

                    {/* Show hover-only buttons if not already persistent */}
                    {hoveredLesson === lesson.id && buttonOrder.length < 2 && (
                      <>
                        {!lesson.is_favorite && (
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            title="Добавить в избранное"
                            onClick={(e) => handleFavoriteClick(e, lesson.id)}
                          >
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                        )}
                        {!lesson.is_completed && (
                          <button
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            title="Отметить выполненным"
                            onClick={(e) => handleCompleteClick(e, lesson.id)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{lesson.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{lesson.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtTherapyPage;