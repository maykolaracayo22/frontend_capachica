import api from './axios'

export const getAllPackages = () => api.get('/packages');
export const getPackage = (id) => api.get(`/packages/${id}`);
export const createPackage = (data) => api.post('/packages', data);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);
