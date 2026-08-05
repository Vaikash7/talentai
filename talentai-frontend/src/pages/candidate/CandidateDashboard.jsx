import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Target, BookOpen, TrendingUp, ArrowRight, Lightbulb, ExternalLink } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { candidateApi } from '../../api/candidateApi';
import { useAuth } from '../../hooks/useAuth';

export function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCareer, setLoadingCareer] = useState(true);
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

  useEffect(() => {
    (async () => {
      try {
        const top = await candidateApi.getTopCareerRecommendations(3);
        setCareerRecommendations(top);
      } catch (err) {
        setCareerRecommendations([]);
      } finally {
        setLoadingCareer(false);
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

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
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

      {/* Top Career Recommendations */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><Lightbulb size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Top Career Recommendations</div>
            <div className="card-subtitle">Your best-fit career paths based on current skills</div>
          </div>
          <Link to="/candidate/career" className="btn btn-secondary btn-sm">Explore All Paths <ArrowRight size={14} /></Link>
        </div>

        {loadingCareer ? (
          <LoadingSpinner />
        ) : careerRecommendations.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Upload your resume to see personalized career recommendations.</p>
        ) : (
          <div className="grid grid-3">
            {careerRecommendations.map((rec) => (
              <div key={rec.track_key} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{rec.track_display_name}</span>
                  <span className="badge badge-primary">{rec.readiness_score}%</span>
                </div>
                <div className="progress-track" style={{ marginBottom: 12 }}>
                  <div className="progress-fill" style={{ width: `${rec.readiness_score}%` }}></div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                  Next: <strong style={{ color: 'var(--color-text-primary)' }}>{rec.recommended_next_role}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {rec.current_skills.slice(0, 3).map((s) => <span key={s} className="skill-tag matched" style={{ fontSize: 11 }}>✓ {s}</span>)}
                  {rec.missing_skills.slice(0, 3).map((s) => <span key={s} className="skill-tag gap" style={{ fontSize: 11 }}>✗ {s}</span>)}
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
                  {rec.rationale}
                </p>
                {rec.recommended_learning?.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>
                      Suggested Learning
                    </div>
                    {rec.recommended_learning.slice(0, 2).map((r) => (
                      <a key={r.id} href={r.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-primary)', marginBottom: 4 }}>
                        <ExternalLink size={11} /> {r.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}