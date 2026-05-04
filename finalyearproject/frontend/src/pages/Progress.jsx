import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [progressRes, statsRes] = await Promise.all([
        progressAPI.getAll(),
        progressAPI.getStudentStats()
      ]);
      setProgress(progressRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch progress');
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

  const chartData = {
    labels: progress.map(p => p.course?.title?.substring(0, 10) || 'Course'),
    datasets: [
      {
        label: 'Progress %',
        data: progress.map(p => p.totalProgress),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCourses || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.completedCourses || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.inProgressCourses || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Progress</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.averageProgress || 0}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Progress</h2>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      {/* Progress List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed Progress</h2>
        <div className="space-y-4">
          {progress.map((p) => (
            <div key={p._id} className="border dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{p.course?.title}</h3>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{p.totalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${p.totalProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{p.completedLessons?.length || 0} lessons completed</span>
                <span>{p.completedAssessments?.length || 0} assessments completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
