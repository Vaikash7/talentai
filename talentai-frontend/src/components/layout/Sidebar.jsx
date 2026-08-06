import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, User, Target, BookOpen, TrendingUp,
  Briefcase, PlusCircle, Users, BarChart3, Sparkles, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = {
  candidate: [
    { to: '/candidate', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/candidate/resume', label: 'My Resume', icon: Upload },
    { to: '/candidate/profile', label: 'Profile', icon: User },
    { to: '/candidate/matches', label: 'Job Matches', icon: Target },
    { to: '/candidate/learning', label: 'Learning', icon: BookOpen },
    { to: '/candidate/career', label: 'Career Path', icon: TrendingUp },
  ],
  recruiter: [
    { to: '/recruiter', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/recruiter/jobs', label: 'My Jobs', icon: Briefcase },
    { to: '/recruiter/jobs/new', label: 'Post a Job', icon: PlusCircle },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stats', label: 'Platform Stats', icon: BarChart3 },
  ],
};

export function Sidebar({ role, collapsed, onToggle }) {
  const items = NAV_ITEMS[role] || [];
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-badge"><Sparkles size={17} /></span>
        {!collapsed && <span>TalentAI</span>}
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={19} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={19} />
          {!collapsed && <span>Logout</span>}
        </button>
        <button className="icon-btn" onClick={onToggle} style={{ width: '100%', justifyContent: 'center' }}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}