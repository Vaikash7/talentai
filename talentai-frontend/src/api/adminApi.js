import axiosClient from './axiosClient';

export const adminApi = {
  listUsers: () => axiosClient.get('/admin/users'),
  getStats: () => axiosClient.get('/admin/stats'),
};