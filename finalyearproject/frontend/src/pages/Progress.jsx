import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Legend,
  Filler
} from 'chart.js';
import { HiChartBar, HiCheckCircle, HiClock, HiLightningBolt, HiTrendingUp, HiAcademicCap, HiCollection } from 'react-icons/hi';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = {
    labels: progress.length > 0 ? progress.map(p => p.course?.title?.substring(0, 10) || 'Course') : ['Start'],
    datasets: [
      {
        label: 'Completion Progress',
        data: progress.length > 0 ? progress.map(p => p.totalProgress) : [0],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: { font: { size: 11, weight: 'bold' }, callback: (v) => `${v}%` }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 'bold' } }
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize your academic growth and milestones.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: stats?.totalCourses || 0, icon: HiCollection, color: 'blue' },
          { label: 'Completed', value: stats?.completedCourses || 0, icon: HiCheckCircle, color: 'emerald' },
          { label: 'In Progress', value: stats?.inProgressCourses || 0, icon: HiClock, color: 'amber' },
          { label: 'Avg. Progress', value: `${stats?.averageProgress || 0}%`, icon: HiTrendingUp, color: 'indigo' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="glass p-6 rounded-[2rem] border-0 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-0 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Learning Curve</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <HiLightningBolt /> Real-time Data
            </div>
          </div>
          <div className="h-[350px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Detailed Progress List */}
        <motion.div variants={itemVariants} className="glass p-8 rounded-[2.5rem] border-0 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Course Breakdown</h2>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {progress.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <HiAcademicCap className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm font-medium">No progress logs found.</p>
              </div>
            ) : (
              progress.map((p) => (
                <div key={p._id} className="group cursor-default">
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                        {p.course?.title}
                      </h3>
                      <div className="flex gap-4 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Lessons: {p.completedLessons?.length || 0}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Quizzes: {p.completedAssessments?.length || 0}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-black text-blue-600">{p.totalProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.totalProgress}%` }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Progress;
