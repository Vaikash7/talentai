import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminApi.getStats();
      setStats(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <PageLayout role="admin" title="Dashboard"><LoadingSpinner /></PageLayout>;

  return (
    <PageLayout role="admin" title="Dashboard">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome, {user?.full_name?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>Platform overview and management.</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-violet-light)', color: 'var(--color-violet)' }}><Users size={20} /></div>
          <div className="stat-value">{stats.total_users}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-blue-light)', color: 'var(--color-blue)' }}><Briefcase size={20} /></div>
          <div className="stat-value">{stats.total_jobs}</div>
          <div className="stat-label">Total Jobs ({stats.total_open_jobs} open)</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}><Layers size={20} /></div>
          <div className="stat-value">{stats.total_skills}</div>
          <div className="stat-label">Skills Catalog</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}><BookOpen size={20} /></div>
          <div className="stat-value">{stats.total_learning_resources}</div>
          <div className="stat-label">Learning Resources</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">User Breakdown</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Candidates</span>
              <span className="badge badge-primary">{stats.total_candidates}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Recruiters</span>
              <span className="badge badge-primary">{stats.total_recruiters}</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Manage</div>
          </div>
          <Link to="/admin/users" className="btn btn-secondary btn-block" style={{ marginBottom: 10 }}>
            View All Users <ArrowRight size={14} />
          </Link>
          <Link to="/admin/stats" className="btn btn-secondary btn-block">
            Platform Statistics <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}