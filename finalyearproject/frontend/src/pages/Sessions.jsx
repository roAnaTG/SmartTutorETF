import { useState, useEffect } from 'react';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll({ upcoming: 'true' });
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (sessionId) => {
    try {
      await sessionsAPI.join(sessionId);
      toast.success('Joined session successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to join session');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{session.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                session.type === 'live' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
              }`}>
                {session.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(session.scheduledAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Duration: {session.duration} min
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Course: {session.course?.title}
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleJoin(session._id)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Join Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;
