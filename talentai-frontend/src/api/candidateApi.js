import axiosClient from './axiosClient';

export const candidateApi = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/candidates/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getProfile: () => axiosClient.get('/candidates/profile'),
  getMatches: () => axiosClient.get('/candidates/matches'),
  getLearningRecommendations: () => axiosClient.get('/candidates/learning-recommendations'),
  getCareerTracks: () => axiosClient.get('/candidates/career-tracks'),
  getCareerPath: (trackKey) => axiosClient.get(`/candidates/career-path/${trackKey}`),
};