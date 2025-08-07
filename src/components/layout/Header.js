import React, { useState, useRef, useEffect } from 'react';
import { 
  MoonIcon, 
  SunIcon, 
  UserIcon, 
  BellIcon, 
  CogIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  PencilIcon,
  KeyIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      message: 'Your loan calculation was saved successfully.',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'New feature: Extra payment calculator is now available!',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      message: 'Interest rates are changing next month. Update your calculations.',
      time: '1 day ago',
      read: true
    }
  ]);
  
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

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
  
  // Handle notification and settings popover clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };
  
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const handleSettingsNavigation = (path) => {
    setShowSettings(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white text-gray-800 py-3 px-6 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Empty space for sidebar alignment */}
        <div className="lg:w-64"></div>
        
        {/* Search bar - Center */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search for anything..."
              className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Header icons and user profile */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          {/* Notifications Button with Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={markAllAsRead} 
                      className="text-xs text-primary hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 hover:bg-gray-50 flex ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {notification.type === 'success' && (
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {notification.type === 'warning' && (
                            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                            </div>
                          )}
                          {notification.type === 'info' && (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 pr-8 relative">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Button with Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={toggleSettings}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Settings"
            >
              <CogIcon className="h-5 w-5" />
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">Settings</h3>
                </div>
                
                <div>
                  <button 
                    onClick={() => handleSettingsNavigation('/profile')}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center"
                  >
                    <UserCircleIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Your Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSettingsNavigation('/account')}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center"
                  >
                    <PencilIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Edit Account</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSettingsNavigation('/security')}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center"
                  >
                    <KeyIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Security Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => handleSettingsNavigation('/privacy')}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center"
                  >
                    <ShieldExclamationIcon className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Privacy & Data</span>
                  </button>
                  
                  <div className="border-t border-gray-200 mt-1"></div>
                  
                  <button 
                    onClick={() => toggleDarkMode()}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {darkMode ? (
                        <SunIcon className="h-5 w-5 text-gray-500 mr-3" />
                      ) : (
                        <MoonIcon className="h-5 w-5 text-gray-500 mr-3" />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full ${darkMode ? 'bg-primary' : 'bg-gray-300'} relative transition-colors`}>
                      <div className={`absolute h-4 w-4 rounded-full bg-white top-0.5 transition-all ${darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>
                  
                  <div className="border-t border-gray-200 mt-1"></div>
                  
                  <button 
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-50 w-full text-left flex items-center text-red-600"
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
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                <span className="text-xs text-gray-500">Premium Account</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="relative group lg:hidden">
                <button 
                  onClick={logout}
                  className="ml-2 p-1 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={openLoginModal}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors"
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