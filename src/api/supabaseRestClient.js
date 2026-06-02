// Supports both Vite (browser) and plain Node (for smoke tests).
const nodeEnv = globalThis.process?.env || {};

const SUPABASE_URL =
  // Vite/browser
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) ||
  // Node/smoke test
  nodeEnv.SUPABASE_URL ||
  // Fallback: REST host (preferred over dashboard URL)
  'https://kmrambclpujmnyxbfkjh.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) ||
  nodeEnv.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcmFtYmNscHVqbW55eGJma2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzMyNjcsImV4cCI6MjA5NTE0OTI2N30.o9Yyoqbk9uPRVaHyg1lrCGEBNHOZyQzgzZZYQD7R8lA';


function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Vite environment.'
    )
  }
}

async function supabaseFetch(path, { method = 'GET', headers = {}, body } = {}) {
  assertConfigured()

  const url = `${SUPABASE_URL}${path}`
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Supabase request failed: ${res.status}`)
  }

  // Supabase REST usually returns JSON, but DELETE/PATCH might return differently.
  // Try JSON first, fallback to text.
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

/**
 * assessments table
 * - Schema assumption based on existing Dexie:
 *   firstName, lastName, email, identity, source, context, responses (json), score, archetype (optional), createdAt (timestamp)
 */
// ── MAPPING HELPERS ──

const archetypeNames = {
  phoenix_momentum: 'Phoenix Momentum',
  dreaming: 'Dreaming',
  awakening: 'Awakening',
};

export function mapAssessment(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    identity: row.identity,
    source: row.source,
    context: row.context,
    responses: row.responses,
    score: row.score,
    archetype: row.archetype,
    archetypeName: archetypeNames[row.archetype] || row.archetype || '',
    dimScores: Array.isArray(row.dim_scores) ? row.dim_scores : [],
    date: row.created_at
  }
}

export function mapTestimonial(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    anonymous: row.anonymous,
    role: row.role,
    stage: row.stage,
    before: row.before,
    shift: row.shift,
    after: row.after,
    status: row.status,
    date: row.created_at
  }
}

export function mapReadiness(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    score: row.score,
    responses: row.responses,
    sessionType: row.session_type,
    sessionDate: row.session_date,
    date: row.created_at
  }
}

export function mapExecutionForm(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    answers: row.responses,
    status: row.status,
    notes: row.notes,
    date: row.created_at
  }
}

/**
 * assessments table
 */
export async function createAssessment(payload) {
  const row = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    identity: payload.identity ?? null,
    source: payload.source ?? null,
    context: payload.context ?? null,
    responses: payload.answers ?? payload.responses ?? [],
    score: Number(payload.score ?? 0),
    archetype: payload.archetype ?? null,
    dim_scores: Array.isArray(payload.dimScores) ? payload.dimScores : null,
    created_at: payload.date ?? new Date().toISOString()
  }

  const res = await supabaseFetch(`/rest/v1/assessments?select=*`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: row
  })
  const records = Array.isArray(res) ? res : [res];
  return mapAssessment(records[0]);
}

export async function listAssessments() {
  const res = await supabaseFetch(
    `/rest/v1/assessments?select=*&order=created_at.desc`
  )
  return (res || []).map(mapAssessment)
}

/**
 * testimonials table
 */
export async function listTestimonials({ status } = {}) {
  const query = status
    ? `/rest/v1/testimonials?select=*&status=eq.${encodeURIComponent(status)}&order=created_at.desc`
    : `/rest/v1/testimonials?select=*&order=created_at.desc`
  const res = await supabaseFetch(query)
  return (res || []).map(mapTestimonial)
}

export async function updateTestimonialStatus(id, status) {
  if (!id || !Number.isFinite(Number(id))) {
    throw new Error('Invalid testimonial id')
  }
  if (!status) {
    throw new Error('Invalid status')
  }

  const rows = await supabaseFetch(
    `/rest/v1/testimonials?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation'
      },
      body: { status }
    }
  )

  const updatedRow = Array.isArray(rows) ? rows[0] : rows;
  return mapTestimonial(updatedRow);
}

export async function createTestimonial(payload) {
  const row = {
    first_name: payload.firstName ?? null,
    last_name: payload.lastName ?? null,
    anonymous: payload.anonymous ? String(payload.anonymous) : 'No',
    role: payload.role ?? null,
    stage: payload.stage ?? null,
    before: payload.before ?? null,
    shift: payload.shift ?? null,
    after: payload.after ?? null,
    status: payload.status ?? 'Pending Review',
    created_at: payload.date ?? new Date().toISOString()
  }

  const res = await supabaseFetch(`/rest/v1/testimonials?select=*`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: row
  })
  const records = Array.isArray(res) ? res : [res];
  return mapTestimonial(records[0]);
}

/**
 * readiness table
 */
export async function createReadiness(payload) {
  const row = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    score: Number(payload.score ?? 0),
    responses: payload.answers ?? payload.responses ?? [],
    session_type: payload.sessionType ?? null,
    session_date: payload.sessionDate ?? null,
    created_at: payload.date ?? new Date().toISOString()
  }

  const res = await supabaseFetch(`/rest/v1/readiness?select=*`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: row
  })
  const records = Array.isArray(res) ? res : [res];
  return mapReadiness(records[0]);
}

export async function listReadiness() {
  const res = await supabaseFetch(`/rest/v1/readiness?select=*&order=created_at.desc`)
  return (res || []).map(mapReadiness)
}

/**
 * execution_forms table
 */
export async function createExecutionForm(payload) {
  const row = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    responses: payload.answers ?? [],
    status: payload.status ?? 'Pending',
    notes: payload.notes ?? null,
    created_at: payload.date ?? new Date().toISOString()
  }

  const res = await supabaseFetch(`/rest/v1/execution_forms?select=*`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: row
  })
  const records = Array.isArray(res) ? res : [res];
  return mapExecutionForm(records[0]);
}

export async function listExecutionForms() {
  const res = await supabaseFetch(`/rest/v1/execution_forms?select=*&order=created_at.desc`)
  return (res || []).map(mapExecutionForm)
}

