import React, { useState, useRef, useEffect } from 'react';
import { 
  MoonIcon, 
  SunIcon, 
  UserIcon, 
  CogIcon, 
  PencilIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

/**
 * Header component with responsive design, dark mode support and user authentication
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 * @param {string} props.theme - Current theme (light/dark)
 * @param {Function} props.toggleTheme - Function to toggle between light and dark themes
 */
const Header = ({ toggleSidebar, theme = 'light', toggleTheme }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const settingsRef = useRef(null);
  const notificationsRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Handle settings popover clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle notifications popover clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showNotifications) setShowNotifications(false); // Close notifications if open
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showSettings) setShowSettings(false); // Close settings if open
  };
  
  const handleSettingsNavigation = (path) => {
    setShowSettings(false);
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-30 py-3 px-4 sm:px-6 shadow-md border-b transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-100 border-gray-700' 
        : 'bg-white text-gray-800 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-md focus:outline-none ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-500 hover:text-gray-600'
          }`}
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* App title on small screens (mobile) */}
        <div className="lg:hidden flex items-center">
          <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}>
            Loan Calculator
          </h1>
        </div>
        
        {/* Search bar - Center */}
        <div className="flex-1 max-w-lg hidden md:block lg:mx-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search calculations..."
              className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-200 bg-gray-700 focus:bg-gray-600' 
                  : 'text-gray-700 bg-gray-100 focus:bg-white'
              }`}
              aria-label="Search"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Header icons and user profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white"></span>
            </button>
            
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 z-50 border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  <div className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">New features available</p>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>1h ago</span>
                    </div>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Check out the new comparison tools!
                    </p>
                  </div>
                  
                  <div className={`px-4 py-3 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">Your calculation was saved</p>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>1d ago</span>
                    </div>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Home loan calculation automatically saved
                    </p>
                  </div>
                </div>
                
                <div className={`px-4 py-2 text-center text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}>
                  <button>View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          {/* Settings Button with Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={toggleSettings}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Settings"
            >
              <CogIcon className="h-5 w-5" />
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className={`absolute right-0 mt-2 w-56 sm:w-60 rounded-lg shadow-lg py-1 z-50 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Settings</h3>
                </div>
                
                <div>
                  <button 
                    onClick={() => handleSettingsNavigation('/profile')}
                    className={`px-4 py-2 w-full text-left flex items-center ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <UserCircleIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span>Your Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSettingsNavigation('/account')}
                    className={`px-4 py-2 w-full text-left flex items-center ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <PencilIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span>Edit Account</span>
                  </button>
                  
                  <div className={`border-t mt-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  
                  <button 
                    onClick={toggleTheme}
                    className={`px-4 py-2 w-full text-left flex items-center justify-between ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {theme === 'dark' ? (
                        <SunIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <MoonIcon className={`h-5 w-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full ${
                      theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                    } relative transition-colors`}>
                      <div className={`absolute h-4 w-4 rounded-full bg-white top-0.5 transition-all ${
                        theme === 'dark' ? 'right-0.5' : 'left-0.5'
                      }`}></div>
                    </div>
                  </button>
                  
                  <div className={`border-t mt-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
                  
                  <button 
                    onClick={logout}
                    className={`px-4 py-2 w-full text-left flex items-center ${
                      theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-600'
                    }`}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentUser.displayName || currentUser.email.split('@')[0]}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Premium Account
                </span>
              </div>
              <div className={`h-8 w-8 rounded-full ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-primary'
              } text-white flex items-center justify-center`}>
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <button 
              onClick={openLoginModal}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base font-medium ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-primary hover:bg-blue-700 text-white'
              }`}
              id="login-button"
              data-testid="login-button"
              aria-label="Login or Signup"
            >
              Login
            </button>
          )}
        </div>
      </div>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={closeModals} 
        switchToRegister={openRegisterModal} 
      />
      
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={closeModals} 
        switchToLogin={openLoginModal} 
      />
    </header>
  );
};

export default Header;