import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiPhone, HiIdentification, HiMail, HiSaveAs, HiCamera } from 'react-icons/hi';
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

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and preferences.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass p-8 rounded-[2.5rem] border-0 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
          <div className="relative group">
            <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
              <span className="text-4xl font-black">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 transition-transform">
              <HiCamera className="h-5 w-5 text-blue-600" />
            </button>
          </div>
          
          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {user?.role}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 font-medium">
              <HiMail className="h-4 w-4" /> {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                First Name
              </label>
              <div className="relative group">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Last Name
              </label>
              <div className="relative group">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Phone Number
            </label>
            <div className="relative group">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Professional Bio
            </label>
            <div className="relative group">
              <HiIdentification className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all font-medium resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/25 disabled:opacity-50 transition-all ml-auto"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <HiSaveAs className="h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
