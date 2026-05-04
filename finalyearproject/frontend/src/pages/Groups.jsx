import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiUserGroup, HiPlus, HiX, HiChevronRight, HiUsers, HiBookOpen, HiAnnotation, HiTrash } from 'react-icons/hi';
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

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course: '',
    maxMembers: 10
  });

  useEffect(() => {
    fetchGroups();
    if (user?.role !== 'student') fetchCourses();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const response = await groupsAPI.getAll();
      setGroups(response.data);
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getTutorCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch tutor courses');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
      await groupsAPI.delete(id);
      toast.success('Group deleted successfully');
      fetchGroups();
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await groupsAPI.create(formData);
      toast.success('Study group created successfully!');
      setShowModal(false);
      setFormData({ name: '', description: '', course: '', maxMembers: 10 });
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group');
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Study Communities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Collaborate with peers in specialized study groups.</p>
        </motion.div>
        {user?.role !== 'student' && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <HiPlus className="h-5 w-5 mr-2" />
            Create Group
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.length === 0 ? (
          <div className="col-span-full text-center py-20 glass rounded-[2.5rem] border-dashed border-2">
            <HiUserGroup className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No active groups found.</p>
          </div>
        ) : (
          groups.map((group) => (
            <motion.div
              key={group._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-0 shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <HiUserGroup className="h-7 w-7" />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Capacity</span>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {group.students?.length || 0} / {group.maxMembers}
                   </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{group.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6">
                {group.description}
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <HiBookOpen className="text-blue-500" /> {group.course?.title}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                  <div className="flex -space-x-2">
                    {group.students?.slice(0, 4).map((student, i) => (
                      <div
                        key={i}
                        className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300"
                        title={`${student.firstName} ${student.lastName}`}
                      >
                        {student.firstName?.[0]}{student.lastName?.[0]}
                      </div>
                    ))}
                    {group.students?.length > 4 && (
                      <div className="h-9 w-9 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                        +{group.students.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {user?.role !== 'student' && (
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="p-3 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Delete Group"
                      >
                        <HiTrash className="h-5 w-5" />
                      </button>
                    )}
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <HiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
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
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create Study Group</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  <HiX className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleCreateGroup} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Group Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="e.g. Advanced Calculus Study Cohort"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Associated Course</label>
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
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Max Members</label>
                    <input
                      required
                      type="number"
                      value={formData.maxMembers}
                      onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="Describe the goal of this study group..."
                  />
                </div>

                <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-[1.5rem] hover:bg-blue-700 shadow-xl shadow-blue-500/20 mt-4 transition-all">
                  Create Community
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Groups;
