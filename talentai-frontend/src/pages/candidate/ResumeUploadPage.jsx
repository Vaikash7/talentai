import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { candidateApi } from '../../api/candidateApi';

export function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await candidateApi.uploadResume(file);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try a PDF or DOCX file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout role="candidate" title="My Resume">
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Upload Your Resume</div>
            <div className="card-subtitle">PDF or DOCX — we'll extract your skills automatically</div>
          </div>
        </div>

        <div
          onClick={() => inputRef.current.click()}
          style={{
            border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
            padding: '40px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16,
            background: 'var(--color-bg)',
          }}
        >
          <UploadCloud size={36} color="var(--color-primary)" style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {file ? file.name : 'Click to choose a file'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>PDF or DOCX, up to 10MB</div>
          <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

        <button className="btn btn-primary btn-block" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Processing...' : 'Upload & Analyze'}
        </button>

        {result && (
          <div style={{ marginTop: 24, padding: 16, background: 'var(--color-success-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--color-success)', marginBottom: 12 }}>
              <CheckCircle size={18} /> Resume processed successfully
            </div>
            <div style={{ fontSize: 13, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
              <FileText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Extracted {result.extracted_skills.length} skills:
            </div>
            <div>
              {result.extracted_skills.map((s) => (
                <span key={s} className="skill-tag matched">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}