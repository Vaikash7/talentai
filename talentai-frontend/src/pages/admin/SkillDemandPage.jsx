import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { adminApi } from '../../api/adminApi';

function gapBadge(gap) {
  if (gap > 0) return { className: 'badge-danger', icon: TrendingUp, label: `Shortage of ${gap}` };
  if (gap < 0) return { className: 'badge-success', icon: TrendingDown, label: `Surplus of ${Math.abs(gap)}` };
  return { className: 'badge-neutral', icon: Minus, label: 'Balanced' };
}

export function SkillDemandPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.getSkillDemand();
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageLayout role="admin" title="Skill Demand Heatmap"><LoadingSpinner /></PageLayout>;

  const shortages = data.filter((d) => d.gap > 0).length;
  const maxDemand = Math.max(...data.map((d) => d.demand_count), 1);

  return (
    <PageLayout role="admin" title="Skill Demand Heatmap">
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20, fontSize: 13 }}>
        Aggregate view of skill demand (open job postings) versus supply (candidate skills) — surfaces organization-wide workforce planning gaps.
      </p>

      {shortages > 0 && (
        <div className="card" style={{ marginBottom: 20, background: 'var(--color-danger-light)', border: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: 14 }}>
          <AlertTriangle size={18} color="var(--color-danger)" />
          <span style={{ fontSize: 13.5, color: 'var(--color-danger)', fontWeight: 600 }}>
            {shortages} skill{shortages !== 1 ? 's' : ''} currently in shortage across open job postings.
          </span>
        </div>
      )}

      {data.length === 0 ? (
        <div className="card">
          <EmptyState icon={TrendingUp} title="No data yet" message="Post some open jobs with required skills to see demand data." />
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Demand (Open Jobs)</th>
                <th>Supply (Candidates)</th>
                <th>Internal Supply</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => {
                const badge = gapBadge(d.gap);
                const Icon = badge.icon;
                return (
                  <tr key={d.skill_id}>
                    <td style={{ fontWeight: 600 }}>
                      {d.skill_name}
                      {d.category && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 6 }}>({d.category})</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-track" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${(d.demand_count / maxDemand) * 100}%`, background: 'var(--color-danger)' }}></div>
                        </div>
                        <span style={{ fontSize: 13 }}>{d.demand_count}</span>
                      </div>
                    </td>
                    <td>{d.supply_count}</td>
                    <td>{d.internal_supply_count}</td>
                    <td>
                      <span className={`badge ${badge.className}`}>
                        <Icon size={12} /> {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}