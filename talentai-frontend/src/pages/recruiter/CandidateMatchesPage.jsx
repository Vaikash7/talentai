import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { recruiterApi } from '../../api/recruiterApi';

function scoreColor(score) {
  if (score >= 70) return 'badge-success';
  if (score >= 40) return 'badge-warning';
  return 'badge-danger';
}

export function CandidateMatchesPage() {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const jobRes = await recruiterApi.getJob(jobId);
      setJob(jobRes.data);
      const matchesRes = await recruiterApi.getJobMatches(jobId);
      setMatches(matchesRes.data);
      setLoading(false);
    })();
  }, [jobId]);

  if (loading) return <PageLayout role="recruiter" title="Candidate Matches"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="recruiter" title={`Candidates for: ${job?.title || ''}`}>
      {matches.length === 0 ? (
        <div className="card">
          <EmptyState icon={Users} title="No candidates yet" message="No candidates have matching profiles for this job yet." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {matches.map((m) => (
            <div key={m.match_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: '70%' }}>
                  {m.candidate_summary ? m.candidate_summary.split('\n')[0] : 'Candidate'}
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