import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabaseClient';
import { env } from '../config/env';
import {
  mapAssessment,
  mapTestimonial,
  mapReadiness,
  mapExecutionForm,
} from '../api/supabaseRestClient';
import {
  deleteAssessment,
  deleteReadiness,
  deleteExecutionForm,
  deleteTestimonial,
  updateTestimonialStatus,
} from '../api/dbClient';
import './RecordDetails.css';

const tableMap = {
  clarity: env.supabaseAssessmentsTable,
  readiness: env.supabaseReadinessTable,
  execution: env.supabaseExecutionFormsTable,
  testimonials: env.supabaseTestimonialsTable,
};

const mapperMap = {
  clarity: mapAssessment,
  readiness: mapReadiness,
  execution: mapExecutionForm,
  testimonials: mapTestimonial,
};

const deleteMap = {
  clarity: deleteAssessment,
  readiness: deleteReadiness,
  execution: deleteExecutionForm,
  testimonials: deleteTestimonial,
};

const typeTitles = {
  clarity: 'Clarity Assessment',
  readiness: 'Readiness Assessment',
  execution: 'Execution Form',
  testimonials: 'Testimonial',
};

/* ── helpers ── */

function ScoreRing({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * (score || 0)) / 100;

  return (
    <div className="score-ring-wrap">
      <svg viewBox="0 0 100 100" className="score-ring-svg">
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="rgba(13,16,40,0.08)" strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" stroke="var(--gold)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="score-ring-label">{score ?? '—'}%</div>
    </div>
  );
}

function DetailField({ label, children }) {
  if (children === undefined || children === null || children === '') return null;
  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      <div className="detail-field-value">{children}</div>
    </div>
  );
}

