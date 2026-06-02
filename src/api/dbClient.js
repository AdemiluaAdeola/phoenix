// Redirect all API calls directly to Supabase REST client
export {
  createAssessment,
  listAssessments,
  createTestimonial,
  listTestimonials,
  updateTestimonialStatus,
  createReadiness,
  listReadiness,
  createExecutionForm,
  listExecutionForms
} from './supabaseRestClient';
