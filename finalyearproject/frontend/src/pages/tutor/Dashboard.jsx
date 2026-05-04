import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI, progressAPI, sessionsAPI } from '../../services/api';
import { 
  HiBookOpen, HiUsers, HiTrendingUp, HiPlus, HiCalendar, 
  HiLightningBolt, HiChevronRight, HiCollection, HiBriefcase,
  HiClipboardCheck, HiSparkles, HiClock, HiAcademicCap,
  HiPresentationChartLine, HiShieldCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

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
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* 🚀 SaaS Premium Hero */}
      <header className="relative p-12 rounded-[3.5rem] bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-blue-600/20 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Educator Hub v2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Manage Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital Academy.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto lg:mx-0">
              Track student progress, schedule live interactions, and expand your curriculum with our elite management suite.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => window.location.href = '/lessons'}
              className="py-5 px-10 rounded-[2rem]"
              icon={HiPlus}
            >
              NEW LESSON
            </Button>
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '/sessions'}
              className="py-5 px-10 rounded-[2rem] bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
              icon={HiCalendar}
            >
              LIVE SESSION
            </Button>
          </div>
        </div>
      </header>

      {/* 📊 High-Definition Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Cohorts', value: stats.totalCourses, icon: HiCollection, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Total Students', value: stats.totalStudents, icon: HiUsers, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Avg. Progress', value: `${stats.averageProgress}%`, icon: HiPresentationChartLine, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Active Weekly', value: stats.activeStudents, icon: HiShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((stat) => (
          <Card key={stat.label} padding="p-10">
            <div className="flex items-start justify-between mb-8">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <HiTrendingUp /> +12%
              </div>
            </div>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 📚 Curriculum Nexus */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end px-4">
            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Active Curriculum</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct management of assigned modules</p>
            </div>
            <Link to="/my-courses" className="btn-premium py-2 px-6 text-[10px] uppercase tracking-widest bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white shadow-none">
              Full Archive
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.length > 0 ? courses.map((course) => (
              <Card key={course._id} className="group cursor-pointer">
                <div className="flex justify-between items-start mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center text-2xl font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {course.title[0]}
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors truncate">{course.title}</h4>
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <HiUsers className="text-blue-500 h-4 w-4" /> {course.enrolledStudents?.length || 0} enrolled
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                    <HiAcademicCap className="text-indigo-500 h-4 w-4" /> {course.category}
                  </div>
                </div>
              </Card>
            )) : (
              <div className="col-span-full py-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl mb-6">
                  <HiBriefcase className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No active assignments found</p>
              </div>
            )}
          </div>
        </div>

        {/* ⚡ Pulse & Quick Hub */}
        <div className="lg:col-span-4 space-y-10">
          <Card padding="p-10" className="bg-slate-900 dark:bg-slate-950 border-0 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3 tracking-tight">
              <HiSparkles className="text-blue-500" /> Live Pulse
            </h3>
            
            <div className="space-y-8">
              {sessions.length > 0 ? sessions.map((session) => (
                <div key={session._id} className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-sm font-black text-white leading-none">{new Date(session.scheduledAt).getDate()}</span>
                    <span className="text-[8px] font-black uppercase text-blue-400 mt-1">{new Date(session.scheduledAt).toLocaleDateString([], { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate group-hover:text-blue-400 transition-colors leading-tight">{session.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{session.type} • {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <HiClock className="h-8 w-8 text-slate-700" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No events today</p>
                </div>
              )}
            </div>
            
            <Link to="/sessions" className="mt-12 block w-full py-4 bg-blue-600 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
              CALENDAR VIEW
            </Link>
          </Card>

          <div className="grid grid-cols-2 gap-4">
             <Link to="/assessments" className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:shadow-2xl transition-all group shadow-sm">
                <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <HiClipboardCheck className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase tracking-widest text-center">Build<br/>Quiz</span>
             </Link>
             <Link to="/groups" className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:shadow-2xl transition-all group shadow-sm">
                <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <HiUsers className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase tracking-widest text-center">Manage<br/>Cohorts</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
