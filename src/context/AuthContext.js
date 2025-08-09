import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { saveUserProfile, getUserProfile } from '../services/userService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Register with Firebase
  const register = async (email, password, displayName) => {
    try {
      setAuthError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Use provided displayName or fallback to email username
      const userDisplayName = displayName || email.split('@')[0];
      
      // Update the user profile with display name
      await updateProfile(userCredential.user, { displayName: userDisplayName });
      
      // Create user profile in Firestore
      await saveUserProfile(userCredential.user.uid, {
        displayName: userDisplayName,
        email,
        phone: '',
        accountType: 'Free',
        company: 'Personal'
      });
      
      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Login with Firebase
  const login = async (email, password) => {
    try {
      setAuthError("");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Google sign in function
  const signInWithGoogle = async () => {
    try {
      setAuthError("");
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user profile exists in Firestore, if not create one
      const userProfile = await getUserProfile(result.user.uid);
      
      if (!userProfile) {
        await saveUserProfile(result.user.uid, {
          displayName: result.user.displayName || result.user.email.split('@')[0],
          email: result.user.email,
          phone: result.user.phoneNumber || '',
          accountType: 'Free',
          company: 'Personal'
        });
      }
      
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError("Google sign-in is not enabled. Please contact the administrator or use email/password login.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError("Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.");
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError("Network error. Please check your internet connection and try again.");
      } else {
        setAuthError("Failed to sign in with Google. Please try again or use email/password login.");
      }
      throw error;
    }
  };

  // Logout with Firebase
  const logout = async () => {
    try {
      setAuthError("");
      await signOut(auth);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    
    try {
      setProfileLoading(true);
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };
  
  // Update user profile in Firestore
  const updateUserProfileData = async (data) => {
    if (!currentUser) return false;
    
    try {
      setProfileLoading(true);
      await saveUserProfile(currentUser.uid, data);
      // Update local state
      setUserProfile(prev => ({...prev, ...data}));
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile when user is authenticated
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    logout,
    register,
    signInWithGoogle,
    authError,
    loading,
    profileLoading,
    fetchUserProfile,
    updateUserProfileData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
