import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI, applicationsAPI } from '../../services/api';
import { HiBookOpen, HiClipboardCheck, HiUserGroup, HiPlus, HiArrowRight, HiLightningBolt, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ManagerDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, appsRes] = await Promise.all([
        coursesAPI.getManagerCourses(),
        applicationsAPI.getAll()
      ]);

      setCourses(coursesRes.data);
      setApplications(appsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (appId, status, reason = '') => {
    try {
      await applicationsAPI.review(appId, { status, rejectionReason: reason });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to review application:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingApplications = applications.filter(a => a.status === 'pending');
  const openVacancies = courses.filter(c => c.tutorVacancy?.isOpen);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Operations <span className="text-blue-600">Center</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-2">
            <HiLightningBolt className="text-amber-500" />
            Manage curriculum and tutor talent.
          </p>
        </div>
        <Link
          to="/courses"
          className="btn-premium"
        >
          <HiPlus className="h-5 w-5" />
          Create New Course
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Managed Courses', value: courses.length, icon: HiBookOpen, color: 'blue' },
          { label: 'Active Vacancies', value: openVacancies.length, icon: HiUserGroup, color: 'emerald' },
          { label: 'Pending Hires', value: pendingApplications.length, icon: HiClipboardCheck, color: 'amber' },
          { label: 'Total Enrolled', value: '1.2k', icon: HiUserGroup, color: 'violet' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="premium-card group hover:scale-[1.02]"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-7 w-7 text-${stat.color}-500`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tutor Applications */}
        <motion.div variants={itemVariants} className="lg:col-span-2 premium-card">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Talent Acquisition</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review tutor applications</p>
            </div>
            <Link to="/applications" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Review All</Link>
          </div>
          <div className="space-y-6">
            {pendingApplications.length > 0 ? pendingApplications.slice(0, 5).map((app) => (
              <div key={app._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                    {app.user?.firstName?.[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{app.user?.firstName} {app.user?.lastName}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applying for: {app.course?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleReviewApplication(app._id, 'approved')}
                    className="flex-1 md:flex-none py-2 px-6 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleReviewApplication(app._id, 'rejected', reason);
                    }}
                    className="flex-1 md:flex-none py-2 px-6 bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-400 font-bold">No applications to review</div>
            )}
          </div>
        </motion.div>

        {/* Current Vacancies */}
        <motion.div variants={itemVariants} className="premium-card">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Open Vacancies</h3>
          <div className="space-y-4">
            {openVacancies.length > 0 ? openVacancies.slice(0, 5).map((course) => (
              <div key={course._id} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between group">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{course.title}</h4>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Tutor Needed</p>
                </div>
                <Link to={`/courses/${course._id}`} className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-400 hover:text-blue-600 transition-colors">
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 font-bold">No open vacancies</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;
