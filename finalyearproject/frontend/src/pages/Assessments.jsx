import { useState, useEffect } from 'react';
import { assessmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await assessmentsAPI.getAll();
      setAssessments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assessments');
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{assessment.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                assessment.type === 'quiz' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                assessment.type === 'assignment' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
              }`}>
                {assessment.type}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {assessment.questions?.length} questions • {assessment.totalPoints} points
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Time limit: {assessment.timeLimit} min
            </p>
            {assessment.dueDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Due: {new Date(assessment.dueDate).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {user?.role === 'student' ? 'Take Assessment' : 'View Details'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assessments;
