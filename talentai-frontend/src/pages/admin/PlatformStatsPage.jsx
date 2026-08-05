import { useEffect, useState } from 'react';
import { Users, Briefcase, Layers, BookOpen, UserCheck, Building2 } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { adminApi } from '../../api/adminApi';

export function PlatformStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminApi.getStats();
      setStats(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <PageLayout role="admin" title="Platform Stats"><LoadingSpinner /></PageLayout>;

  const cards = [
    { label: 'Total Users', value: stats.total_users, icon: Users },
    { label: 'Candidates', value: stats.total_candidates, icon: UserCheck },
    { label: 'Recruiters', value: stats.total_recruiters, icon: Building2 },
    { label: 'Total Jobs', value: stats.total_jobs, icon: Briefcase },
    { label: 'Open Jobs', value: stats.total_open_jobs, icon: Briefcase },
    { label: 'Skills in Catalog', value: stats.total_skills, icon: Layers },
    { label: 'Learning Resources', value: stats.total_learning_resources, icon: BookOpen },
  ];

  return (
    <PageLayout role="admin" title="Platform Statistics">
      <div className="grid grid-4">
        {cards.map((c) => (
          <div key={c.label} className="card stat-card">
            <div className="stat-icon"><c.icon size={20} /></div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}