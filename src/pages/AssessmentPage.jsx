import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../db';
import './AssessmentPage.css';


function MobileFieldGroup({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-field-group">
      <button
        type="button"
        className="mobile-field-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mobile-field-title">{title}</span>
        <span className="mobile-field-caret">▾</span>
      </button>

      <div className={`mobile-field-panel ${open ? 'open' : ''}`}>{children}</div>
    </div>
  );
}



const clarityDimensions = [
  "Strengths & Skills",
  "Values & What Matters",
  "Patterns & Blocks",
  "Direction & Opportunity",
  "Alignment & Confidence"
];

const clarityQuestions = [
  { text: "I know what I am genuinely good at and can name my top strengths clearly.", dim: 0 },
  { text: "I use my strengths regularly in my work or daily life.", dim: 0 },
  { text: "Other people often seek me out for my specific expertise or perspective.", dim: 0 },
  { text: "I feel energized, not drained, when I'm using my core skills.", dim: 0 },
  { text: "I can articulate what makes my approach or contribution unique.", dim: 0 },
  { text: "I know what matters most to me and can name my top values.", dim: 1 },
  { text: "My daily choices and actions reflect what I say I care about.", dim: 1 },
  { text: "When something feels wrong, I can identify which value is being compromised.", dim: 1 },
  { text: "I feel a sense of meaning and purpose in how I spend my time.", dim: 1 },
  { text: "I rarely compromise on things that are truly important to me.", dim: 1 },
  { text: "I can identify recurring patterns in my life that have helped me.", dim: 2 },
  { text: "I can name at least one belief or habit that has been holding me back.", dim: 2 },
  { text: "I understand why I tend to react or respond the way I do in stressful situations.", dim: 2 },
  { text: "I have stopped tolerating things in my life that no longer serve me.", dim: 2 },
  { text: "I can see the connection between my past experiences and my current choices.", dim: 2 },
  { text: "I have a clear sense of where I want to go in the next chapter of my life.", dim: 3 },
  { text: "I can see real opportunities available to me right now.", dim: 3 },
  { text: "I know what my next aligned step is, even if I haven't taken it yet.", dim: 3 },
  { text: "I feel excited—not just anxious—about what's ahead.", dim: 3 },
  { text: "I have a vision for my life that feels both meaningful and achievable.", dim: 3 },
  { text: "I trust my own judgment when making important decisions.", dim: 4 },
  { text: "My current life situation reflects who I am becoming, not just who I've been.", dim: 4 },
  { text: "I feel confident moving forward even when I don't have all the answers.", dim: 4 },
  { text: "I believe that what I want is actually possible for me.", dim: 4 },
  { text: "I feel clear, grounded, and ready to take my next step.", dim: 4 },
];

const readinessQuestions = [
  "How clearly does this client see themselves—their values, strengths, and what they want?",
  "When you reflect back what you're hearing about them, how readily do they recognize themselves in it?",
  "How much does this client's sense of worth seem tied to external outcomes (title, approval, achievement)?",
  "How settled does this client seem in their own perspective, even when it's challenged?",
  "To what degree does this client believe they are capable of the change they're describing?",
  "How stable is this client's emotional baseline right now—not perfect, but functional?",
  "How well is this client able to sit with discomfort without needing to escape it immediately?",
  "Does this client appear to have the bandwidth—time, energy, mental space—for transformation work?",
  "How well-supported does this client feel by people in their life?",
  "How would you rate this client's overall emotional readiness to receive coaching feedback?",
  "How clear is this client on WHY they want this transformation—not just that they want it?",
  "How willing does this client seem to do work between sessions—not just show up to calls?",
  "How invested is this client in the process, not just in getting the answer quickly?",
  "How much has this client already demonstrated willingness to change—in their words or actions?",
  "How committed does this client seem to honoring the investment they're making—time, money, energy?",
];

