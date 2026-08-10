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
  applyToMatch: (matchId) => axiosClient.post('/candidates/matches/apply', { match_id: matchId }),
  withdrawApplication: (matchId) => axiosClient.post('/candidates/matches/withdraw', { match_id: matchId }),
  getLearningRecommendations: () => axiosClient.get('/candidates/learning-recommendations'),
  getCareerTracks: () => axiosClient.get('/candidates/career-tracks'),
  getCareerPath: (trackKey) => axiosClient.get(`/candidates/career-path/${trackKey}`),
  updateOpenToInternal: (value) => axiosClient.put('/candidates/open-to-internal', { open_to_internal_opportunities: value }),

  getTopCareerRecommendations: async (limit = 3) => {
    const tracksRes = await axiosClient.get('/candidates/career-tracks');
    const tracks = tracksRes.data;
    const results = await Promise.all(
      tracks.map((t) => axiosClient.get(`/candidates/career-path/${t.key}`).then((r) => r.data))
    );
    return results.sort((a, b) => b.readiness_score - a.readiness_score).slice(0, limit);
  },
};