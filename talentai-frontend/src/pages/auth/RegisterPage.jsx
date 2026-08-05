import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Sparkles size={26} /> TalentAI</div>
        <div className="auth-subtitle">Create your account</div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, background: 'var(--color-danger-light)', padding: '10px 12px', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: 13 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="full_name" required value={form.full_name} onChange={handleChange} placeholder="Jane Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" required value={form.password} onChange={handleChange} placeholder="At least 8 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select className="form-select" name="role" value={form.role} onChange={handleChange}>
              <option value="candidate">Candidate — looking for opportunities</option>
              <option value="recruiter">Recruiter — hiring talent</option>
            </select>
          </div>

          {form.role === 'candidate' && (
            <div className="form-group">
              <label className="form-label">Candidate Type</label>
              <select className="form-select" name="employee_type" value={form.employee_type} onChange={handleChange}>
                <option value="external">External Candidate — applying from outside the organization</option>
                <option value="internal">Internal Employee — currently employed, exploring internal opportunities</option>
              </select>
            </div>
          )}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}