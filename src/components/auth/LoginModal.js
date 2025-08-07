import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const LoginModal = ({ isOpen, onClose, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, signInWithGoogle, authError } = useAuth();
  
  // Create a ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Set up an effect to update the mounted ref when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      setIsSubmitting(true);
      await login(email, password);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsSubmitting(false);
        onClose();
      }
    } catch (error) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsSubmitting(false);
        
        // Format Firebase error messages for better user experience
        if (error.code === 'auth/user-not-found') {
          setError('No account found with this email. Please check your email or create an account.');
        } else if (error.code === 'auth/wrong-password') {
          setError('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else if (error.code === 'auth/too-many-requests') {
          setError('Too many failed login attempts. Please try again later or reset your password.');
        } else {
          setError(authError || 'Failed to sign in. Please check your credentials.');
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await signInWithGoogle();
      if (isMountedRef.current) {
        onClose();
      }
    } catch (error) {
      if (isMountedRef.current) {
        setIsSubmitting(false);
        // The error is already handled in AuthContext, but we can add additional context here
        if (error.code === 'auth/operation-not-allowed') {
          setError('Google sign-in is not enabled. Please use email/password login instead.');
        } else {
          setError('Failed to sign in with Google. Please try again or use email/password login.');
        }
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    try {
      setIsResettingPassword(true);
      setError('');
      await sendPasswordResetEmail(auth, email);
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setSuccessMessage('Password reset email sent. Check your inbox for instructions.');
        setIsResettingPassword(false);
      }
    } catch (error) {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsResettingPassword(false);
        
        if (error.code === 'auth/user-not-found') {
          setError('No account found with this email.');
        } else if (error.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else {
          setError('Failed to send password reset email. Please try again.');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md relative animate-fadeIn">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
            <p className="text-text-secondary dark:text-gray-300">Sign in to access all features</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-error dark:text-red-300 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 p-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 input-field focus:ring-primary focus:border-primary"
                  required
                  placeholder="yourname@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 input-field focus:ring-primary focus:border-primary"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
                />
                <label htmlFor="remember-me" className="ml-2 text-text-secondary dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <button 
                type="button" 
                className="text-primary hover:underline"
                onClick={handleResetPassword}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? 'Sending...' : 'Forgot password?'}
              </button>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full btn-primary py-3 flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary dark:text-gray-300">
              Don't have an account?{' '}
              <button 
                onClick={switchToRegister}
                className="text-primary font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
