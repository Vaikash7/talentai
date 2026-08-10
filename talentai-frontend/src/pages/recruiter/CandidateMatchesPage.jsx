import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Building2, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { recruiterApi } from '../../api/recruiterApi';

function scoreColor(score) {
  if (score >= 70) return 'badge-success';
  if (score >= 40) return 'badge-warning';
  return 'badge-danger';
}

function EmployeeTypeBadge({ type }) {
  if (!type) return null;
  const isInternal = type === 'internal';
  return (
    <span className={`badge ${isInternal ? 'badge-success' : 'badge-primary'}`}>
      {isInternal ? <><Building2 size={12} /> Internal</> : <><Globe size={12} /> External</>}
    </span>
  );
}

export function CandidateMatchesPage() {
  const { jobId } = useParams();
  const [matches, setMatches] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const isProject = job?.job_type === 'project';
  const appliedCount = matches.filter((m) => m.application_status === 'applied').length;

  const filteredMatches = filter === 'applied'
    ? matches.filter((m) => m.application_status === 'applied')
    : matches;

  return (
    <PageLayout role="recruiter" title={`Candidates for: ${job?.title || ''}`}>
      {isProject && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--color-success-light)', border: 'none', padding: 12, fontSize: 13, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} /> This is an internal project — internal employees are prioritized in the list below.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={filter === 'all' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          onClick={() => setFilter('all')}
        >
          All ({matches.length})
        </button>
        <button
          className={filter === 'applied' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          onClick={() => setFilter('applied')}
        >
          <CheckCircle2 size={14} /> Applied ({appliedCount})
        </button>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="card">
          <EmptyState icon={Users} title="No candidates yet" message="No candidates match this filter yet." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredMatches.map((m) => (
            <div key={m.match_id} className="card" style={{ border: m.application_status === 'applied' ? '2px solid var(--color-success)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: '65%' }}>
                  {m.candidate_summary ? m.candidate_summary.split('\n')[0] : 'Candidate'}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {m.application_status === 'applied' && (
                    <span className="badge badge-success"><CheckCircle2 size={12} /> Applied</span>
                  )}
                  <EmployeeTypeBadge type={m.candidate_employee_type} />
                  {m.candidate_open_to_internal && (
                    <span className="badge badge-warning" title="This candidate has signaled they're open to internal opportunities">
                      <Sparkles size={12} /> Open to Internal Moves
                    </span>
                  )}
                  <span className={`badge ${scoreColor(m.score)}`}>{m.score}% Match</span>
                </div>
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