// src/pages/LessonPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonById } from '../../utils/api';
import ProcessRenderer from '../../utils/ProcessRender';
import ImageViewer from 'react-simple-image-viewer';

interface Lesson {
  id: number;
  title: string;
  cover: string;
  description: string;
  materials: string;
  process: string;
  recommendations: string;
  comments: string;
}

const LessonPage: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      try {
        const data = await getLessonById(lessonId);
        setLesson(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!lesson) return <div className="p-4">Lesson not found</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
      {lesson.cover && (
      <>
        <img 
          src={lesson.cover} 
          alt={lesson.title} 
          className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsViewerOpen(true)}
        />
        
        {isViewerOpen && (
          <ImageViewer
            src={[lesson.cover]}
            currentIndex={0}
            onClose={() => setIsViewerOpen(false)}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 1000
            }}
            closeOnClickOutside={true}
          />
        )}
      </>
      )}
      
      <div className="mb-1">
        <h2 className="text-xl font-semibold">Описание урока</h2>
        <p className="whitespace-pre-line">{lesson.description}</p>
      </div>
      
      <div className="mb-3">
        <h2 className="text-xl font-semibold">Материалы</h2>
        <p className="whitespace-pre-line">{lesson.materials}</p>
      </div>
      
      <div className="mb-3">
        <h2 className="text-xl font-semibold">Процесс</h2>
        <ProcessRenderer content={lesson.process} />
      </div>
      
      {lesson.recommendations && (
        <div className="mb-3">
          <h2 className="text-xl font-semibold">Важные рекомендации</h2>
          <ProcessRenderer content={lesson.recommendations} />
        </div>
      )}
      
      {lesson.comments && (
        <div className="mb-3">
          <h3 className="text-xl font-semibold">*Дополнительные идеи</h3>
          <ProcessRenderer content={lesson.comments} />
        </div>
      )}
    </div>
  );
};

export default LessonPage;