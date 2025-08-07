import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  ChartPieIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Calculator', to: '/calculator', icon: CalculatorIcon },
    { name: 'Schedule', to: '/schedule', icon: DocumentTextIcon },
    { name: 'Reports', to: '/reports', icon: ChartPieIcon },
  ];

  const accountMenu = [
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link style
  const activeClassName = "bg-blue-700 text-white";
  const inactiveClassName = "text-blue-100 hover:bg-blue-700 hover:text-white";
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-primary text-white hover:bg-blue-700 shadow-md"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? 
            <XMarkIcon className="h-6 w-6" /> : 
            <Bars3Icon className="h-6 w-6" />
          }
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleMobileMenu}
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
                    onClick={toggleMobileMenu}
                    className={({ isActive }) => 
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                        isActive ? activeClassName : inactiveClassName
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-blue-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{currentUser?.displayName || 'User'}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-auto p-1 rounded-full text-blue-200 hover:bg-blue-700 hover:text-white"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-5 lg:pb-4 lg:bg-primary lg:overflow-y-auto">
        <div className="flex items-center px-6 mb-8">
          <h1 className="text-xl font-bold text-white">Loan Calculator</h1>
        </div>
        <nav className="mt-5 flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => 
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive ? activeClassName : inactiveClassName
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-blue-700">
            <p className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Account
            </p>
            {accountMenu.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => 
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive ? activeClassName : inactiveClassName
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="flex-shrink-0 p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser?.displayName || 'User'}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto p-1 rounded-full text-blue-200 hover:bg-blue-700 hover:text-white"
              title="Sign out"
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
