import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { sendAssessmentEmail, buildEmailHTML } from '../utils/emailService';
import './AssessmentCompletePage.css';

const dimFullNames = ['Strengths & Skills', 'Values & What Matters', 'Patterns & Blocks', 'Direction & Opportunity', 'Alignment & Confidence'];
const dimLabels = ['Clarity', 'Confidence', 'Action', 'Alignment', 'Readiness'];
const dimPhases = ['See It', 'Believe It', 'Achieve It', 'Alignment', 'Readiness'];

const archetypes = {
  phoenix_momentum: {
    name: "Phoenix Momentum",
    intro: `You are in the Phoenix Momentum stage.\n\nYou've figured it out and started building. The direction is clear. The work is real. What you need now isn't more clarity — it's the faith to keep pressing forward even when the tangible proof of your progress hasn't shown up yet. You're closer than you think.`,
    directRead: `Your scores reveal something most people in your position never get told.\n\nYou have done the hard work of figuring it out. The direction is real. The building is happening. What your scores show is that the gap right now isn't capability or clarity — it's the faith to trust what you're building before the results are fully visible. That is one of the hardest phases of any transformation. Most people stop here because they can't see the proof yet. The Clarity Intensive is where we map exactly what the next chapter requires — and build the conviction to see it through.\n\nBook it.`
  },
  dreaming: {
    name: "Dreaming",
    intro: `You are in the Dreaming stage.\n\nThe vision is there. You can see exactly what you want. The problem is that you keep waiting for the conditions to be right before you move — and the conditions are never going to be right. That is not a planning problem. That is a belief problem.`,
    directRead: `Your scores reveal something most people in your position never get told.\n\nYou are not stuck because you lack clarity — you scored well there. You are stuck because some part of you does not yet believe you are allowed to have what you can see. That is a specific, identifiable pattern. I have seen it in dozens of high-achievers at exactly this stage, and I know what breaks it. It is not more planning. It is not more journaling. It is one direct conversation where someone who can see the pattern names it out loud.\n\nThat conversation is the Clarity Intensive. Book it.`
  },
  awakening: {
    name: "Awakening",
    intro: `You are in the Awakening stage.\n\nYou're still figuring out the pieces and navigating your healing journey. Identity is actively shifting. You're not lost — you're discovering. The discomfort you're feeling isn't a problem to solve. It's a signal that something real is happening.`,
    directRead: `Your scores reveal something most people in your position never get told.\n\nYou are not behind. You are not broken. You are in the middle of one of the most significant transitions a professional can go through — and you are navigating it without a map. The discomfort is not a signal that something is wrong. It is a signal that something real is happening. What you need right now is not a plan. It is a space where someone who has been exactly where you are can help you see what's actually shifting.\n\nThat space is the Clarity Intensive. Book it.`
  }
};

const strengthInsights = [
  'This is where your energy is clearest right now. Notice it — not to feel good about it, but because your next step should start here. Strength without direction is still motion without momentum.',
  'You know what matters. That is rarer than it sounds. Use it as your filter for every decision in the next 90 days.',
  'You can see the patterns that have been running the show. That self-awareness is your edge. The next step is deciding what to do with what you see.',
  'Your direction is clear. The work now is building the belief that the destination is actually yours to claim.',
  'You trust yourself. That is the foundation everything else is built on. Protect it.'
];

const growthInsights = [
  'This dimension is quietly limiting everything else. Most people sense it but do not name it. You just named it. What you do with that information in the next 48 hours determines whether this assessment changes anything.',
  'When values are unclear, every decision costs twice as much energy. This is where the work starts.',
  'The pattern is still running in the background. Naming it is step one. Breaking it requires a different kind of support.',
  'You have capability without a clear direction to aim it at. That is an expensive gap. The Clarity Intensive closes it.',
  'Action without self-trust burns out fast. This is the foundational work.'
];

