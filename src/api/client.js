import axios from 'axios';

// Configure Axios defaults as per API.md specification
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Helper API methods with fallback handling
export const getSocialLinks = async () => {
  try {
    const res = await api.get('/social-links');
    return res.data?.data || null;
  } catch (error) {
    console.warn('[Chelind API] /api/social-links unreachable, using fallback UI data.');
    return null;
  }
};

export const getMatches = async (params = {}) => {
  try {
    const res = await api.get('/matches', { params });
    return res.data?.data || null;
  } catch (error) {
    console.warn('[Chelind API] /api/matches unreachable, using fallback UI data.');
    return null;
  }
};

export const getArticles = async (params = {}) => {
  try {
    const res = await api.get('/articles', { params });
    return res.data?.data || null;
  } catch (error) {
    console.warn('[Chelind API] /api/articles unreachable, using fallback UI data.');
    return null;
  }
};

export const getCsrfToken = async () => {
  try {
    await api.get('/csrf-cookie');
  } catch (error) {
    console.warn('[Chelind API] Failed to fetch CSRF token.');
  }
};

export const login = async (credentials) => {
  await getCsrfToken();
  const res = await api.post('/login', credentials);
  return res.data;
};

export const logout = async () => {
  const res = await api.post('/logout');
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/me');
  return res.data;
};

export default api;
