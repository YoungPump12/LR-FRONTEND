/**
 * API Configuration
 * 
 * For Development:
 * The Vite proxy forwards all /api calls to https://api.tafadzwa.co
 * This avoids CORS issues during development
 * 
 * For Production:
 * You'll need to either:
 * 1. Enable CORS on your backend
 * 2. Deploy frontend and backend on the same origin
 * 3. Use a reverse proxy
 */

export const API_CONFIG = {
  // Development uses Vite proxy
  DEV_API_URL: 'http://localhost:5174/api',
  
  // Production uses actual backend URL
  PROD_API_URL: 'https://api.tafadzwa.co/api',
  
  // Get the appropriate URL based on environment
  getBaseURL: () => {
    if (import.meta.env.DEV) {
      return 'http://localhost:5174/api'
    }
    return 'https://api.tafadzwa.co/api'
  }
}

export default API_CONFIG
