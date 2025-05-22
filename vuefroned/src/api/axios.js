import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Tu URL del backend Laravel
  withCredentials: true  // Asegura que las cookies se incluyan en las solicitudes
});

export default api;
