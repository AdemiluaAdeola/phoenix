const SUPABASE_URL = "https://supabase.com/dashboard/project/kmrambclpujmnyxbfkjh"
  import.meta.env.VITE_SUPABASE_URL || '';

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcmFtYmNscHVqbW55eGJma2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzMyNjcsImV4cCI6MjA5NTE0OTI2N30.o9Yyoqbk9uPRVaHyg1lrCGEBNHOZyQzgzZZYQD7R8lA"
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
export async function createAssessment(payload) {
  // POST /rest/v1/<table>
  const row = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    identity: payload.identity ?? null,
    source: payload.source ?? null,
    context: payload.context ?? null,
    responses: payload.responses ?? [],
    score: Number(payload.score ?? 0),
    archetype: payload.archetype ?? null,
    createdAt: payload.createdAt ?? new Date().toISOString()
  }

  return supabaseFetch(`/rest/v1/assessments?select=*`, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation'
    },
    body: row
  })
}

export async function listAssessments() {
  return supabaseFetch(
    `/rest/v1/assessments?select=*&order=createdAt.desc`
  )
}

/**
 * testimonials table
 * - Schema assumption:
 *   firstName, lastName, anonymous, role, stage, before, shift, after, status, createdAt
 */
export async function listTestimonials({ status } = {}) {
  const query = status
    ? `/rest/v1/testimonials?select=*&status=eq.${encodeURIComponent(status)}&order=createdAt.desc`
    : `/rest/v1/testimonials?select=*&order=createdAt.desc`
  return supabaseFetch(query)
}

export async function updateTestimonialStatus(id, status) {
  if (!id || !Number.isFinite(Number(id))) {
    throw new Error('Invalid testimonial id')
  }
  if (!status) {
    throw new Error('Invalid status')
  }

  // PATCH /rest/v1/<table>?id=eq.<id>
  // Update by primary key column "id" (assumed).
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

  // Supabase returns array of updated rows.
  return Array.isArray(rows) ? rows[0] : rows
}
