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

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  
  // Register with Firebase
  const register = async (email, password, displayName) => {
    try {
      setAuthError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      } else {
        // Use part of email as name if no displayName provided
        await updateProfile(userCredential.user, { 
          displayName: email.split('@')[0]
        });
      }
      
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

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    register,
    signInWithGoogle,
    authError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
