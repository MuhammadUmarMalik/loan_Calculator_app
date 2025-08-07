import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const RegisterModal = ({ isOpen, onClose, switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, authError } = useAuth();
  
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

    // Form validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setIsSubmitting(true);
      
      await register(email, password, displayName);
      
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
        if (error.code === 'auth/email-already-in-use') {
          setError('This email is already registered. Please use a different email or log in.');
        } else if (error.code === 'auth/invalid-email') {
          setError('Please enter a valid email address.');
        } else if (error.code === 'auth/weak-password') {
          setError('Please choose a stronger password.');
        } else {
          setError(authError || 'Failed to create an account. Please try again.');
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
            <h2 className="text-2xl font-bold text-primary">Create Account</h2>
            <p className="text-text-secondary dark:text-gray-300">Sign up to access all features</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-error dark:text-red-300 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 input-field focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 input-field focus:ring-primary focus:border-primary"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="terms" 
                type="checkbox" 
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" 
                required
              />
              <div className="ml-2 text-sm text-text-secondary dark:text-gray-300">
                <label htmlFor="terms">
                  I agree to the 
                </label>
                {' '}
                <button 
                  type="button" 
                  onClick={() => {
                    // Use a relative URL that exists in your app or an absolute URL
                    window.open('https://example.com/terms', '_blank', 'noopener,noreferrer');
                  }} 
                  className="text-primary hover:underline"
                >
                  Terms
                </button>
                {' and '}
                <button 
                  type="button" 
                  onClick={() => {
                    // Use a relative URL that exists in your app or an absolute URL
                    window.open('https://example.com/privacy', '_blank', 'noopener,noreferrer');
                  }} 
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </button>
              </div>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary dark:text-gray-300">
              Already have an account?{' '}
              <button 
                onClick={switchToLogin}
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
