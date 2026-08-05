import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-meta">
            <div className="name">{user?.full_name}</div>
            <div className="role">{user?.role}</div>
          </div>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}