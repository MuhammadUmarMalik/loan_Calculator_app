import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, AtSymbolIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, userProfile, profileLoading } = useAuth();
  
  // Use data from Firestore if available, otherwise use defaults
  const userData = {
    displayName: userProfile?.displayName || currentUser?.displayName || 'Malik Graphics',
    email: userProfile?.email || currentUser?.email || 'malikgraphics811@gmail.com',
    phone: userProfile?.phone || '+1 (555) 123-4567',
    joinDate: userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2023',
    accountType: userProfile?.accountType || 'Premium',
    company: userProfile?.company || 'Personal'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <Link to="/account" className="btn-primary py-2 px-4 text-sm flex items-center">
          Edit Profile
        </Link>
      </div>
      
      {profileLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading your profile information...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - User info card */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-lg border border-gray-100 transition-all">
            <div className="flex flex-col items-center pb-6">
              <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg className="h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{userData.displayName}</h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <div className="mt-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  Premium
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
        
        {/* Right column - Profile information */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-lg border border-gray-100 transition-all">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome to your profile page. Here you can view and manage your account information.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-700">
                  Your account is currently on the Premium plan.
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