const executionQuestions = [
  "I have been taking consistent action between our coaching sessions.",
  "I complete the homework and reflection exercises my coach assigns.",
  "When I commit to doing something, I follow through on it.",
  "I am making progress on the goals we identified in our early sessions.",
  "I show up to each session having done what I said I would do.",
  "The actions I'm taking come from what I believe, not from what I think I should do.",
  "I can feel the difference between acting from fear and acting from alignment.",
  "I have caught myself operating from an old belief and consciously chosen a different response.",
  "My external actions are starting to match my internal shifts.",
  "I am making decisions that reflect who I am becoming, not who I used to be.",
  "When I hit an obstacle, I find a way through rather than stopping.",
  "I have recovered from at least one setback during this program without giving up.",
  "I can adapt my plan when something isn't working, without losing momentum.",
  "I am learning from what isn't working, not just celebrating what is.",
  "I believe I can sustain this growth beyond the end of our program.",
];

const archetypes = {
  phoenix_momentum: {
    name: "Phoenix Momentum",
  },
  dreaming: {
    name: "Dreaming",
  },
  awakening: {
    name: "Awakening",
  }
};

const determineArchetypeFromClarity = (dimScores) => {
  const strengths = dimScores[0];
  const direction = dimScores[3];
  const alignment = dimScores[4];
  const avgTotal = dimScores.reduce((a, b) => a + b, 0) / 5;
  if (avgTotal < 12) return 'awakening';
  if (alignment < 14 && direction < 14) return 'awakening';
  if (direction >= 18 && alignment < 16) return 'dreaming';
  if (direction >= 17 && strengths < 16) return 'dreaming';
  if (strengths >= 17 && direction >= 16 && alignment >= 14) return 'phoenix_momentum';
  if (avgTotal < 15) return 'awakening';
  if (direction >= 16) return 'dreaming';
  return 'phoenix_momentum';
};

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const share = searchParams.get('share');

  const [activeTab, setActiveTab] = useState(() => {
    if (mode === 'coach') return 'readiness';
    if (share === 'story') return 'testimonial';
    return 'clarity';
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'phoenix2026') {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  if (mode === 'coach' && !isUnlocked) {
    return (
      <div className="coach-lock-overlay">
        <form onSubmit={handlePasswordSubmit} className="coach-lock-card hover-glow">
          <h3>Coach Access</h3>
          <p>Please enter the authorization code to unlock readiness and execution assessments.</p>

          <div className="coach-lock-actions-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              style={{ width: '100%' }}
            >
              ← Back to Landing
            </button>
          </div>

          <div className="form-group">
            <input 
              type="password" 
              placeholder="Enter access code" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              required
            />
          </div>
          {passwordError && <div className="coach-lock-error">Incorrect code. Try again.</div>}
          <button type="submit" className="btn btn-primary scale-on-hover" style={{ width: '100%' }}>Unlock Dashboard</button>
        </form>
      </div>
    );
  }


  const getHeroContent = () => {
    switch (activeTab) {
      case 'clarity':
        return {
          label: "See It · Phase 1 of 3",
          title: <>Clarity <em>Assessment</em></>,
          desc: "Our 25-question assessment measures your score across 5 key dimensions of clarity and readiness."
        };
      case 'testimonial':
        return {
          label: "Client Stories",
          title: <>Share Your <em>Story</em></>,
          desc: "We want to hear about your transition, shift, and breakthroughs."
        };
      case 'readiness':
        return {
          label: "Coach Evaluation",
          title: <>Client <em>Readiness</em></>,
          desc: "Evaluate the client's capacity, emotional baseline, and commitment to the coaching journey."
        };
      case 'execution':
        return {
          label: "Coach Evaluation",
          title: <>Client <em>Execution</em></>,
          desc: "Assess the client's progress, homework completion, and action alignment."
        };
      default:
        return {
          label: "Assessment Portal",
          title: <>Phoenix <em>Assessment</em></>,
          desc: "Discover where you stand and map your next transition."
        };
    }
  };

  const heroContent = getHeroContent();

  return (
    <div className="animate-fade-slide">
      <div className="assessment-tab-nav">
        <button className={`assessment-tab-btn ${activeTab === 'clarity' ? 'active' : ''}`} onClick={() => setActiveTab('clarity')}>Clarity Assessment</button>
        {(isUnlocked || share === 'story') && (
          <button className={`assessment-tab-btn ${activeTab === 'testimonial' ? 'active' : ''}`} onClick={() => setActiveTab('testimonial')}>Share Your Story</button>
        )}
        {isUnlocked && (
          <>
            <button className={`assessment-tab-btn ${activeTab === 'readiness' ? 'active' : ''}`} onClick={() => setActiveTab('readiness')}>Readiness (Coach)</button>
            <button className={`assessment-tab-btn ${activeTab === 'execution' ? 'active' : ''}`} onClick={() => setActiveTab('execution')}>Execution (Coach)</button>
          </>
        )}
      </div>

      <div className="hero">
        <div className="hero-label">{heroContent.label}</div>
        <h1>{heroContent.title}</h1>
        <p>{heroContent.desc}</p>
      </div>

      <div className="container">
        {/* Keep tab components mounted so forms aren't removed when switching tabs */}
        <div style={{ display: activeTab === 'clarity' ? 'block' : 'none' }}>
          <ClarityAssessment navigate={navigate} />
        </div>
        <div style={{ display: activeTab === 'testimonial' ? 'block' : 'none' }}>
          <TestimonialForm navigate={navigate} />
        </div>
        <div style={{ display: activeTab === 'readiness' ? 'block' : 'none' }}>
          <GenericAssessment title="Client Readiness" type="readiness" questions={readinessQuestions} />
        </div>
        <div style={{ display: activeTab === 'execution' ? 'block' : 'none' }}>
          <GenericAssessment title="Client Execution" type="execution" questions={executionQuestions} />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-components
// ----------------------------------------------------

const ClarityAssessment = ({ navigate }) => {
  const [step, setStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', gender: '', source: '', context: '' });
  const [answers, setAnswers] = useState(Array(clarityQuestions.length).fill(null));

  const handleIntakeSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email) setStep(2);
  };

  const calculateScore = () => {
    const total = answers.reduce((acc, val) => acc + (val || 0), 0);
    return Math.round((total / (clarityQuestions.length * 5)) * 100);
  };

  const calculateDimensionScores = () => {
    const dimScores = [0, 0, 0, 0, 0];
    clarityQuestions.forEach((question, index) => {
      dimScores[question.dim] += answers[index] || 0;
    });
    return dimScores;
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const score = calculateScore();
    const dimScores = calculateDimensionScores();
    const archetype = determineArchetypeFromClarity(dimScores);
    const assessmentData = {
      ...formData,
      date: new Date().toISOString(),
      answers,
      score,
      dimScores,
      archetype,
      archetypeName: archetypes[archetype].name
    };
    await db.assessments.add(assessmentData);
    navigate('/assessment-complete', { state: assessmentData });
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      alert('Please select a response before continuing.');
      return;
    }
    if (currentQuestion < clarityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }
    handleSubmit();
  };

  const activeQuestion = clarityQuestions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / clarityQuestions.length) * 100);
  const labels = ['', 'Rarely', 'Occasionally', 'Sometimes', 'Frequently', 'Consistently'];

  return (
    <>
      <div className="hero assessment-hero">
        <div className="hero-label">See It · Phase 1 of 3</div>
        <h1>The Phoenix<br /><em>Clarity Assessment</em></h1>
        <p>25 questions. 7 minutes. A clear picture of where you are—and what your next chapter actually requires.</p>
        <div className="hero-meta">
          <span><span className="dot"></span>25 Questions</span>
          <span><span className="dot"></span>5 Dimensions</span>
          <span><span className="dot"></span>Free · No obligation</span>
        </div>
      </div>

      {step === 1 && (
        <div className="card intake-card animate-intake-card">
          <h3>Before We Begin</h3>
          <p>Tell us a little about yourself. This helps us personalize your results and ensures your clarity score is saved securely.</p>

          <form onSubmit={handleIntakeSubmit}>
            {/* Desktop */}
            <div className="desktop-only">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input required type="text" placeholder="Your first name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input required type="text" placeholder="Your last name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input required type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>How do you identify? (optional)</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Prefer not to say</option>
                  <option>She/Her</option>
                  <option>He/Him</option>
                  <option>They/Them</option>
                  <option>Other / Self-describe</option>
                </select>
              </div>
              <div className="form-group">
                <label>How did you hear about Phoenix?</label>
                <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="">Select one...</option>
                  <option>EPIC Live Stream</option>
                  <option>Referral from friend or colleague</option>
                  <option>Social media (TikTok, Instagram, LinkedIn)</option>
                  <option>Website search</option>
                  <option>Discovery call</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>What brings you here today? (optional)</label>
                <textarea rows="3" placeholder="A few words about what's bringing you to this moment..." value={formData.context} onChange={e => setFormData({...formData, context: e.target.value})}></textarea>
              </div>
            </div>

            {/* Mobile */}
            <div className="mobile-only">
              <MobileFieldGroup title="First & Last Name">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input required type="text" placeholder="Your first name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input required type="text" placeholder="Your last name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
              </MobileFieldGroup>

              <MobileFieldGroup title="Email Address">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input required type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </MobileFieldGroup>

              <MobileFieldGroup title="Identify (optional)">
                <div className="form-group">
                  <label>How do you identify? (optional)</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="">Prefer not to say</option>
                    <option>She/Her</option>
                    <option>He/Him</option>
                    <option>They/Them</option>
                    <option>Other / Self-describe</option>
                  </select>
                </div>
              </MobileFieldGroup>

              <MobileFieldGroup title="Where you heard about Phoenix">
                <div className="form-group">
                  <label>How did you hear about Phoenix?</label>
                  <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                    <option value="">Select one...</option>
                    <option>EPIC Live Stream</option>
                    <option>Referral from friend or colleague</option>
                    <option>Social media (TikTok, Instagram, LinkedIn)</option>
                    <option>Website search</option>
                    <option>Discovery call</option>
                    <option>Other</option>
                  </select>
                </div>
              </MobileFieldGroup>

              <MobileFieldGroup title="What brings you here? (optional)">
                <div className="form-group">
                  <label>What brings you here today? (optional)</label>
                  <textarea rows="3" placeholder="A few words about what's bringing you to this moment..." value={formData.context} onChange={e => setFormData({...formData, context: e.target.value})}></textarea>
                </div>
              </MobileFieldGroup>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Begin My Clarity Assessment →</button>
          </form>
        </div>
      )}


      {step === 2 && (
        <div className="assessment-questions">
          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Your Progress</span>
              <span className="progress-count">Question {currentQuestion + 1} of 25</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="dimension-label">{clarityDimensions[activeQuestion.dim]}</div>
          </div>

          <div key={currentQuestion} className="card question-card animate-question-card">
            <div className="q-number">Question {currentQuestion + 1}</div>
            <div className="q-text">{activeQuestion.text}</div>
            <div className="scale-options">
              {[1, 2, 3, 4, 5].map(num => (
                <button key={num} className={`scale-btn ${answers[currentQuestion] === num ? 'selected' : ''}`} onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = num;
                  setAnswers(newAnswers);
                }}>
                  <span className="scale-num">{num}</span>
                  <span className="scale-label">{labels[num]}</span>
                </button>
              ))}
            </div>
            <div className="scale-ends">
              <span>1 = Rarely</span>
              <span>5 = Consistently</span>
            </div>
          </div>
          <div className="nav-row">
            <button className="btn btn-secondary" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>← Back</button>
            <button className="btn btn-primary" onClick={handleNext}>{currentQuestion === clarityQuestions.length - 1 ? 'View My Results →' : 'Next →'}</button>
          </div>
        </div>
      )}
    </>
  );
};

