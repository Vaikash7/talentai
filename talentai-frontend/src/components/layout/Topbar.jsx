import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, LogOut, ChevronDown } from 'lucide-react';

export function Topbar({ title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            className="user-chip"
            onClick={() => setMenuOpen((o) => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 'var(--radius-md)' }}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-meta">
              <div className="name">{user?.full_name}</div>
              <div className="role">{user?.role}</div>
            </div>
            <ChevronDown size={16} color="var(--color-text-muted)" />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, minWidth: 180,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 50,
            }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'none', color: 'var(--color-danger)', fontSize: 13.5, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-light)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}