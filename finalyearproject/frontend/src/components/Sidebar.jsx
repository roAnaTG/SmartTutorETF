import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  HiLogout
} from 'react-icons/hi';

const Sidebar = () => {
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

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-2xl font-bold text-primary-600">SmartTutorET</h1>
        </div>
        
        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-600">
                <span className="text-sm font-medium text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Logout"
              >
                <HiLogout className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
