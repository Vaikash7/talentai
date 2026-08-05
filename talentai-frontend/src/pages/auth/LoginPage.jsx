import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0b0b1a', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        .auth-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .auth-input:focus { outline: none; border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
        .auth-submit { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: 40,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'white' }}>
          <span style={{
            width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Sparkles size={16} /></span>
          TalentAI
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontSize: 14 }}>Sign in to your account</p>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
            padding: '10px 14px', borderRadius: 10, color: '#fca5a5', fontSize: 13,
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.7)' }}>Email</label>
            <input
              className="auth-input" type="email" name="email" required
              value={form.email} onChange={handleChange} placeholder="you@company.com"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.7)' }}>Password</label>
            <input
              className="auth-input" type="password" name="password" required
              value={form.password} onChange={handleChange} placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white',
              }}
            />
          </div>
          <button className="auth-submit" type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, color: 'white',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#a5b4fc', fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}