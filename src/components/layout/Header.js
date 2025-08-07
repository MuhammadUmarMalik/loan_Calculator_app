import React, { useState, useRef, useEffect } from 'react';
import { 
  MoonIcon, 
  SunIcon, 
  UserIcon, 
  CogIcon, 
  PencilIcon,
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
  const [showSettings, setShowSettings] = useState(false);
  
  const settingsRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize dark mode from localStorage if available
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
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
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const handleSettingsNavigation = (path) => {
    setShowSettings(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white text-gray-800 py-3 px-4 sm:px-6 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Empty space for sidebar alignment */}
        <div className="lg:w-64 hidden lg:block"></div>
        
        {/* App title on small screens (mobile) */}
        <div className="lg:hidden flex items-center ml-8 sm:ml-12">
          <h1 className="text-lg font-bold text-primary">Loan Calculator</h1>
        </div>
        
        {/* Search bar - Center */}
        <div className="flex-1 max-w-lg hidden md:block lg:mx-4">
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
              <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
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
              <div className="hidden sm:flex flex-col items-end">
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
                  aria-label="Log out"
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
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary text-white font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
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