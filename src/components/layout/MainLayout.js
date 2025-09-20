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
      <SkipLink />
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
          
          {/* Footer with contact links */}
          <footer className="py-4 px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-8 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Loan Calculator App</p>
              <nav className="flex flex-wrap items-center gap-4 text-sm">
                <a href="https://www.umarmalik-dev.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Website</a>
                <a href="https://www.linkedin.com/in/umarmalik-dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>
                <a href="https://github.com/muhammadumarmalik" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>
                <a href="mailto:umarmalik.cs711@gmail.com" className="text-primary hover:underline">umarmalik.cs711@gmail.com</a>
              </nav>
            </div>
          </footer>
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
