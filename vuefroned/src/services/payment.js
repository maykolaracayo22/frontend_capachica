import api from './axios';

export default {
  create(data) {
    return api.post('/payments', data);
  },
  getAll() {
    return api.get('/payments');
  },
  get(id) {
    return api.get(`/payments/${id}`);
  },
  confirm(id) {
    return api.post(`/payments/${id}/confirm`);
  },
  reject(id) {
    return api.post(`/payments/${id}/reject`);
  },
  getForEntrepreneur() {
    return api.get('/payments/for-entrepreneur');
  }
  
};
