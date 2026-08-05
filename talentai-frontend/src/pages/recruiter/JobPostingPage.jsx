import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { recruiterApi } from '../../api/recruiterApi';

export function JobPostingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', job_type: 'job', experience_required: '', status: 'open',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const name = skillInput.trim();
    if (!name || skills.includes(name)) return;
    setSkills([...skills, name]);
    setMandatorySkills([...mandatorySkills, name]); // default mandatory
    setSkillInput('');
  };

  const removeSkill = (name) => {
    setSkills(skills.filter((s) => s !== name));
    setMandatorySkills(mandatorySkills.filter((s) => s !== name));
  };

  const toggleMandatory = (name) => {
    setMandatorySkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setSubmitting(true);
    try {
      await recruiterApi.createJob({
        ...form,
        experience_required: form.experience_required ? parseInt(form.experience_required) : null,
        required_skills: skills,
        mandatory_skills: mandatorySkills,
      });
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout role="recruiter" title="Post a Job">
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 720 }}>
        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Backend Developer" />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" name="job_type" value={form.job_type} onChange={handleChange}>
              <option value="job">External Job</option>
              <option value="project">Internal Project</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Experience Required (years)</label>
            <input className="form-input" type="number" min="0" name="experience_required" value={form.experience_required} onChange={handleChange} placeholder="e.g. 2" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" rows={5} name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and expectations..." />
        </div>

        <div className="form-group">
          <label className="form-label">Required Skills</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              className="form-input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Python" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button type="button" className="btn btn-secondary" onClick={addSkill}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map((s) => (
              <span key={s} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {s}
                <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={mandatorySkills.includes(s)} onChange={() => toggleMandatory(s)} />
                  required
                </label>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)} />
              </span>
            ))}
          </div>
          <div className="form-hint">Check "required" for must-have skills; uncheck for nice-to-haves.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange}>
            <option value="draft">Draft (not visible to candidates)</option>
            <option value="open">Open (visible to candidates)</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          <CheckCircle size={16} /> {submitting ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </PageLayout>
  );
}