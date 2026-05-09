import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
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
import { HiBookOpen, HiAcademicCap, HiClock, HiTrendingUp, HiArrowRight, HiPlay } from 'react-icons/hi';

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
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

const StudentDashboard = () => {
  const { user } = useAuth();
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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Hours',
        data: [1.5, 2.3, 1.8, 3.5, 2.0, 4.2, 3.0],
        borderColor: 'hsl(221, 83%, 53%)',
        backgroundColor: 'hsla(221, 83%, 53%, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'hsl(221, 83%, 53%)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: 'hsl(222, 47%, 11%)',
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'hsla(214, 32%, 91%, 0.5)', drawBorder: false },
        ticks: { 
          font: { size: 12, weight: '500' },
          color: 'hsl(215, 16%, 47%)',
          padding: 8,
        },
        border: { display: false }
      },
      x: { 
        grid: { display: false },
        ticks: { 
          font: { size: 12, weight: '500' },
          color: 'hsl(215, 16%, 47%)',
          padding: 8,
        },
        border: { display: false }
      }
    }
  };

  const statCards = [
    { label: 'Active Courses', value: stats?.activeCourses || 0, icon: HiBookOpen, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Completed', value: stats?.completedCourses || 0, icon: HiAcademicCap, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Study Hours', value: '24.5h', icon: HiClock, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
    { label: 'Progress', value: '92%', icon: HiTrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress and continue where you left off.
          </p>
        </div>
        <Link to="/courses" className="btn-primary">
          Explore Courses
          <HiArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Learning Activity</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Your weekly study hours</p>
            </div>
            <select className="input py-2 px-3 text-sm w-auto">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-[280px]">
            <Line data={progressData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Continue Learning */}
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-foreground">Continue Learning</h3>
            <Link to="/my-courses" className="text-sm font-medium text-accent hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentCourses.length > 0 ? recentCourses.map((course) => (
              <Link 
                key={course._id} 
                to={`/courses/${course._id}`}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent/10">
                      <HiBookOpen className="h-5 w-5 text-accent" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">45%</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiPlay className="h-4 w-4 text-accent" />
                </div>
              </Link>
            )) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <HiBookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No courses yet</p>
                <Link to="/courses" className="text-sm font-medium text-accent hover:underline mt-1 inline-block">
                  Browse courses
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Payments */}
      {payments.length > 0 && (
        <motion.div variants={itemVariants} className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
            <Link to="/payments" className="text-sm font-medium text-accent hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Course</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-foreground">{payment.course?.title || 'Course'}</td>
                    <td className="py-4 text-sm text-foreground">${payment.amount}</td>
                    <td className="py-4 text-sm text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`badge ${payment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentDashboard;
