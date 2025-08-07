import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, CalendarIcon, AtSymbolIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { currentUser } = useAuth();
  
  // Mock user data (in a real app, this would come from a database)
  const userData = {
    displayName: currentUser?.displayName || 'User',
    email: currentUser?.email || 'user@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2023',
    accountType: 'Premium',
    company: 'Personal'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - User info card */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-lg border border-gray-100 transition-all">
            <div className="flex flex-col items-center pb-6">
              <div className="h-24 w-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <UserCircleIcon className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{userData.displayName}</h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <div className="mt-4 flex items-center">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {userData.accountType}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Member since {userData.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{userData.company}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Activity summary */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-lg border border-gray-100 transition-all">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome to your profile page. Here you can view and manage your account information.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-700">
                  Your account is currently on the {userData.accountType} plan.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Loan calculation saved</p>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Profile information updated</p>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Account created</p>
                      <span className="text-xs text-gray-500">Jan 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
