import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import SkipLink from '../accessibility/SkipLink';

/**
 * Main layout component with responsive design and accessibility
 */
const MainLayoutContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  
  return (
    <>
      
      
      <div className={`min-h-screen bg-gray-50 text-gray-800 transition-colors duration-300`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
        />
        
        {/* Main content */}
        <div 
          className="lg:pl-64 transition-all duration-300"
          onClick={handleContentClick}
        >
          
          {/* Content area with smooth transitions */}
          <main 
            id="main-content" 
            tabIndex="-1"
            className="py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300"
          >
            <Outlet />
          </main>
          
          
        </div>
      </div>
    </>
  );
};

const MainLayout = () => {
  return (
    <MainLayoutContent />
  );
};

export default MainLayout;
