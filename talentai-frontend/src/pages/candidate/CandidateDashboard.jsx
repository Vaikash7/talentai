import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Target, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { candidateApi } from '../../api/candidateApi';
import { useAuth } from '../../hooks/useAuth';

export function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profileRes = await candidateApi.getProfile();
        setProfile(profileRes.data);
        setHasProfile(true);
        const matchesRes = await candidateApi.getMatches();
        setMatches(matchesRes.data);
      } catch (err) {
        if (err.response?.status === 404) setHasProfile(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageLayout role="candidate" title="Dashboard"><LoadingSpinner /></PageLayout>;

  const topMatch = matches[0];

  return (
    <PageLayout role="candidate" title="Dashboard">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Here's what's happening with your career journey.</p>
      </div>

      {!hasProfile && (
        <div className="card" style={{ marginBottom: 24, background: 'var(--color-primary-light)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Complete your profile</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Upload your resume to start getting matched with jobs.</div>
            </div>
            <Link to="/candidate/resume" className="btn btn-primary">Upload Resume</Link>
          </div>
        </div>
      )}

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon"><Target size={20} /></div>
          <div className="stat-value">{matches.length}</div>
          <div className="stat-label">Job Matches</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><Upload size={20} /></div>
          <div className="stat-value">{profile?.skills?.length || 0}</div>
          <div className="stat-label">Skills Identified</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><TrendingUp size={20} /></div>
          <div className="stat-value">{topMatch ? `${topMatch.score}%` : '—'}</div>
          <div className="stat-label">Best Match Score</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><BookOpen size={20} /></div>
          <div className="stat-value">{topMatch?.gap_skills?.length || 0}</div>
          <div className="stat-label">Skills to Learn</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Top Job Match</div>
              <div className="card-subtitle">Based on your current skills</div>
            </div>
            <Link to="/candidate/matches" className="btn btn-secondary btn-sm">View All <ArrowRight size={14} /></Link>
          </div>
          {topMatch ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>{topMatch.job_title}</span>
                <span className="badge badge-primary">{topMatch.score}% Match</span>
              </div>
              <div className="progress-track" style={{ marginBottom: 12 }}>
                <div className="progress-fill" style={{ width: `${topMatch.score}%` }}></div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{topMatch.ai_rationale}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No matches yet. Upload your resume to get started.</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Your Skills</div>
              <div className="card-subtitle">Extracted from your resume</div>
            </div>
          </div>
          {profile?.skills?.length ? (
            <div>
              {profile.skills.map((s) => (
                <span key={s.id} className="skill-tag">{s.name}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No skills identified yet.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}