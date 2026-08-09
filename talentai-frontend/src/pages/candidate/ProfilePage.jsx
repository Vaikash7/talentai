import { useEffect, useState } from 'react';
import { FileText, ExternalLink, Building2, Globe, Users } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { candidateApi } from '../../api/candidateApi';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);

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

  const handleToggle = async () => {
    setUpdating(true);
    try {
      const res = await candidateApi.updateOpenToInternal(!profile.open_to_internal_opportunities);
      setProfile(res.data);
    } finally {
      setUpdating(false);
    }
  };

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

  const isInternal = profile.employee_type === 'internal';

  return (
    <PageLayout role="candidate" title="Profile">
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <span className={`badge ${isInternal ? 'badge-success' : 'badge-primary'}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {isInternal ? <><Building2 size={14} /> Internal Employee</> : <><Globe size={14} /> External Candidate</>}
        </span>
      </div>

      {isInternal && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div className="stat-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)', flexShrink: 0 }}>
                <Users size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Open to Internal Opportunities</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Let recruiters know you're available for internal mobility, without formally applying to any specific role.
                </div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              disabled={updating}
              style={{
                width: 52, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: profile.open_to_internal_opportunities ? 'var(--color-success)' : 'var(--color-border-strong)',
                position: 'relative', transition: 'background 0.2s ease',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: profile.open_to_internal_opportunities ? 25 : 3,
                width: 24, height: 24, borderRadius: '50%', background: 'white', transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Resume Summary</div></div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
            {profile.summary || 'No summary available. Upload a resume to add one.'}
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
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No skills identified yet.</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
}