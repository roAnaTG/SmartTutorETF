import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { coursesAPI, progressAPI, sessionsAPI } from '../../services/api';
import { 
  HiBookOpen, HiUsers, HiTrendingUp, HiPlus, HiCalendar, 
  HiLightningBolt, HiChevronRight, HiCollection, HiBriefcase,
  HiClipboardCheck, HiSparkles, HiClock
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const TutorDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageProgress: 0,
    activeStudents: 0
  });
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, coursesRes, sessionsRes] = await Promise.allSettled([
          progressAPI.getTutorStats(),
          coursesAPI.getTutorCourses(),
          sessionsAPI.getAll({ upcoming: 'true' })
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data || stats);
        if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value?.data || []);
        if (sessionsRes.status === 'fulfilled') setSessions(Array.isArray(sessionsRes.value?.data) ? sessionsRes.value.data.slice(0, 3) : []);
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Partial data load');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Command Center...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* 🌌 Cyber-Glass Header */}
      <header className="relative p-10 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">System Active</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              Control <span className="text-blue-500">Panel</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl">
              Precision metrics and academic management for the digital frontier.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/lessons" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3 group">
              <HiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              CREATE MODULE
            </Link>
          </div>
        </div>
      </header>

      {/* 📊 High-Definition Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Cohorts', value: stats.totalCourses, icon: HiCollection },
          { label: 'Student Reach', value: stats.totalStudents, icon: HiUsers },
          { label: 'Engagement Index', value: `${stats.averageProgress}%`, icon: HiTrendingUp },
          { label: 'Retained Activity', value: stats.activeStudents, icon: HiLightningBolt }
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 📚 Curriculum Nexus */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Curriculum <span className="text-blue-600">Nexus</span></h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live management of assigned courses</p>
            </div>
            <Link to="/my-courses" className="text-xs font-black text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              FULL ARCHIVE <HiChevronRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.length > 0 ? courses.map((course) => (
              <div key={course._id} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-600 group transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center text-xl font-black text-blue-600 group-hover:scale-110 transition-transform">
                    {course.title[0]}
                  </div>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-white mb-2 truncate">{course.title}</h4>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 group-hover:text-white/60 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><HiUsers /> {course.enrolledStudents?.length || 0} enrolled</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <HiBriefcase className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active assignments found</p>
              </div>
            )}
          </div>
        </div>

        {/* ⚡ Quick Pulse Feed */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex-1">
            <h3 className="text-xl font-black mb-10 flex items-center gap-3">
              <HiSparkles className="text-blue-500" /> Pulse <span className="text-blue-500">Feed</span>
            </h3>
            
            <div className="space-y-6">
              {sessions.length > 0 ? sessions.map((session) => (
                <div key={session._id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-black">{new Date(session.scheduledAt).getDate()}</span>
                    <span className="text-[7px] font-black uppercase">{new Date(session.scheduledAt).toLocaleDateString([], { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black truncate group-hover:text-blue-400 transition-colors">{session.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{session.type}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-40">
                  <HiClock className="h-10 w-10 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Quiet on the front</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-2 gap-4">
             <Link to="/assessments" className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-blue-600 group transition-all">
                <HiClipboardCheck className="h-6 w-6 text-blue-600 group-hover:text-white" />
                <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest text-center">Build Quiz</span>
             </Link>
             <Link to="/groups" className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-indigo-600 group transition-all">
                <HiUsers className="h-6 w-6 text-indigo-600 group-hover:text-white" />
                <span className="text-[9px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest text-center">Cohorts</span>
             </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorDashboard;
