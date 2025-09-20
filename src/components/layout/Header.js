import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/**
 * Header component with responsive design and user authentication
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Function to toggle sidebar visibility
 */
const Header = ({ toggleSidebar }) => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const handleSettingsNavigation = (path) => {
    setShowSettings(false);
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-30 py-3 px-4 sm:px-6 shadow-md border-b transition-colors duration-300 bg-white text-gray-800 border-gray-200`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-md focus:outline-none text-gray-500 hover:text-gray-600`}
          aria-label="Open menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* App title on small screens (mobile) */}
        <div className="lg:hidden flex items-center">
          <h1 className={`text-lg font-bold text-primary`}>
            Loan Calculator
          </h1>
        </div>
        
        {/* Search bar - Center */}
        <div className="flex-1 max-w-lg hidden md:block lg:mx-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search calculations..."
              className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-gray-700 bg-gray-100 focus:bg-white`}
              aria-label="Search"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

      </div>
      
      {/* Auth modals removed: authentication disabled */}
    </header>
  );
};

export default Header;