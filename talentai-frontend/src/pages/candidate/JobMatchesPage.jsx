import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
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

  useEffect(() => {
    (async () => {
      try {
        const res = await candidateApi.getMatches();
        setMatches(res.data);
      } catch (err) {
        // no profile / no matches — leave empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{m.job_title}</div>
                </div>
                <span className={`badge ${scoreColor(m.score)}`}>{m.score}% Match</span>
              </div>
              <div className="progress-track" style={{ marginBottom: 14 }}>
                <div className="progress-fill" style={{ width: `${m.score}%` }}></div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{m.ai_rationale}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.matched_skills.map((s) => <span key={s} className="skill-tag matched">✓ {s}</span>)}
                {m.gap_skills.map((s) => <span key={s} className="skill-tag gap">✗ {s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}