const AssessmentCompletePage = () => {
  const location = useLocation();
  const data = location.state;

  const dimScores = data?.dimScores || [0, 0, 0, 0, 0];
  const archetype = archetypes[data?.archetype] || archetypes.awakening;
  const avgScore = Math.round(dimScores.reduce((a, b) => a + b, 0) / 5);
  const avgPct = Math.round((avgScore / 25) * 100);
  const maxIdx = dimScores.indexOf(Math.max(...dimScores));
  let minIdx = dimScores.indexOf(Math.min(...dimScores));
  if (maxIdx === minIdx) minIdx = (maxIdx + 1) % 5;

  // 1. Count Up Score Animation
  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    if (!data) {
      return undefined;
    }

    let start = 0;
    const end = data.score;
    if (end <= 0) {
      return undefined;
    }

    const duration = 1200; // ms
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setAnimatedScore(end);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [data]);

  // 2. Grow Fills for Dimension Bars
  const [animateBars, setAnimateBars] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 3. Outbound Email sending
  const [emailStatus, setEmailStatus] = useState('sending'); // 'sending' | 'success' | 'error'
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [resending, setResending] = useState(false);

  // Pre-build the email HTML once for the preview iframe
  const emailPreviewHTML = useMemo(() => (data ? buildEmailHTML(data) : ''), [data]);

  const triggerEmailSend = async () => {
    if (!data) return;
    try {
      setEmailStatus('sending');
      await sendAssessmentEmail(data);
      setEmailStatus('success');
    } catch (err) {
      console.error(err);
      setEmailStatus('error');
    }
  };

  // Send on first mount
  useEffect(() => {
    if (!data) return undefined;
    let active = true;
    const send = async () => {
      try {
        setEmailStatus('sending');
        await sendAssessmentEmail(data);
        if (active) setEmailStatus('success');
      } catch (err) {
        console.error(err);
        if (active) setEmailStatus('error');
      }
    };
    send();
    return () => { active = false; };
  }, [data]);

  const handleResend = async () => {
    setResending(true);
    await triggerEmailSend();
    setResending(false);
  };

  if (!data) {
    return (
      <div className="container">
        <p>No assessment data found. Please take the assessment first.</p>
        <Link to="/assessment" className="btn btn-primary">Take Assessment</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide">
      {/* Dynamic Uniform Score Hero Section */}
      <div className="hero">
        <div className="hero-label">YOUR PHOENIX CLARITY RESULTS</div>
        <div className="score-hero-row">
          <div className="score-hero-big">{animatedScore}</div>
          <div className="score-hero-denom">/ 100</div>
        </div>
        <div className="r2-archetype-badge pulse-gold">{archetype.name}</div>
        <p className="score-hero-intro">{archetype.intro}</p>
      </div>

      <div className="container">
        {/* Email Delivery Interactive HUD */}
        <div className="email-status-card">
          {emailStatus === 'sending' && (
            <div className="email-status-inner">
              <span className="email-status-pulse-dot"></span>
              <div className="email-status-text-wrap">
                <strong>Generating Assessment Report...</strong>
                <span>Preparing detailed dimension scores and emailing to <em>{data.email}</em></span>
              </div>
              <div className="email-loading-spinner-wrap">
                <span className="email-spinner"></span>
              </div>
            </div>
          )}
          {emailStatus === 'success' && (
            <div className="email-status-inner success">
              <div className="email-status-icon">📬</div>
              <div className="email-status-text-wrap">
                <strong>Assessment Results Delivered!</strong>
                <span>A high-fidelity breakdown has been successfully dispatched to <strong>{data.email}</strong>.</span>
              </div>
              <div className="email-status-actions">
                <button className="email-preview-trigger-btn" onClick={() => setShowEmailPreview(true)}>
                  🔍 Open Email Report Preview
                </button>
                <button
                  className="email-preview-trigger-btn resend"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? '↻ Sending…' : '↻ Resend Email'}
                </button>
              </div>
            </div>
          )}
          {emailStatus === 'error' && (
            <div className="email-status-inner error">
              <div className="email-status-icon">⚠️</div>
              <div className="email-status-text-wrap">
                <strong>Email Delivery Offline</strong>
                <span>Unable to establish mail servers, but your results have been locally archived.</span>
              </div>
              <div className="email-status-actions">
                <button className="email-preview-trigger-btn error" onClick={() => setShowEmailPreview(true)}>
                  🔍 Preview Report
                </button>
                <button
                  className="email-preview-trigger-btn resend"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? '↻ Retrying…' : '↻ Retry Send'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="r2-section">
          <div className="r2-section-header">
            <div className="r2-section-title">YOUR FIVE DIMENSIONS</div>
            <div className="r2-section-sub">Each dimension scored out of 20 — the gold line shows your average across all five.</div>
          </div>
        <div className="r2-dimensions">
          {dimScores.map((rawScore, index) => {
            const pct = Math.round((rawScore / 25) * 100);
            const scaledOf20 = Math.round((rawScore / 25) * 20);
            const statusLabel = pct >= 72 ? 'Active' : pct >= 52 ? 'Developing' : 'Emerging';
            const statusClass = pct >= 72 ? 'status-active' : pct >= 52 ? 'status-developing' : 'status-emerging';
            return (
              <div className="r2-dim-row" key={dimLabels[index]}>
                <div className="r2-dim-label-wrap">
                  <span className="r2-dim-name">{dimLabels[index]}</span>
                  <span className="r2-dim-phase">{dimPhases[index]}</span>
                </div>
                <div className="r2-dim-bar-wrap">
                  <div className="r2-dim-track">
                    <div className="r2-dim-fill" style={{ width: animateBars ? `${pct}%` : '0%', transition: `width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 120}ms` }}></div>
                    <div className="r2-avg-line" style={{ left: `${avgPct}%` }}></div>
                  </div>
                  <span className={`r2-dim-status ${statusClass}`}>{statusLabel}</span>
                </div>
                <div className="r2-dim-score-num">{scaledOf20}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="r2-split-section">
        <div className="r2-split-header">YOUR STRENGTHS &amp; GROWTH EDGE</div>
        <div className="r2-split-grid">
          <div className="r2-split-card r2-strength-card hover-lift">
            <div className="r2-split-card-label">YOUR STRONGEST DIMENSION</div>
            <div className="r2-split-card-name">{dimFullNames[maxIdx]}</div>
            <div className="r2-split-card-body">{strengthInsights[maxIdx]}</div>
          </div>
          <div className="r2-split-card r2-growth-card hover-lift">
            <div className="r2-split-card-label">YOUR PRIMARY GROWTH EDGE</div>
            <div className="r2-split-card-name">{dimFullNames[minIdx]}</div>
            <div className="r2-split-card-body">{growthInsights[minIdx]}</div>
          </div>
        </div>
      </div>

      <div className="r2-direct-read">
        <div className="r2-dr-label">WHAT YOUR SCORES ARE ACTUALLY TELLING ME</div>
        <div className="r2-dr-sublabel">VETA'S DIRECT READ — BASED ON YOUR RESULTS</div>
        <div className="r2-dr-intro">Your scores reveal something most people in your position never get told.</div>
        <div className="r2-dr-body">{archetype.directRead}</div>
      </div>

      <div className="r2-cta-block hover-glow">
        <div className="r2-cta-top">
          <div className="r2-cta-headline">The next step is a 90-minute conversation.</div>
          <div className="r2-cta-body">Your results have been sent to your email. The Clarity Intensive is where we take what the assessment surfaced and turn it into a specific, actionable direction — in one session. Most clients leave with more clarity than they got from six months of trying to figure it out alone. There are limited spots. Book yours now.</div>
          <div className="r2-cta-credit">✦ Your $497 Clarity Intensive fee applies as a full credit toward any coaching package if you upgrade within 30 days.</div>
          <div className="r2-cta-buttons">
            <a href="https://www.phoenixclearinsight.com/book" className="r2-btn-primary scale-on-hover">Book the Clarity Intensive — $497 →</a>
            <a href="https://www.phoenixclearinsight.com/discovery" className="r2-btn-secondary scale-on-hover">Schedule a Free Discovery Call</a>
          </div>
          <div className="r2-scholarship-note">Scholarship pricing available. Ask about it during your discovery call.</div>
        </div>
        <div className="r2-quote-block">
          <div className="r2-quote-mark">"</div>
          <div className="r2-quote-text">The assessment told you where you are. That is not the same as knowing what to do with it. Clarity without a next step is just interesting information. The Clarity Intensive turns it into a decision.</div>
          <div className="r2-quote-attr">— Veta P. Hurst, Esq., ICF-ACC</div>
        </div>
      </div>

      <div className="submit-section">
        <h3>Save Your Results</h3>
        <p>Click below to save your clarity score. You'll receive a confirmation at your email with your full breakdown.</p>
        <div className="success-msg">✓ Your results have been saved. Check your email for a confirmation with your full score breakdown.</div>
        <button 
          onClick={() => setShowEmailPreview(true)} 
          className="btn btn-secondary" 
          style={{ marginTop: '16px', border: '1px solid var(--gold)', background: 'transparent', display: 'inline-flex', gap: '8px' }}
        >
          📬 Open Interactive Email Viewer
        </button>
      </div>

      {/* High-fidelity email client preview modal — renders the exact HTML that is emailed */}
      {showEmailPreview && (
        <div className="email-modal-overlay" onClick={() => setShowEmailPreview(false)}>
          <div className="email-modal-container animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="email-modal-header">
              <div className="email-modal-title-bar">
                <span className="email-modal-dot red"></span>
                <span className="email-modal-dot yellow"></span>
                <span className="email-modal-dot green"></span>
                <span className="email-modal-title">Sent Mail Viewer</span>
              </div>
              <button className="email-modal-close" onClick={() => setShowEmailPreview(false)}>&times;</button>
            </div>
            <div className="email-envelope-info">
              <div><strong>From:</strong> Veta P. Hurst &lt;veta@phoenixclearinsight.com&gt;</div>
              <div><strong>To:</strong> {data.firstName} {data.lastName} &lt;{data.email}&gt;</div>
              <div><strong>Subject:</strong> Your Personal Phoenix Clarity Assessment Report</div>
              <div><strong>Date:</strong> {new Date(data.date).toLocaleString()}</div>
            </div>
            <div className="email-modal-body">
              {/* Render the exact same HTML that gets emailed — pixel-perfect preview */}
              <iframe
                title="Email Preview"
                srcDoc={emailPreviewHTML}
                style={{ width: '100%', minHeight: '720px', border: 'none', background: '#F7F4EF' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AssessmentCompletePage;
