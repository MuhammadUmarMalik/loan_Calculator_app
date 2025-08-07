# Firebase Google Authentication Setup Guide

## Current Issue
The error `auth/operation-not-allowed` occurs because Google authentication is not enabled in your Firebase project.

## How to Fix Google Authentication

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bike-app-24456`

### Step 2: Enable Google Authentication
1. In the left sidebar, click on **"Authentication"**
2. Click on the **"Sign-in method"** tab
3. Find **"Google"** in the list of providers
4. Click on **"Google"** to configure it
5. Toggle the **"Enable"** switch to turn it on
6. Add your **Project support email** (your email address)
7. Click **"Save"**

### Step 3: Configure OAuth Consent Screen (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `bike-app-24456`
3. Navigate to **"APIs & Services"** > **"OAuth consent screen"**
4. Configure the consent screen:
   - User Type: External
   - App name: "Loan Calculator"
   - User support email: Your email
   - Developer contact information: Your email
5. Add scopes:
   - `email`
   - `profile`
   - `openid`
6. Add test users (your email addresses)
7. Save and continue

### Step 4: Add Authorized Domains
1. Go back to Firebase Console > Authentication
2. Click on the **"Settings"** tab
3. Scroll down to **"Authorized domains"**
4. Add your domain:
   - For development: `localhost`
   - For production: Your actual domain

### Step 5: Test the Implementation
1. Restart your React app: `npm start`
2. Try signing in with Google
3. The error should be resolved

## Alternative Solution (Temporary)

If you can't enable Google authentication immediately, users can still use the app with email/password authentication:

1. Users can click the **"Login / Signup"** button in the header
2. Use the email/password login option
3. Create an account with email and password

## Code Changes Made

The following improvements have been added to handle the Google authentication error gracefully:

1. **Better Error Messages**: User-friendly error messages for different Google sign-in issues
2. **Fallback Option**: Clear instructions for users to use email/password login as an alternative
3. **Error Handling**: Comprehensive error handling in the AuthContext

## Files Modified

- `src/context/AuthContext.js`: Added better error handling for Google sign-in
- `src/components/auth/LoginRequired.js`: Added fallback option and better error display

## Testing

After enabling Google authentication in Firebase:

1. Clear your browser cache
2. Restart the React development server
3. Try signing in with Google
4. Verify that the error is resolved

## Support

If you continue to have issues:

1. Check the Firebase Console for any additional configuration requirements
2. Verify that your Firebase project is properly set up
3. Ensure you're using the correct Firebase configuration in your code
4. Check the browser console for any additional error messages
