import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, 
  HiBookOpen, 
  HiAcademicCap, 
  HiUserGroup, 
  HiClipboardCheck,
  HiCreditCard,
  HiBell,
  HiDocumentText,
  HiChartBar,
  HiUsers,
  HiLogout,
  HiX
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', path: '/dashboard', icon: HiHome },
      { name: 'Courses', path: '/courses', icon: HiBookOpen },
      { name: 'Notifications', path: '/notifications', icon: HiBell },
      { name: 'Profile', path: '/profile', icon: HiUsers }
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...commonItems,
          { name: 'My Courses', path: '/my-courses', icon: HiAcademicCap },
          { name: 'Sessions', path: '/sessions', icon: HiUserGroup },
          { name: 'Groups', path: '/groups', icon: HiUserGroup },
          { name: 'Assessments', path: '/assessments', icon: HiClipboardCheck },
          { name: 'Progress', path: '/progress', icon: HiChartBar },
          { name: 'Payments', path: '/payments', icon: HiCreditCard }
        ];
      case 'tutor':
        return [
          ...commonItems,
          { name: 'My Courses', path: '/my-courses', icon: HiAcademicCap },
          { name: 'Lessons', path: '/lessons', icon: HiDocumentText },
          { name: 'Sessions', path: '/sessions', icon: HiUserGroup },
          { name: 'Groups', path: '/groups', icon: HiUserGroup },
          { name: 'Assessments', path: '/assessments', icon: HiClipboardCheck },
          { name: 'Applications', path: '/applications', icon: HiDocumentText }
        ];
      case 'admin':
        return [
          ...commonItems,
          { name: 'Payments', path: '/payments', icon: HiCreditCard }
        ];
      case 'manager':
        return [
          ...commonItems,
          { name: 'Applications', path: '/applications', icon: HiDocumentText }
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <HiAcademicCap className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            SmartTutor
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <HiX className="h-5 w-5" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'
                } transition-colors`} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-accent">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground rounded-xl transition-all duration-200"
        >
          <HiLogout className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[280px] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
