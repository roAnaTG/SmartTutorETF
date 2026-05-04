import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI, progressAPI, paymentsAPI } from '../../services/api';
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
import { HiBookOpen, HiAcademicCap, HiClock, HiTrendingUp, HiChevronRight, HiLightningBolt } from 'react-icons/hi';

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

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, coursesRes, paymentsRes] = await Promise.all([
        progressAPI.getStudentStats(),
        coursesAPI.getStudentCourses(),
        paymentsAPI.getMyPayments()
      ]);

      setStats(statsRes.data);
      setRecentCourses(coursesRes.data.slice(0, 3));
      setPayments(paymentsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const progressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Hours',
        data: [1.5, 2.3, 1.8, 3.5, 2.0, 4.2, 3.0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Learning <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <HiLightningBolt className="text-amber-500" />
            Keep up the great work! You've completed 85% of your weekly goal.
          </p>
        </div>
        <Link 
          to="/courses" 
          className="btn-premium"
        >
          Explore New Courses
          <HiChevronRight className="h-5 w-5" />
        </Link>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Courses', value: stats?.activeCourses || 0, icon: HiBookOpen, color: 'blue' },
          { label: 'Completed', value: stats?.completedCourses || 0, icon: HiAcademicCap, color: 'emerald' },
          { label: 'Study Hours', value: '24.5h', icon: HiClock, color: 'violet' },
          { label: 'Knowledge Score', value: '92%', icon: HiTrendingUp, color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="premium-card group hover:scale-[1.02]">
            <div className={`w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-7 w-7 text-blue-500`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="h-20 w-20 rotate-12" />
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 premium-card">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Activity Pulse</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Learning Intensity</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <Line data={progressData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { weight: 'bold' } } },
                x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
              }
            }} />
          </div>
        </motion.div>

        {/* Recent Courses */}
        <motion.div variants={itemVariants} className="premium-card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Jump Back In</h3>
            <Link to="/my-courses" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">View All</Link>
          </div>
          <div className="space-y-4">
            {recentCourses.length > 0 ? recentCourses.map((course) => (
              <Link 
                key={course._id} 
                to={`/courses/${course._id}`}
                className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm hover:shadow-md group"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200">
                  <img src={course.thumbnail || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{course.title}</h4>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-bold">No courses yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
