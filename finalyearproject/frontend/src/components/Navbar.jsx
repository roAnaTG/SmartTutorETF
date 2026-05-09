import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsAPI } from '../services/api';
import { HiBell, HiMoon, HiSun, HiMenu, HiSearch } from 'react-icons/hi';

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
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <HiMenu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search courses, lessons..."
                className="input pl-10 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
          </button>

          <Link
            to="/notifications"
            className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <HiBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-accent-foreground bg-accent rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <div className="hidden sm:block w-px h-6 bg-border mx-1" />

          <Link to="/profile" className="flex items-center gap-3 p-1.5 hover:bg-muted rounded-xl transition-colors">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-foreground leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {user?.role}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-accent">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
