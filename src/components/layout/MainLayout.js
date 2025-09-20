import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import LoginRequired from '../auth/LoginRequired';
import SkipLink from '../accessibility/SkipLink';

/**
 * Main layout component with responsive design, theme features, and accessibility
 */
const MainLayoutContent = () => {
  useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [announcementText, setAnnouncementText] = useState('');
  
  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setLoading(false);
  }, []);
  
  // Toggle theme handler with announcement for screen readers
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Announce theme change to screen readers
    setAnnouncementText(`Theme changed to ${newTheme} mode`);
    setTimeout(() => setAnnouncementText(''), 1000);
  };

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="sr-only">Loading application...</span>
      </div>
    );
  }
  
  return (
    <LoginRequired>
      {/* Screen reader announcement area */}
      <div 
        aria-live="polite" 
        className="sr-only"
        role="status"
      >
        {announcementText}
      </div>
      
      {/* Skip to content link */}
      <SkipLink />
      
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
      }`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          theme={theme}
        />
        
        {/* Main content */}
        <div 
          className="lg:pl-64 transition-all duration-300"
          onClick={handleContentClick}
        >
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
          
          {/* Content area with smooth transitions */}
          <main 
            id="main-content" 
            tabIndex="-1"
            className="py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-300"
          >
            <Outlet />
          </main>
          
          {/* Redesigned footer with accessibility improvements */}
          <footer 
            className={`py-3 sm:py-4 px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-8 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-inner'
            }`}
            role="contentinfo"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  © {new Date().getFullYear()} Loan Calculator App. All rights reserved.
                </p>
                <nav aria-label="Footer" className="mt-2 md:mt-0 flex space-x-4">
                  <a 
                    href="/privacy" 
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300 hover:text-white focus:text-white' : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'
                    } transition-colors focus:outline-none focus:underline`}
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="/terms" 
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300 hover:text-white focus:text-white' : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'
                    } transition-colors focus:outline-none focus:underline`}
                  >
                    Terms of Service
                  </a>
                  <a 
                    href="/accessibility" 
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300 hover:text-white focus:text-white' : 'text-gray-500 hover:text-gray-700 focus:text-gray-700'
                    } transition-colors focus:outline-none focus:underline`}
                    aria-label="Accessibility statement"
                  >
                    Accessibility
                  </a>
                </nav>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </LoginRequired>
  );
};

const MainLayout = () => {
  return (
    <AuthProvider>
      <MainLayoutContent />
    </AuthProvider>
  );
};

export default MainLayout;
