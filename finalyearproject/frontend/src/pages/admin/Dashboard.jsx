import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paymentsAPI } from '../../services/api';
import { HiCreditCard, HiCheckCircle, HiXCircle, HiClock, HiCurrencyDollar, HiArrowRight, HiLightningBolt, HiTrendingUp } from 'react-icons/hi';

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

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentsAPI.getAll();
      const allPayments = response.data;
      setPayments(allPayments);

      setStats({
        total: allPayments.length,
        pending: allPayments.filter(p => p.status === 'pending').length,
        approved: allPayments.filter(p => p.status === 'approved').length,
        rejected: allPayments.filter(p => p.status === 'rejected').length
      });
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (paymentId, status, reason = '') => {
    try {
      await paymentsAPI.review(paymentId, { status, rejectionReason: reason });
      fetchPayments();
    } catch (error) {
      console.error('Failed to review payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingPayments = payments.filter(p => p.status === 'pending');

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System <span className="text-blue-600">Console</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-2">
            <HiLightningBolt className="text-amber-500" />
            Platform overview and financial oversight.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: stats.total, icon: HiCreditCard, color: 'blue' },
          { label: 'Pending Review', value: stats.pending, icon: HiClock, color: 'amber' },
          { label: 'Approved', value: stats.approved, icon: HiCheckCircle, color: 'emerald' },
          { label: 'Rejected', value: stats.rejected, icon: HiXCircle, color: 'rose' }
        ].map((stat) => (
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
        {/* Pending Payments Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 premium-card">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Transaction Queue</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending approval requests</p>
            </div>
            <Link to="/payments" className="btn-premium py-2 px-6 text-xs">Full Ledger</Link>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-4 px-4">Entity</th>
                  <th className="pb-4 px-4">Amount</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {pendingPayments.length > 0 ? pendingPayments.slice(0, 5).map((payment) => (
                  <tr key={payment._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                          {payment.course?.title?.[0] || 'P'}
                        </div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{payment.course?.title || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4 font-black text-slate-900 dark:text-white">${payment.amount}</td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Pending</span>
                    </td>
                    <td className="py-6 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleReview(payment._id, 'approved')}
                          className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                        >
                          <HiCheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => {
                            const reason = prompt('Rejection reason:');
                            if (reason) handleReview(payment._id, 'rejected', reason);
                          }}
                          className="p-2 bg-rose-500/10 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                        >
                          <HiXCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-slate-400 font-bold">No pending transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Activity */}
        <motion.div variants={itemVariants} className="premium-card">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Revenue Stream</h3>
          <div className="space-y-6">
            {[
              { label: 'Weekly Revenue', value: '$12,450', growth: '+12.5%', color: 'blue' },
              { label: 'New Students', value: '142', growth: '+8.2%', color: 'emerald' },
              { label: 'Active Sessions', value: '45', growth: '+4.1%', color: 'amber' }
            ].map((metric, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <HiTrendingUp className="h-3 w-3" />
                    {metric.growth}
                  </span>
                </div>
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{metric.value}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
