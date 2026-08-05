import { useEffect, useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateApi } from '../../api/candidateApi';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await candidateApi.getProfile();
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageLayout role="candidate" title="Profile"><LoadingSpinner /></PageLayout>;

  if (notFound) {
    return (
      <PageLayout role="candidate" title="Profile">
        <div className="card">
          <EmptyState icon={FileText} title="No profile yet" message="Upload your resume first to build your profile." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout role="candidate" title="Profile">
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Resume Summary</div></div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
            {profile.summary || 'No summary available.'}
          </p>
          {profile.resume_blob_url && (
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={14} /> Resume stored: {profile.resume_blob_url.split('/').pop()}
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Skills ({profile.skills?.length || 0})</div>
            </div>
          </div>
          {profile.skills?.length ? (
            <div>
              {profile.skills.map((s) => (
                <span key={s.id} className="skill-tag">
                  {s.name} {s.category && <span style={{ opacity: 0.6 }}>· {s.category}</span>}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No skills identified.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}