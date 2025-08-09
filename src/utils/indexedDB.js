/**
 * IndexedDB utility functions for offline data storage
 * Provides methods to save, retrieve, and manage loan calculations
 */

const DB_NAME = 'LoanCalculatorDB';
const DB_VERSION = 1;
const STORE_NAME = 'savedLoans';

// Singleton DB connection
let dbInstance = null;

/**
 * Opens the IndexedDB database connection, implementing singleton pattern
 * @returns {Promise<IDBDatabase>} Database instance
 */
export const openDB = () => {
  // Return existing connection if available
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(`Database error: ${event.target.error}`);
    };
    
    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      
      // Handle connection closing
      dbInstance.onclose = () => {
        dbInstance = null;
      };
      
      resolve(dbInstance);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save a loan to IndexedDB
 * @param {Object} loan - Loan data to save
 * @returns {Promise<boolean>} Success status
 */
export const saveLoan = async (loan) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Add timestamp if not present
    const loanWithMeta = {
      ...loan,
      lastUpdated: loan.lastUpdated || Date.now()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(loanWithMeta);
      
      request.onsuccess = () => {
        // Request background sync if available
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          requestBackgroundSync();
        }
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('Failed to save loan:', request.error);
        reject(`Error saving loan: ${request.error}`);
      };
      
      // Add transaction event handlers
      transaction.oncomplete = () => {
        // Transaction completed successfully
      };
      
      transaction.onerror = () => {
        console.error('Transaction failed:', transaction.error);
      };
    });
  } catch (error) {
    console.error('Error in saveLoan:', error);
    return false;
  }
};

/**
 * Get all saved loans from IndexedDB
 * @param {Object} options - Query options
 * @param {string} options.sortBy - Field to sort by
 * @param {boolean} options.descending - Sort in descending order
 * @returns {Promise<Array>} Array of saved loans
 */
export const getAllLoans = async (options = {}) => {
  try {
    const { sortBy = 'lastUpdated', descending = true } = options;
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        let results = request.result || [];
        
        // Sort results if needed
        if (sortBy) {
          results = results.sort((a, b) => {
            const valueA = a[sortBy];
            const valueB = b[sortBy];
            
            // Handle different data types
            if (typeof valueA === 'string') {
              return descending 
                ? valueB.localeCompare(valueA) 
                : valueA.localeCompare(valueB);
            }
            
            // Default numeric comparison
            return descending 
              ? valueB - valueA 
              : valueA - valueB;
          });
        }
        
        resolve(results);
      };
      
      request.onerror = () => {
        console.error('Failed to get loans:', request.error);
        reject(`Error getting loans: ${request.error}`);
      };
    });
  } catch (error) {
    console.error('Error in getAllLoans:', error);
    return [];
  }
};

/**
 * Delete a loan from IndexedDB
 * @param {string|number} id - ID of the loan to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteLoan = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      
      request.onsuccess = () => {
        // Trigger background sync after deletion
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          requestBackgroundSync();
        }
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('Failed to delete loan:', request.error);
        reject(`Error deleting loan: ${request.error}`);
      };
    });
  } catch (error) {
    console.error('Error in deleteLoan:', error);
    return false;
  }
};

/**
 * Clear all loans from IndexedDB
 * @returns {Promise<boolean>} Success status
 */
export const clearLoans = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('Successfully cleared all loans');
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('Failed to clear loans:', request.error);
        reject(`Error clearing loans: ${request.error}`);
      };
    });
  } catch (error) {
    console.error('Error in clearLoans:', error);
    return false;
  }
};

/**
 * Request background sync when online for data synchronization
 * @returns {Promise<void>}
 */
export const requestBackgroundSync = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-saved-loans');
      return true;
    } catch (err) {
      console.error('Background sync registration failed:', err);
      return false;
    }
  }
  return false;
};

/**
 * Get a single loan by ID
 * @param {string|number} id - Loan ID to retrieve
 * @returns {Promise<Object|null>} The loan object or null if not found
 */
export const getLoanById = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        console.error('Failed to get loan:', request.error);
        reject(`Error getting loan: ${request.error}`);
      };
    });
  } catch (error) {
    console.error('Error in getLoanById:', error);
    return null;
  }
};
