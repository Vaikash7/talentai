import { Link } from 'react-router-dom';
import { Sparkles, Target, BookOpen, TrendingUp, Briefcase, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const FEATURES = [
  { icon: Target, title: 'Smart job matching', desc: 'Matched to jobs and internal projects based on real skills — with a transparent, explainable score.', grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { icon: TrendingUp, title: 'Career path guidance', desc: 'See exactly how ready you are for your next role, across 7 real career tracks.', grad: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { icon: BookOpen, title: 'Learning recommendations', desc: 'Close skill gaps with curated resources, matched to what you actually need next.', grad: 'linear-gradient(135deg, #10b981, #22c55e)' },
  { icon: Briefcase, title: 'Internal mobility', desc: 'Internal employees get priority visibility on internal projects — grow without leaving.', grad: 'linear-gradient(135deg, #f59e0b, #f97316)' },
];

const AUDIENCES = [
  { role: 'Candidates', color: '#8b5cf6', points: ['Upload resume, get matched instantly', 'Track career readiness across tracks', 'Personalized learning paths'] },
  { role: 'Recruiters', color: '#3b82f6', points: ['Post jobs and internal projects', 'Ranked, explainable candidate matches', 'Internal-first mobility prioritization'] },
  { role: 'Admins', color: '#f97316', points: ['Platform-wide visibility', 'User and skills management', 'Real-time statistics'] },
];

export function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0b0b1a', color: 'white', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        .land-btn { transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease; }
        .land-btn:hover { transform: translateY(-2px); }
        .land-btn-primary:hover { box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
        .land-btn-ghost:hover { background: rgba(255,255,255,0.14) !important; }
        .land-nav-link:hover { background: rgba(255,255,255,0.08); }
        .land-feature-card { transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
        .land-feature-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.07); }
        .land-feature-icon { transition: transform 0.2s ease; }
        .land-feature-card:hover .land-feature-icon { transform: scale(1.08) rotate(-4deg); }
        .land-audience-card { transition: transform 0.2s ease, background 0.2s ease; }
        .land-audience-card:hover { transform: translateY(-4px); background: rgba(255,255,255,0.07); }
        .land-cta-btn { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .land-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.35); }
        .land-gradient-text { background-size: 200% auto; animation: land-shine 6s ease-in-out infinite; }
        @keyframes land-shine {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .land-orb { animation: land-pulse 5s ease-in-out infinite; }
        @keyframes land-pulse {
          0%, 100% { opacity: 0.35; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.08); }
        }
      `}</style>

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', position: 'sticky', top: 0, background: 'rgba(11,11,26,0.85)',
        backdropFilter: 'blur(8px)', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 800 }}>
          <span style={{
            width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Sparkles size={18} /></span>
          TalentAI
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="land-btn land-nav-link" style={{ padding: '9px 18px', borderRadius: 8, color: 'white', fontWeight: 600, fontSize: 14 }}>Sign in</Link>
          <Link to="/register" className="land-btn land-btn-primary" style={{
            padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, color: 'white',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          }}>Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 40px 120px', textAlign: 'center' }}>
        <div className="land-orb" style={{
          position: 'absolute', top: -120, left: '50%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)',
            padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 28, color: '#f472b6',
          }}>
            <Zap size={14} /> Built for Designathon 2026
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 22, maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
            Find the right talent{' '}
            <span className="land-gradient-text" style={{
              background: 'linear-gradient(90deg, #818cf8, #f472b6, #fb923c, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>internally and externally</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            TalentAI matches candidates and employees to jobs, internal projects, learning
            opportunities, and career paths — based on real skills, not guesswork.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="land-btn land-btn-primary" style={{
              padding: '15px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="land-btn land-btn-ghost" style={{
              padding: '15px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, color: 'white',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '20px 40px 90px', maxWidth: 1140, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
          Everything a talent marketplace needs
        </h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)', marginBottom: 50, fontSize: 15 }}>
          Explainable matching, zero external dependency, fully rule-based.
        </p>
        <div className="grid grid-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="land-feature-card" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 22, cursor: 'default',
            }}>
              <div className="land-feature-icon" style={{
                width: 46, height: 46, borderRadius: 12, background: f.grad,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <f.icon size={22} color="white" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15.5 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section style={{ padding: '20px 40px 100px', maxWidth: 1140, margin: '0 auto' }}>
        <div className="grid grid-3">
          {AUDIENCES.map((a) => (
            <div key={a.role} className="land-audience-card" style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${a.color}55`,
              borderRadius: 16, padding: 24, cursor: 'default',
            }}>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, color: a.color }}>{a.role}</div>
              {a.points.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, fontSize: 13.5, color: 'rgba(255,255,255,0.7)' }}>
                  <CheckCircle2 size={16} color={a.color} style={{ flexShrink: 0, marginTop: 1 }} />
                  {p}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 40px 60px', borderRadius: 24, padding: '60px 20px', textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to get started?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>Join as a candidate or recruiter in under a minute.</p>
        <Link to="/register" className="land-cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 34px', borderRadius: 10,
          fontWeight: 700, fontSize: 15, color: '#4338ca', background: 'white',
        }}>
          Get started — it's free <ArrowRight size={18} />
        </Link>
      </section>

      <footer style={{ textAlign: 'center', padding: '28px', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        TalentAI — AI-Powered Recruitment & Talent Marketplace · Designathon 2026
      </footer>
    </div>
  );
}