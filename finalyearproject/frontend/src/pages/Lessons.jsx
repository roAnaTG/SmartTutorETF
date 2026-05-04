import { useState, useEffect } from 'react';
import { lessonsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await lessonsAPI.getAll();
      setLessons(response.data);
    } catch (error) {
      toast.error('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lessons</h1>
        {user?.role === 'tutor' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create Lesson
          </button>
        )}
      </div>

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div key={lesson._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Week {lesson.week} • {lesson.duration} min
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{lesson.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                lesson.isPublished 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {lesson.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            {lesson.videoUrl && (
              <div className="mt-4">
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Watch Video →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;
