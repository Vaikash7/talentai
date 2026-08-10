import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateApi } from '../../api/candidateApi';

function scoreColor(score) {
  if (score >= 70) return 'badge-success';
  if (score >= 40) return 'badge-warning';
  return 'badge-danger';
}

export function JobMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const loadMatches = async () => {
    try {
      const res = await candidateApi.getMatches();
      setMatches(res.data);
    } catch (err) {
      // no profile / no matches — leave empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  const handleApply = async (matchId) => {
    setActingId(matchId);
    try {
      await candidateApi.applyToMatch(matchId);
      await loadMatches();
    } finally {
      setActingId(null);
    }
  };

  const handleWithdraw = async (matchId) => {
    if (!window.confirm('Withdraw your application for this job?')) return;
    setActingId(matchId);
    try {
      await candidateApi.withdrawApplication(matchId);
      await loadMatches();
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <PageLayout role="candidate" title="Job Matches"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="candidate" title="Job Matches">
      {matches.length === 0 ? (
        <div className="card">
          <EmptyState icon={Briefcase} title="No matches yet" message="Upload your resume so we can match you with open jobs." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {matches.map((m) => (
            <div key={m.match_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{m.job_title}</div>
                </div>
                <span className={`badge ${scoreColor(m.score)}`}>{m.score}% Match</span>
              </div>
              <div className="progress-track" style={{ marginBottom: 14 }}>
                <div className="progress-fill" style={{ width: `${m.score}%` }}></div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{m.ai_rationale}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {m.matched_skills.map((s) => <span key={s} className="skill-tag matched">✓ {s}</span>)}
                {m.gap_skills.map((s) => <span key={s} className="skill-tag gap">✗ {s}</span>)}
              </div>

              {m.application_status === 'applied' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div className="badge badge-success" style={{ fontSize: 13, padding: '8px 16px' }}>
                    <CheckCircle2 size={14} /> Applied
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleWithdraw(m.match_id)}
                    disabled={actingId === m.match_id}
                  >
                    <XCircle size={14} /> {actingId === m.match_id ? 'Withdrawing...' : 'Withdraw'}
                  </button>
                </div>
              ) : m.application_status === 'withdrawn' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div className="badge badge-neutral" style={{ fontSize: 13, padding: '8px 16px' }}>
                    Application Withdrawn
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApply(m.match_id)}
                    disabled={actingId === m.match_id}
                  >
                    {actingId === m.match_id ? 'Applying...' : 'Re-Apply'}
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => handleApply(m.match_id)}
                  disabled={actingId === m.match_id}
                >
                  {actingId === m.match_id ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}