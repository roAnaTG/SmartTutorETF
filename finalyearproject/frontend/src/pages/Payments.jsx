import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiCreditCard, HiCheckCircle, HiXCircle, HiClock, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';
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

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = user?.role === 'student' 
        ? await paymentsAPI.getMyPayments()
        : await paymentsAPI.getAll();
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status, reason = '') => {
    try {
      await paymentsAPI.review(id, { status, rejectionReason: reason });
      toast.success(`Payment ${status}`);
      fetchPayments();
    } catch (error) {
      toast.error('Failed to review payment');
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {user?.role === 'admin' ? 'Transaction Management' : 'Payment History'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage all financial records.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass rounded-[2.5rem] border-0 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Course / Service</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                {user?.role === 'admin' && (
                  <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode='popLayout'>
                {payments.map((payment) => (
                  <motion.tr 
                    key={payment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <HiCreditCard className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {payment.course?.title || 'Unknown Course'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                        <HiCurrencyDollar className="text-slate-400" />
                        {payment.amount}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        payment.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                        payment.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-rose-500/10 text-rose-600'
                      }`}>
                        {payment.status === 'approved' && <HiCheckCircle className="h-3 w-3" />}
                        {payment.status === 'pending' && <HiClock className="h-3 w-3" />}
                        {payment.status === 'rejected' && <HiXCircle className="h-3 w-3" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <HiCalendar className="h-4 w-4" />
                        {new Date(payment.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-8 py-6 text-center">
                        {payment.status === 'pending' ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleReview(payment._id, 'approved')}
                              className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                              title="Approve"
                            >
                              <HiCheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) handleReview(payment._id, 'rejected', reason);
                              }}
                              className="p-2 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                              title="Reject"
                            >
                              <HiXCircle className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No actions</span>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {payments.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <HiCreditCard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-slate-500">No transactions found</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Payments;
