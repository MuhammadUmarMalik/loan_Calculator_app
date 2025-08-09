// Service Worker for Loan Calculator App - Optimized for SEO and Performance

const CACHE_NAME = 'loan-calculator-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/maskable_icon.png',
  '/maskable_icon_x192.png',
  '/social-preview.png',
  '/static/css/main.chunk.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  '/calculator',
  '/schedule',
  '/reports',
  '/sitemap.xml'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate the new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  // Ensure the service worker takes control of all clients
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API requests or external resources
                if (event.request.url.includes('/api/') || 
                    !event.request.url.startsWith(self.location.origin)) {
                  return;
                }
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If fetch fails (e.g., offline), try to serve the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return null;
          });
      })
  );
});

// Handle background sync for saved calculations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-saved-loans') {
    event.waitUntil(syncSavedLoans());
  }
});

// Function to sync saved loans when online
async function syncSavedLoans() {
  try {
    // Get saved loans from IndexedDB
    const db = await openDB();
    const savedLoans = await db.getAll('savedLoans');
    
    // If there are saved loans and we're online, sync them
    if (savedLoans.length > 0 && navigator.onLine) {
      // In a real app, you would send these to your server
      console.log('Syncing saved loans:', savedLoans);
    }
  } catch (error) {
    console.error('Error syncing saved loans:', error);
  }
}

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LoanCalculatorDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('savedLoans')) {
        db.createObjectStore('savedLoans', { keyPath: 'id' });
      }
    };
  });
}
