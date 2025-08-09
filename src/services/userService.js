import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Collection name
const USERS_COLLECTION = 'users';

/**
 * Create a new user profile in Firestore
 * @param {string} userId - User ID from Firebase Auth
 * @param {object} userData - User data to store
 * @returns {Promise} - Promise that resolves when the user is created
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    
    // Add timestamp fields
    const dataWithTimestamps = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, dataWithTimestamps);
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile from Firestore
 * @param {string} userId - User ID from Firebase Auth
 * @returns {Promise<object|null>} - User data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update a user profile in Firestore
 * @param {string} userId - User ID from Firebase Auth
 * @param {object} userData - User data to update
 * @returns {Promise} - Promise that resolves when the user is updated
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...userData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, dataWithTimestamp);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Create or update a user profile in Firestore
 * @param {string} userId - User ID from Firebase Auth
 * @param {object} userData - User data to store or update
 * @returns {Promise} - Promise that resolves when the operation is complete
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    const userProfile = await getUserProfile(userId);
    
    if (userProfile) {
      return updateUserProfile(userId, userData);
    } else {
      return createUserProfile(userId, userData);
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};
