import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiPlus, HiPlay, HiDocumentText, HiClock, HiCheckCircle, HiX, HiChevronRight, HiAcademicCap, HiTrash } from 'react-icons/hi';
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

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    videoUrl: '',
    duration: 60,
    week: 1,
    isPublished: true
  });

  useEffect(() => {
    fetchLessons();
    if (user?.role === 'tutor') fetchTutorCourses();
  }, [user]);

  const fetchLessons = async () => {
    try {
      const response = await lessonsAPI.getAll();
      setLessons(response.data);
    } catch (error) {
      toast.error('Failed to fetch lessons');
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
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonsAPI.delete(id);
      toast.success('Lesson deleted successfully');
      fetchLessons();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lessonsAPI.create(formData);
      toast.success('Lesson created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        course: '',
        videoUrl: '',
        duration: 60,
        week: 1,
        isPublished: true
      });
      fetchLessons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Learning Materials</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Access and manage all course lessons and resources.</p>
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
            New Lesson
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessons.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2">
            <HiDocumentText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No lessons available yet.</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <motion.div
              key={lesson._id}
              variants={itemVariants}
              className="group glass p-6 rounded-3xl border-0 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <HiPlay className="h-8 w-8" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {lesson.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    lesson.isPublished 
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {lesson.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-4">
                  <span className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-slate-400">
                    <HiAcademicCap className="h-4 w-4" /> Week {lesson.week}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-slate-400">
                    <HiClock className="h-4 w-4" /> {lesson.duration} mins
                  </span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-1">{lesson.description}</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {lesson.videoUrl && (
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all text-center"
                  >
                    View Lesson
                  </a>
                )}
                {user?.role === 'tutor' && (
                  <button
                    onClick={() => handleDelete(lesson._id)}
                    className="p-3 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    title="Delete Lesson"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
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
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Lesson</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <HiX className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lesson Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g. Introduction to Calculus"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Course</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Duration (mins)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Week</label>
                    <input
                      type="number"
                      value={formData.week}
                      onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Video URL</label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                      placeholder="YouTube/Vimeo link"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-slate-600 dark:text-slate-400">Publish immediately</label>
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 mt-4 transition-all">
                  Create Lesson
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Lessons;
