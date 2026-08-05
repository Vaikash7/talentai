import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Trash2, Users, PlusCircle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { recruiterApi } from '../../api/recruiterApi';

export function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadJobs = async () => {
    const res = await recruiterApi.listMyJobs();
    setJobs(res.data);
    setLoading(false);
  };

  useEffect(() => { loadJobs(); }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    await recruiterApi.deleteJob(jobId);
    loadJobs();
  };

  if (loading) return <PageLayout role="recruiter" title="My Jobs"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="recruiter" title="My Jobs">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Link to="/recruiter/jobs/new" className="btn btn-primary"><PlusCircle size={16} /> Post a Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <EmptyState icon={Briefcase} title="No jobs posted yet" message="Post your first job to start finding candidates." />
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Experience</th><th>Status</th><th>Skills</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 600 }}>{j.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{j.job_type}</td>
                  <td>{j.experience_required ?? '—'} yrs</td>
                  <td><span className={`badge ${j.status === 'open' ? 'badge-success' : j.status === 'draft' ? 'badge-neutral' : 'badge-danger'}`}>{j.status}</span></td>
                  <td>
                    {j.required_skills.slice(0, 3).map((s) => (
                      <span key={s.id} className="skill-tag">{s.name}</span>
                    ))}
                    {j.required_skills.length > 3 && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>+{j.required_skills.length - 3} more</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/recruiter/jobs/${j.id}/matches`)}>
                        <Users size={14} /> Matches
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(j.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}