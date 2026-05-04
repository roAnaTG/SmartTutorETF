import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiAcademicCap, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Account created! Welcome to the community.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
          Join thousands of learners and educators worldwide.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              First Name
            </label>
            <div className="relative group">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Last Name
            </label>
            <div className="relative group">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Email Address
          </label>
          <div className="relative group">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Phone (Optional)
            </label>
            <div className="relative group">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+123..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Role
            </label>
            <div className="relative group">
              <HiAcademicCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all appearance-none font-medium"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Password
          </label>
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <HiArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center pb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Already a member? {' '}
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
