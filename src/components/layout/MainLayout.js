import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import LoginRequired from '../auth/LoginRequired';

const MainLayoutContent = () => {
  const { currentUser } = useAuth();
  
  return (
    <LoginRequired>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        
        {/* Main content */}
        <div className="lg:pl-64">
          <Header />
          <main className="py-4 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </main>
          
          <footer className="bg-white shadow-inner py-3 sm:py-4 px-3 sm:px-4 md:px-6 lg:px-8 mt-4 sm:mt-8">
            <div className="max-w-7xl mx-auto">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Mortgage Calculator. All rights reserved.
              </p>
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
