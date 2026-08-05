import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

import { CandidateDashboard } from '../pages/candidate/CandidateDashboard';
import { ResumeUploadPage } from '../pages/candidate/ResumeUploadPage';
import { ProfilePage } from '../pages/candidate/ProfilePage';
import { JobMatchesPage } from '../pages/candidate/JobMatchesPage';
import { LearningPage } from '../pages/candidate/LearningPage';
import { CareerPathPage } from '../pages/candidate/CareerPathPage';

import { RecruiterDashboard } from '../pages/recruiter/RecruiterDashboard';
import { JobListPage } from '../pages/recruiter/JobListPage';
import { JobPostingPage } from '../pages/recruiter/JobPostingPage';
import { CandidateMatchesPage } from '../pages/recruiter/CandidateMatchesPage';

import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { PlatformStatsPage } from '../pages/admin/PlatformStatsPage';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Candidate */}
      <Route path="/candidate" element={<ProtectedRoute allowedRoles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/candidate/resume" element={<ProtectedRoute allowedRoles={['candidate']}><ResumeUploadPage /></ProtectedRoute>} />
      <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['candidate']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/candidate/matches" element={<ProtectedRoute allowedRoles={['candidate']}><JobMatchesPage /></ProtectedRoute>} />
      <Route path="/candidate/learning" element={<ProtectedRoute allowedRoles={['candidate']}><LearningPage /></ProtectedRoute>} />
      <Route path="/candidate/career" element={<ProtectedRoute allowedRoles={['candidate']}><CareerPathPage /></ProtectedRoute>} />

      {/* Recruiter */}
      <Route path="/recruiter" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><JobListPage /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/new" element={<ProtectedRoute allowedRoles={['recruiter']}><JobPostingPage /></ProtectedRoute>} />
      <Route path="/recruiter/jobs/:jobId/matches" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateMatchesPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['admin']}><PlatformStatsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}