const API_BASE_URL = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

export async function createAssessment(payload) {
  const res = await fetch(`${API_BASE_URL}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

export async function listAssessments() {
  const res = await fetch(`${API_BASE_URL}/assessments`, { method: 'GET' })
  return handleResponse(res)
}

export async function listTestimonials({ status } = {}) {
  const url = new URL(`${API_BASE_URL}/testimonials`, window.location.origin)
  if (status) url.searchParams.set('status', status)
  const res = await fetch(url.toString(), { method: 'GET' })
  return handleResponse(res)
}

export async function updateTestimonialStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  return handleResponse(res)
}
