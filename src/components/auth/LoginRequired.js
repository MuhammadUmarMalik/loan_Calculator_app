import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LockClosedIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const LoginRequired = ({ children }) => {
  const { currentUser, signInWithGoogle, login, register, authError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setLoginError('');
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Show a more user-friendly message
      if (error.code === 'auth/operation-not-allowed') {
        setLoginError('Google sign-in is not enabled. Please use email/password login instead.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setIsSigningIn(true);
      setLoginError('');
      if (isRegistering) {
        // Register new user
        await register(email, password, displayName);
      } else {
        // Login existing user
        await login(email, password);
      }
    } catch (error) {
      console.error('Email auth error:', error);
      if (error.code === 'auth/user-not-found') {
        setLoginError('No account found with this email. Please check your email or create an account.');
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setLoginError('This email is already registered. Please use a different email or log in.');
      } else if (error.code === 'auth/weak-password') {
        setLoginError('Password should be at least 6 characters.');
      } else {
        setLoginError(error.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // If user is logged in, show the children (main app content)
  if (currentUser) {
    return <>{children}</>;
  }

  // If user is not logged in, show the login required screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary bg-opacity-10 mb-6">
            <LockClosedIcon className="h-8 w-8 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Loan Calculator
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sign in to access all features
          </p>

          {/* Error Message */}
          {(authError || loginError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{loginError || authError}</p>
              </div>
              {(authError && authError.includes("not enabled")) && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Alternative:</strong> Please use email/password login below.
                  </p>
                </div>
              )}
            </div>
          )}

          {!showEmailForm ? (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {isSigningIn ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Option */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5 mr-3" />
                Continue with Email
              </button>
            </>
          ) : (
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter your full name"
                        required={isRegistering}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="yourname@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSigningIn ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isRegistering ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </form>

              {/* Switch between login and register */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-primary hover:underline text-sm"
                >
                  {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>

              {/* Back to options */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowEmailForm(false);
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    setIsRegistering(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back to all options
                </button>
              </div>
            </>
          )}

          {/* Features Preview */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What you'll get access to:
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600">Advanced loan calculations</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600">Amortization schedules</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600">Extra payment calculations</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600">Export and save results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