function ResponsesList({ responses }) {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return null;

  return (
    <div className="detail-responses">
      <span className="detail-field-label">Responses</span>
      <div className="responses-grid">
        {responses.map((r, i) => (
          <div key={i} className="response-item">
            <span className="response-q">Q{i + 1}</span>
            <span className="response-a">
              {typeof r === 'object' ? JSON.stringify(r) : String(r)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimScoresList({ dimScores }) {
  if (!dimScores || !Array.isArray(dimScores) || dimScores.length === 0) return null;

  return (
    <div className="detail-dim-scores">
      <span className="detail-field-label">Dimension Scores</span>
      <div className="dim-scores-grid">
        {dimScores.map((d, i) => {
          const label = typeof d === 'object' && d !== null ? (d.label || d.name || `Dim ${i + 1}`) : `Dim ${i + 1}`;
          const value = typeof d === 'object' && d !== null ? (d.score ?? d.value ?? d) : d;

          return (
            <div key={i} className="dim-score-bar">
              <div className="dim-score-header">
                <span className="dim-score-label">{label}</span>
                <span className="dim-score-value">{typeof value === 'number' ? `${value}%` : String(value)}</span>
              </div>
              {typeof value === 'number' && (
                <div className="dim-bar-track">
                  <div className="dim-bar-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ── */

const RecordDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      setError('');

      const tableName = tableMap[type];
      const mapper = mapperMap[type];

      if (!tableName || !mapper) {
        setError(`Unknown record type: ${type}`);
        setLoading(false);
        return;
      }

      try {
        const { client } = getSupabaseClient();
        const { data, error: fetchErr } = await client
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (fetchErr) throw fetchErr;
        setRecord(mapper(data));
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load record.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [type, id]);

  const handleDelete = async () => {
    const deleteFn = deleteMap[type];
    if (!deleteFn || !record) return;

    setIsProcessing(true);
    setActionError('');

    try {
      await deleteFn(record.id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to delete record.');
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleTestimonialAction = async (newStatus) => {
    if (!record || type !== 'testimonials') return;
    setIsProcessing(true);
    setActionError('');

    try {
      await updateTestimonialStatus(record.id, newStatus);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setActionError(err.message || `Failed to ${newStatus.toLowerCase()} testimonial.`);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── render states ── */

  if (loading) {
    return (
      <div className="animate-fade-slide">
        <div className="record-details-shell">
          <div className="record-loading">
            <div className="loading-spinner" />
            <p>Loading record...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-slide">
        <div className="record-details-shell">
          <div className="record-error-card">
            <div className="record-error-icon">⚠</div>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const title = typeTitles[type] || 'Record';
  const hasScore = record?.score !== undefined && record?.score !== null;

  return (
    <div className="animate-fade-slide">
      {/* Hero */}
      <div className="hero hero-small">
        <div className="hero-label">{title} Details</div>
        <h1><em>{record?.firstName} {record?.lastName}</em></h1>
        <p>Submitted on {record?.date ? new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
      </div>

      <div className="record-details-shell">
        {/* Score card (for scored assessments) */}
        {hasScore && (
          <div className="record-score-section">
            <ScoreRing score={record.score} />
            <div className="record-score-meta">
              <span className="record-score-title">Overall Score</span>
              <span className="record-score-subtitle">
                {record.score >= 80 ? 'Excellent' : record.score >= 60 ? 'Good' : record.score >= 40 ? 'Developing' : 'Needs Attention'}
              </span>
            </div>
          </div>
        )}

        {/* Main details card */}
        <div className="record-details-card">
          <div className="record-details-grid">
            {/* Common fields */}
            <DetailField label="Full Name">{record?.firstName} {record?.lastName}</DetailField>
            <DetailField label="Email">{record?.email}</DetailField>
            <DetailField label="Date">{record?.date ? new Date(record.date).toLocaleDateString() : '—'}</DetailField>

            {/* Clarity-specific */}
            {type === 'clarity' && (
              <>
                <DetailField label="Archetype">{record?.archetypeName || record?.archetype}</DetailField>
                <DetailField label="Identity">{record?.identity}</DetailField>
                <DetailField label="Source">{record?.source}</DetailField>
                <DetailField label="Context">{record?.context}</DetailField>
              </>
            )}

            {/* Readiness-specific */}
            {type === 'readiness' && (
              <>
                <DetailField label="Session Type">{record?.sessionType}</DetailField>
                <DetailField label="Session Date">{record?.sessionDate ? new Date(record.sessionDate).toLocaleDateString() : null}</DetailField>
              </>
            )}

            {/* Execution-specific */}
            {type === 'execution' && (
              <>
                <DetailField label="Status">
                  <span className={`status-pill status-${(record?.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {record?.status}
                  </span>
                </DetailField>
                <DetailField label="Notes">{record?.notes}</DetailField>
              </>
            )}

            {/* Testimonials-specific */}
            {type === 'testimonials' && (
              <>
                <DetailField label="Stage">{record?.stage}</DetailField>
                <DetailField label="Role">{record?.role}</DetailField>
                <DetailField label="Anonymous">{record?.anonymous}</DetailField>
                <DetailField label="Status">
                  <span className={`status-pill status-${(record?.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {record?.status}
                  </span>
                </DetailField>
              </>
            )}
          </div>

          {/* Testimonial narrative fields */}
          {type === 'testimonials' && (
            <div className="narrative-section">
              <DetailField label="Before">{record?.before}</DetailField>
              <DetailField label="Shift">{record?.shift}</DetailField>
              <DetailField label="After">{record?.after}</DetailField>
            </div>
          )}

          {/* Responses list */}
          {(type === 'clarity' || type === 'readiness') && (
            <ResponsesList responses={record?.responses} />
          )}

          {type === 'execution' && (
            <ResponsesList responses={record?.answers} />
          )}

          {/* Dimension scores */}
          {type === 'clarity' && (
            <DimScoresList dimScores={record?.dimScores} />
          )}
        </div>

        {/* Actions bar */}
        {actionError && <div className="record-action-error">{actionError}</div>}

        <div className="record-actions-bar">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
            disabled={isProcessing}
          >
            ← Back to Dashboard
          </button>

          <div className="record-actions-right">
            {type === 'testimonials' && (
              <>
                <button
                  className="btn btn-approve"
                  disabled={isProcessing}
                  onClick={() => handleTestimonialAction('Approved')}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn btn-reject"
                  disabled={isProcessing}
                  onClick={() => handleTestimonialAction('Rejected')}
                >
                  ✕ Reject
                </button>
              </>
            )}

            {!showDeleteConfirm ? (
              <button
                className="btn btn-delete"
                disabled={isProcessing}
                onClick={() => setShowDeleteConfirm(true)}
              >
                🗑 Delete
              </button>
            ) : (
              <div className="delete-confirm-group">
                <span className="delete-confirm-text">Are you sure?</span>
                <button
                  className="btn btn-delete-confirm"
                  disabled={isProcessing}
                  onClick={handleDelete}
                >
                  {isProcessing ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetails;
