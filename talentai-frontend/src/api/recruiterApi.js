import axiosClient from './axiosClient';

export const recruiterApi = {
  createJob: (data) => axiosClient.post('/jobs', data),
  listMyJobs: () => axiosClient.get('/jobs/mine'),
  listOpenJobs: () => axiosClient.get('/jobs/open'),
  getJob: (jobId) => axiosClient.get(`/jobs/${jobId}`),
  updateJob: (jobId, data) => axiosClient.put(`/jobs/${jobId}`, data),
  deleteJob: (jobId) => axiosClient.delete(`/jobs/${jobId}`),
  getJobMatches: (jobId) => axiosClient.get(`/jobs/${jobId}/matches`),
};