import { useEffect, useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { adminApi } from '../../api/adminApi';

const roleBadge = { candidate: 'badge-primary', recruiter: 'badge-success', admin: 'badge-warning' };

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const res = await adminApi.listUsers();
      setUsers(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <PageLayout role="admin" title="Users"><LoadingSpinner /></PageLayout>;

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  return (
    <PageLayout role="admin" title="User Management">
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Users ({filtered.length})</div>
          <select className="form-select" style={{ width: 180 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${roleBadge[u.role] || 'badge-neutral'}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}