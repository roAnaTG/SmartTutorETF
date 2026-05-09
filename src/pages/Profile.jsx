import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { HiUser, HiPhone, HiPencil, HiMail, HiSave, HiCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

const Profile = () => {
  const { user, updateProfile, updateUserLocal } = useAuth();
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await authAPI.uploadAvatar(formData);
      updateUserLocal(response.data);
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="card p-6 sm:p-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-border">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-accent/10 flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={`http://localhost:5000${user.avatar}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-accent">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-2 bg-card border border-border rounded-xl shadow-sm hover:bg-muted cursor-pointer transition-colors">
              <HiCamera className="h-4 w-4 text-muted-foreground" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-semibold text-foreground">
                {user?.firstName} {user?.lastName}
              </h2>
              <span className="badge-primary capitalize">
                {user?.role}
              </span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center justify-center sm:justify-start gap-2">
              <HiMail className="h-4 w-4" /> {user?.email}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                First Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input pl-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Last Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input pl-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="input pl-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Bio
            </label>
            <div className="relative">
              <HiPencil className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="input pl-12 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <HiSave className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
