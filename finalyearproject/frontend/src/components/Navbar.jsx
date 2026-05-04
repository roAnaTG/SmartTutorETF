import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsAPI } from '../services/api';
import { HiBell, HiMoon, HiSun, HiMenu, HiSearch } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <header className="glass dark:bg-slate-900/50 sticky top-4 z-40 mx-4 mt-4 rounded-3xl border-0 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all">
      <div className="px-6 sm:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={onMenuClick}
              className="p-3 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              <HiMenu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center gap-2 text-slate-400 font-medium">
              <HiSun className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em] font-black">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white hidden sm:block ml-8">
              Hello, {user?.firstName} 👋
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center relative group">
              <HiSearch className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl w-48 lg:w-64 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              />
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
            >
              {darkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
            </button>

            <a
              href="/notifications"
              className="relative p-3 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all"
            >
              <HiBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 inline-flex items-center justify-center h-5 w-5 text-[10px] font-black text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </a>

            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden lg:block">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-none">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  {user?.role}
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-slate-900 flex items-center justify-center">
                  <span className="text-xs font-black text-blue-600 uppercase">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
