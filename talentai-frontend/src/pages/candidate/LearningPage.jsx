import { useEffect, useState } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateApi } from '../../api/candidateApi';

const levelBadge = { beginner: 'badge-success', intermediate: 'badge-warning', advanced: 'badge-danger' };

export function LearningPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await candidateApi.getLearningRecommendations();
        setResources(res.data);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageLayout role="candidate" title="Learning"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="candidate" title="Learning Recommendations">
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: 13 }}>
        Courses to help you close the skill gaps found in your job matches.
      </p>
      {resources.length === 0 ? (
        <div className="card">
          <EmptyState icon={BookOpen} title="No recommendations yet" message="You're fully matched on your current jobs, or no matches exist yet." />
        </div>
      ) : (
        <div className="grid grid-3">
          {resources.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span className="badge badge-primary">{r.skill_name}</span>
                <span className={`badge ${levelBadge[r.level] || 'badge-neutral'}`}>{r.level}</span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>{r.provider}</div>
              {r.explanation && (
                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                  {r.explanation}
                </p>
              )}
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  View Resource <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}