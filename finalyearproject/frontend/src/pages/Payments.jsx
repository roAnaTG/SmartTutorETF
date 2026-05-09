import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiCreditCard, HiCheckCircle, HiXCircle, HiClock, HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge-success flex items-center gap-1.5">
            <HiCheckCircle className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="badge-warning flex items-center gap-1.5">
            <HiClock className="h-3.5 w-3.5" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="badge bg-destructive/10 text-destructive flex items-center gap-1.5">
            <HiXCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return <span className="badge-muted">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {user?.role === 'admin' ? 'Payment Management' : 'Payment History'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'admin' ? 'Review and manage payment transactions' : 'View your payment history'}
        </p>
      </motion.div>

      {/* Payments Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <HiCreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No transactions</h3>
            <p className="text-muted-foreground mt-1">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  {user?.role === 'admin' && (
                    <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {payments.map((payment) => (
                    <motion.tr 
                      key={payment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                            <HiCreditCard className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-foreground truncate max-w-[200px]">
                            {payment.course?.title || 'Course'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">
                          ${payment.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HiCalendar className="h-4 w-4" />
                          {new Date(payment.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}
                        </div>
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4">
                          {payment.status === 'pending' ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleReview(payment._id, 'approved')}
                                className="p-2 bg-success/10 text-success rounded-lg hover:bg-success hover:text-success-foreground transition-colors"
                                title="Approve"
                              >
                                <HiCheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason:');
                                  if (reason) handleReview(payment._id, 'rejected', reason);
                                }}
                                className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                title="Reject"
                              >
                                <HiXCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Payments;
