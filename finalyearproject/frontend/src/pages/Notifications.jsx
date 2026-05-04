import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationsAPI } from '../services/api';
import { HiBell, HiCheckCircle, HiTrash, HiOutlineInbox, HiLightningBolt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Assuming a delete endpoint exists or we just hide it
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification dismissed');
    } catch (error) {
      toast.error('Failed to delete notification');
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
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Notification <span className="text-blue-600">Center</span></h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-2">
            <HiLightningBolt className="text-amber-500" />
            Stay updated with platform activities.
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="btn-premium py-3 px-6 text-xs uppercase tracking-widest font-black"
        >
          <HiCheckCircle className="h-5 w-5" /> Mark all as read
        </button>
      </header>

      <div className="max-w-4xl space-y-4">
        {notifications.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-32 premium-card border-dashed border-2 flex flex-col items-center justify-center"
          >
            <HiOutlineInbox className="h-20 w-20 text-slate-200 mb-6" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">All caught up!</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">No new notifications at the moment.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                variants={itemVariants}
                exit={{ opacity: 0, x: 50 }}
                layout
                className={`premium-card p-6 border-0 group relative ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex gap-6">
                  <div className={`p-4 rounded-2xl shrink-0 ${
                    !notification.isRead ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <HiBell className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-bold ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
