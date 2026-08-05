import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { recruiterApi } from '../../api/recruiterApi';
import { useAuth } from '../../hooks/useAuth';

export function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await recruiterApi.listMyJobs();
      setJobs(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <PageLayout role="recruiter" title="Dashboard"><LoadingSpinner /></PageLayout>;

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const draftJobs = jobs.filter((j) => j.status === 'draft').length;

  return (
    <PageLayout role="recruiter" title="Dashboard">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Manage your job postings and find great candidates.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-primary"><PlusCircle size={16} /> Post a Job</Link>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon"><Briefcase size={20} /></div>
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Postings</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-value">{openJobs}</div>
          <div className="stat-label">Open Positions</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><Briefcase size={20} /></div>
          <div className="stat-value">{draftJobs}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Postings</div>
          <Link to="/recruiter/jobs" className="btn btn-secondary btn-sm">View All <ArrowRight size={14} /></Link>
        </div>
        {jobs.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No jobs posted yet.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Required Skills</th></tr></thead>
            <tbody>
              {jobs.slice(0, 5).map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 600 }}>{j.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{j.job_type}</td>
                  <td><span className={`badge ${j.status === 'open' ? 'badge-success' : 'badge-neutral'}`}>{j.status}</span></td>
                  <td>{j.required_skills.length} skills</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageLayout>
  );
}