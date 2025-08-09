import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  ChartPieIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

/**
 * Sidebar component with responsive design and theme support
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open on mobile
 * @param {Function} props.setIsOpen - Function to set sidebar open state
 * @param {string} props.theme - Current theme (light/dark)
 */
const Sidebar = ({ isOpen, setIsOpen, theme = 'light' }) => {
  const { currentUser, logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Calculator', to: '/calculator', icon: CalculatorIcon },
    { name: 'Schedule', to: '/schedule', icon: DocumentTextIcon },
    { name: 'Reports', to: '/reports', icon: ChartPieIcon },
  ];

  const accountMenu = [
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    { name: 'Profile', to: '/profile', icon: UserCircleIcon },
    { name: 'Account', to: '/account', icon: ShieldCheckIcon },
  ];

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Active link style - based on theme
  const getActiveClassName = (isActive) => {
    if (isActive) {
      return theme === 'dark' 
        ? 'bg-blue-800 text-white' 
        : 'bg-blue-600 text-white';
    } else {
      return theme === 'dark'
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white';
    }
  };
  
  // Get the sidebar background color based on theme
  const getSidebarBgColor = () => {
    return theme === 'dark' ? 'bg-gray-900' : 'bg-primary';
  };

  // Get border colors based on theme
  const getBorderColor = () => {
    return theme === 'dark' ? 'border-gray-700' : 'border-blue-700';
  };
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={closeMobileMenu}></div>
          <div className={`relative flex-1 flex flex-col max-w-xs w-full transition-all transform duration-300 ease-in-out ${getSidebarBgColor()}`}>
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={closeMobileMenu}
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) => 
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${getActiveClassName(isActive)}`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
                
                <div className={`pt-4 mt-4 border-t ${getBorderColor()}`}>
                  <p className={`px-3 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-blue-300'} uppercase tracking-wider`}>
                    Account
                  </p>
                  {accountMenu.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className={({ isActive }) => 
                        `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${getActiveClassName(isActive)}`
                      }
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </div>
            <div className={`flex-shrink-0 p-4 border-t ${getBorderColor()}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-200'} flex items-center justify-center`}>
                    <UserCircleIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-blue-600'}`} />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{currentUser?.displayName || 'User'}</p>
                </div>
                <button
                  onClick={logout}
                  className={`ml-auto p-1 rounded-full ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-5 lg:pb-4 lg:overflow-y-auto transition-colors duration-300 ${getSidebarBgColor()}`}>
        <div className="flex items-center px-6 mb-8">
          <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
        </div>
        <nav className="mt-5 flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => 
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${getActiveClassName(isActive)}`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}

          <div className={`pt-4 mt-4 border-t ${getBorderColor()}`}>
            <p className={`px-3 text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-blue-300'} uppercase tracking-wider`}>
              Account
            </p>
            {accountMenu.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => 
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${getActiveClassName(isActive)}`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className={`flex-shrink-0 p-4 border-t ${getBorderColor()}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-200'} flex items-center justify-center`}>
                <UserCircleIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser?.displayName || 'User'}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-blue-200'}`}>Premium Account</p>
            </div>
            <button
              onClick={logout}
              className={`ml-auto p-1 rounded-full ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
              title="Sign out"
              aria-label="Sign out"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;