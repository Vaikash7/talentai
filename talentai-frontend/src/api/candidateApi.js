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

  // Fetches readiness across ALL tracks and returns the top N, sorted by
  // readiness score. Reuses the existing career-tracks + career-path
  // endpoints (multiple calls) rather than introducing a new backend route.
  getTopCareerRecommendations: async (limit = 3) => {
    const tracksRes = await axiosClient.get('/candidates/career-tracks');
    const tracks = tracksRes.data;
    const results = await Promise.all(
      tracks.map((t) => axiosClient.get(`/candidates/career-path/${t.key}`).then((r) => r.data))
    );
    return results.sort((a, b) => b.readiness_score - a.readiness_score).slice(0, limit);
  },
};