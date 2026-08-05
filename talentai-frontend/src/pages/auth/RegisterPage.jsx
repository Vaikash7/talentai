import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'candidate', employee_type: 'external' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role !== 'candidate') {
        delete payload.employee_type;
      }
      const user = await register(payload);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white',
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.7)' };

  return (
    <div style={{
      minHeight: '100vh', background: '#0b0b1a', color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        .auth-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .auth-input:focus { outline: none; border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
        .auth-select { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .auth-select:focus { outline: none; border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
        .auth-select option { background: #1a1a2e; color: white; }
        .auth-submit { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.06) inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.28), transparent 70%)', pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 440,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: 40, margin: '20px 0',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'white' }}>
          <span style={{
            width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Sparkles size={16} /></span>
          TalentAI
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontSize: 14 }}>Create your account</p>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
            padding: '10px 14px', borderRadius: 10, color: '#fca5a5', fontSize: 13,
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Full Name</label>
            <input className="auth-input" name="full_name" autoComplete="off" required value={form.full_name} onChange={handleChange} placeholder="Jane Doe" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input className="auth-input" type="email" name="email" autoComplete="off" required value={form.email} onChange={handleChange} placeholder="you@company.com" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Password</label>
            <input className="auth-input" type="password" name="password" autoComplete="new-password" required value={form.password} onChange={handleChange} placeholder="At least 8 characters" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>I am a...</label>
            <select className="auth-select" name="role" value={form.role} onChange={handleChange} style={inputStyle}>
              <option value="candidate">Candidate — looking for opportunities</option>
              <option value="recruiter">Recruiter — hiring talent</option>
            </select>
          </div>

          {form.role === 'candidate' && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Candidate Type</label>
              <select className="auth-select" name="employee_type" value={form.employee_type} onChange={handleChange} style={inputStyle}>
                <option value="external">External Candidate</option>
                <option value="internal">Internal Employee</option>
              </select>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                {form.employee_type === 'internal'
                  ? 'You currently work at the organization and are exploring internal opportunities.'
                  : 'You are applying from outside the organization.'}
              </div>
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, color: 'white',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a5b4fc', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}