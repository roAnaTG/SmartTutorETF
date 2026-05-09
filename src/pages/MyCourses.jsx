import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiAcademicCap, HiSearch, HiCollection, HiChevronRight, HiLightningBolt } from 'react-icons/hi';
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

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getStudentCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Learning Journey</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Pick up right where you left off.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-2">
          <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <HiSearch /> Explore More
          </Link>
        </motion.div>
      </div>

      {courses.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="text-center py-24 glass rounded-[2.5rem] border-dashed border-2"
        >
          <HiCollection className="h-20 w-20 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your library is empty</h2>
          <p className="text-slate-500 mt-2 mb-8">Start your first course today and build your future.</p>
          <Link to="/courses" className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-transform inline-block">
            Browse Catalog
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div 
              key={course._id} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass rounded-[2.5rem] overflow-hidden border-0 shadow-sm flex flex-col group"
            >
              <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 mix-blend-overlay" />
                <HiAcademicCap className="text-slate-700/50 h-32 w-32 absolute -bottom-8 -right-8 rotate-12" />
                <span className="text-white text-6xl font-black relative z-10 drop-shadow-2xl">
                  {course.title[0]}
                </span>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                      <HiLightningBolt className="text-amber-500" /> Current Progress
                    </div>
                    <span className="text-sm font-black text-blue-600">0%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '0%' }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                  <Link
                    to={`/courses/${course._id}`}
                    className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-50 transition-all text-sm flex items-center justify-center gap-2 group"
                  >
                    Continue Learning
                    <HiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyCourses;
