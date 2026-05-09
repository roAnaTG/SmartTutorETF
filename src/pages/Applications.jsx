import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiDocumentText, HiCheckCircle, HiXCircle, HiClock, HiCalendar, HiUser } from 'react-icons/hi';
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

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status, reason = '') => {
    try {
      await applicationsAPI.review(id, { status, rejectionReason: reason });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to review application');
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {user?.role === 'manager' ? 'Faculty Admissions' : 'My Applications'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {user?.role === 'manager' 
            ? 'Review and approve upcoming tutor applications.' 
            : 'Track the status of your submitted applications.'}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Focus</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {user?.role === 'manager' ? 'Applicant' : 'Current Status'}
                </th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</th>
                {user?.role === 'manager' && (
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode='popLayout'>
                {applications.map((app) => (
                  <motion.tr 
                    key={app._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                          <HiDocumentText className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {app.course?.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {user?.role === 'manager' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {app.tutor?.firstName?.[0]}{app.tutor?.lastName?.[0]}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {app.tutor?.firstName} {app.tutor?.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          app.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                          app.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-rose-500/10 text-rose-600'
                        }`}>
                          {app.status === 'approved' && <HiCheckCircle className="h-3 w-3" />}
                          {app.status === 'pending' && <HiClock className="h-3 w-3" />}
                          {app.status === 'rejected' && <HiXCircle className="h-3 w-3" />}
                          {app.status}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <HiCalendar className="h-4 w-4" />
                        {new Date(app.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    {user?.role === 'manager' && (
                      <td className="px-8 py-6 text-center">
                        {app.status === 'pending' ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleReview(app._id, 'approved')}
                              className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) handleReview(app._id, 'rejected', reason);
                              }}
                              className="px-4 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            app.status === 'approved' ? 'text-emerald-600 bg-emerald-500/5' : 'text-rose-600 bg-rose-500/5'
                          }`}>
                            {app.status}
                          </span>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {applications.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <HiDocumentText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-slate-500">No applications found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Applications;
