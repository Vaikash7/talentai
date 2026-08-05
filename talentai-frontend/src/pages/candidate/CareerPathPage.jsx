import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Target } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { candidateApi } from '../../api/candidateApi';

export function CareerPathPage() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPath, setLoadingPath] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await candidateApi.getCareerTracks();
      setTracks(res.data);
      if (res.data.length) {
        setSelectedTrack(res.data[0].key);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedTrack) return;
    (async () => {
      setLoadingPath(true);
      try {
        const res = await candidateApi.getCareerPath(selectedTrack);
        setPath(res.data);
      } catch (err) {
        setPath(null);
      } finally {
        setLoadingPath(false);
      }
    })();
  }, [selectedTrack]);

  if (loading) return <PageLayout role="candidate" title="Career Path"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="candidate" title="Career Path">
      <div className="card" style={{ marginBottom: 20 }}>
        <label className="form-label">Choose a career track</label>
        <select className="form-select" value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)} style={{ maxWidth: 320 }}>
          {tracks.map((t) => <option key={t.key} value={t.key}>{t.display_name}</option>)}
        </select>
      </div>

      {loadingPath ? (
        <LoadingSpinner />
      ) : path ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {path.stages.map((stage, idx) => (
            <div
              key={stage.role}
              className="card"
              style={{
                border: stage.is_recommended_next ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {stage.is_current_stage ? <CheckCircle2 size={20} color="var(--color-success)" /> : <Circle size={20} color="var(--color-text-muted)" />}
                  <span style={{ fontWeight: 700 }}>{stage.role}</span>
                  {stage.is_recommended_next && <span className="badge badge-primary"><Target size={12} /> Recommended Next</span>}
                  {stage.is_current_stage && <span className="badge badge-success">Current Level</span>}
                </div>
                <span className="badge badge-neutral">{stage.readiness_score}% Ready</span>
              </div>
              <div className="progress-track" style={{ marginBottom: 12 }}>
                <div className="progress-fill" style={{ width: `${stage.readiness_score}%` }}></div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stage.matched_skills.map((s) => <span key={s} className="skill-tag matched">✓ {s}</span>)}
                {stage.missing_skills.map((s) => <span key={s} className="skill-tag gap">✗ {s}</span>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>Select a track to see your career path.</p>
      )}
    </PageLayout>
  );
}