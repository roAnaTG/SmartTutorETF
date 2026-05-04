import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 sm:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
          Enter your credentials to continue.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="name@company.com"
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Password
            </label>
            <a href="#" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700">
              Forgot?
            </a>
          </div>
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800/50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium"
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
              Sign In <HiArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          New here? {' '}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