const GenericAssessment = ({ title, type, questions }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const calculateScore = () => {
    const total = answers.reduce((acc, val) => acc + (val || 0), 0);
    return Math.round((total / (questions.length * 5)) * 100);
  };

  const handleSubmit = async () => {
    if (answers.includes(null) || !formData.firstName) {
      alert("Please complete all details and questions.");
      return;
    }
    const score = calculateScore();
    const data = { ...formData, date: new Date().toISOString(), score };
    if (type === 'readiness') await db.readiness.add(data);
    if (type === 'execution') await db.execution.add(data);
    alert('Assessment Submitted');
    setAnswers(Array(questions.length).fill(null));
  };

  return (
    <>
      <div className="card intake-card">
        <h3>{title}</h3>

        {/* Desktop */}
        <div className="desktop-only">
          <div className="form-row" style={{ marginTop: '16px' }}>
            <input placeholder="Client First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input placeholder="Client Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Mobile */}
        <div className="mobile-only">
          <MobileFieldGroup title="Client Name">
            <div className="form-row">
              <input placeholder="Client First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
              <input placeholder="Client Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
            </div>
          </MobileFieldGroup>
        </div>
      </div>
      <div className="assessment-questions">

        {questions.map((q, i) => (
          <div key={i} className="card question-card">
            <div className="q-number">Question {i + 1}</div>
            <div className="q-text">{q}</div>
            <div className="scale-options">
              {[1, 2, 3, 4, 5].map(num => (
                <button key={num} className={`scale-btn ${answers[i] === num ? 'selected' : ''}`} onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[i] = num;
                  setAnswers(newAnswers);
                }}>
                  <span className="scale-num">{num}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>Submit {title}</button>
      </div>
    </>
  );
};

const TestimonialForm = ({ navigate }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', role: '', stage: '',
    before: '', shift: '', after: '', anonymous: 'No'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.testimonials.add({ ...formData, status: 'Pending Review', date: new Date().toISOString() });
    alert('Thank you for sharing your story! It is now pending review.');
    navigate('/client-stories');
  };

  return (
    <div className="card intake-card">
      <h3>Share Your Story</h3>
      <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>We want to hear about your transformation.</p>
      <form onSubmit={handleSubmit}>
        {/* Desktop */}
        <div className="desktop-only">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Email (For follow-up, won't be displayed)</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role / Profession (Optional)</label>
              <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Stage</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                <option value="">Select Stage...</option>
                <option value="Awakening">Awakening</option>
                <option value="Dreaming">Dreaming</option>
                <option value="Phoenix Momentum">Phoenix Momentum</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Before (Where were you when you started?)</label>
            <textarea required rows="3" value={formData.before} onChange={e => setFormData({...formData, before: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label>The Shift (What changed during the work?)</label>
            <textarea required rows="3" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label>After (What are you doing now?)</label>
            <textarea required rows="3" value={formData.after} onChange={e => setFormData({...formData, after: e.target.value})}></textarea>
          </div>
          <div className="form-group">
            <label>Display as Anonymous?</label>
            <select value={formData.anonymous} onChange={e => setFormData({...formData, anonymous: e.target.value})}>
              <option value="No">No, use my name</option>
              <option value="Yes">Yes, keep it anonymous</option>
            </select>
          </div>
        </div>

        {/* Mobile */}
        <div className="mobile-only">
          <MobileFieldGroup title="Name">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="Email">
            <div className="form-group">
              <label>Email (For follow-up, won't be displayed)</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="Role & Stage">
            <div className="form-row">
              <div className="form-group">
                <label>Role / Profession (Optional)</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stage</label>
                <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                  <option value="">Select Stage...</option>
                  <option value="Awakening">Awakening</option>
                  <option value="Dreaming">Dreaming</option>
                  <option value="Phoenix Momentum">Phoenix Momentum</option>
                </select>
              </div>
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="Before">
            <div className="form-group">
              <label>Before (Where were you when you started?)</label>
              <textarea required rows="3" value={formData.before} onChange={e => setFormData({...formData, before: e.target.value})}></textarea>
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="Shift">
            <div className="form-group">
              <label>The Shift (What changed during the work?)</label>
              <textarea required rows="3" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}></textarea>
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="After">
            <div className="form-group">
              <label>After (What are you doing now?)</label>
              <textarea required rows="3" value={formData.after} onChange={e => setFormData({...formData, after: e.target.value})}></textarea>
            </div>
          </MobileFieldGroup>

          <MobileFieldGroup title="Anonymous">
            <div className="form-group">
              <label>Display as Anonymous?</label>
              <select value={formData.anonymous} onChange={e => setFormData({...formData, anonymous: e.target.value})}>
                <option value="No">No, use my name</option>
                <option value="Yes">Yes, keep it anonymous</option>
              </select>
            </div>
          </MobileFieldGroup>
        </div>

        <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: 16 }}>Submit Story</button>
      </form>

    </div>
  );
};

export default AssessmentPage;
