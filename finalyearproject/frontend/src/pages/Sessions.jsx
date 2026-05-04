import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiCalendar, HiClock, HiVideoCamera, HiPlus, HiX, HiChevronRight, HiUsers, HiLink, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

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

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    scheduledAt: '',
    duration: 60,
    type: 'live',
    meetingLink: ''
  });

  useEffect(() => {
    fetchSessions();
    if (user?.role === 'tutor') fetchTutorCourses();
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

  const fetchTutorCourses = async () => {
    try {
      const response = await coursesAPI.getTutorCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch tutor courses');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await sessionsAPI.delete(id);
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await sessionsAPI.create(formData);
      toast.success('Session scheduled successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        course: '',
        scheduledAt: '',
        duration: 60,
        type: 'live',
        meetingLink: ''
      });
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule session');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Interactive Sessions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Join live classes and collaborative workshops.</p>
        </motion.div>
        {user?.role === 'tutor' && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <HiPlus className="h-5 w-5 mr-2" />
            Schedule Session
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.length === 0 ? (
          <div className="col-span-full text-center py-20 glass rounded-[2.5rem] border-dashed border-2">
            <HiCalendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">No upcoming sessions found.</p>
            <p className="text-slate-400 text-sm mt-1">Check back later or schedule one if you're a tutor.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <motion.div
              key={session._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass p-6 rounded-[2rem] border-0 shadow-sm flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${
                  session.type === 'live' 
                    ? 'bg-blue-500/10 text-blue-600'
                    : 'bg-purple-500/10 text-purple-600'
                }`}>
                  <HiVideoCamera className="h-6 w-6" />
                </div>
                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  session.type === 'live' 
                    ? 'bg-blue-500/10 text-blue-600'
                    : 'bg-purple-500/10 text-purple-600'
                }`}>
                  {session.type}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                {session.title}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <HiCalendar className="text-blue-500" /> {new Date(session.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                <span className="mx-2 text-slate-300">|</span>
                <HiClock className="text-blue-500" /> {new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>

              <div className="mt-auto space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Course</span>
                  <span className="text-slate-900 dark:text-white font-bold">{session.course?.title}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-slate-900 dark:text-white font-bold">{session.duration} min</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoin(session._id)}
                    className="flex-1 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all text-sm shadow-lg shadow-slate-900/10"
                  >
                    Join Session
                  </button>
                  {user?.role === 'tutor' && (
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      title="Delete Session"
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Schedule Session</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <HiX className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleCreateSession} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Session Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g. Q&A Workshop"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Course</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="live">Live Class</option>
                      <option value="workshop">Workshop</option>
                      <option value="office-hours">Office Hours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Schedule At</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Duration (min)</label>
                    <input
                      required
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Meeting Link</label>
                  <input
                    required
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="Zoom / Google Meet link"
                  />
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-[1.5rem] hover:bg-blue-700 shadow-xl shadow-blue-500/20 mt-4 transition-all">
                  Schedule Now
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sessions;
