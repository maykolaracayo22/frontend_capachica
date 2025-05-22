import axios from 'axios';
import Cookies from 'js-cookie'; // <- ✅ Se usa para CSRF token

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const xsrfToken = Cookies.get('XSRF-TOKEN'); // <- ✅ Laravel lo espera para proteger contra CSRF
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  return config;
});

export default api;
