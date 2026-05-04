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
  HiChevronRight
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    // ... existing logic ...
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

  return (
    <AnimatePresence>
      {(isOpen || window.innerWidth >= 1024) && (
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-4 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="flex flex-col flex-grow glass dark:bg-slate-900/80 rounded-[2.5rem] border-0 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="px-8 pt-10 pb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <HiAcademicCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                  SmartTutor<span className="text-blue-600">ET</span>
                </h1>
              </div>
              <button onClick={onClose} className="p-2 lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <HiChevronRight className="h-6 w-6 rotate-180" />
              </button>
            </div>
            
            <div className="mt-6 flex-1 flex flex-col px-4 overflow-y-auto custom-scrollbar">
              <nav className="flex-1 space-y-2 pb-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={({ isActive }) =>
                      `group relative flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`} />
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeTab"
                            className="absolute right-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <HiChevronRight className="h-4 w-4" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="p-4 mt-auto">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black text-rose-600 bg-rose-500/10 hover:bg-rose-600 hover:text-white rounded-xl transition-all uppercase tracking-widest"
                >
                  <HiLogout className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
