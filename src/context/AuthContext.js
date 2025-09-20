import React, { createContext, useContext } from 'react';

// Create a no-authentication stub context
const noAuthValue = {
  currentUser: null,
  userProfile: null,
  login: async () => null,
  logout: async () => null,
  register: async () => null,
  signInWithGoogle: async () => null,
  authError: '',
  loading: false,
  profileLoading: false,
  fetchUserProfile: async () => null,
  updateUserProfileData: async () => false
};

const AuthContext = createContext(noAuthValue);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider that simply renders children with no auth state
export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={noAuthValue}>
      {children}
    </AuthContext.Provider>
  );
}
