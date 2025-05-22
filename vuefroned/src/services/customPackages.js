import api from './axios' 

export const getMyCustomPackages = () => api.get('/custom-packages')
export const getCustomPackage = (id) => api.get(`/custom-packages/${id}`)
export const createCustomPackage = (data) => api.post('/custom-packages', data)
export const updateCustomPackage = (id, data) => api.put(`/custom-packages/${id}`, data)
export const deleteCustomPackage = (id) => api.delete(`/custom-packages/${id}`)
