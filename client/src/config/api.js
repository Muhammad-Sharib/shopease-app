// Central API base URL — reads from environment variable
// Development: http://localhost:9999
// Production:  your deployed backend URL (set in .env.production or Vercel env)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9999';

export default API_BASE;
