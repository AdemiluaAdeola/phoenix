/**
 * Email Service for Phoenix Assessment Platform
 * Handles outbound assessment report delivery via EmailJS REST API
 * with local simulation fallback and custom email content generation.
 */

export const sendAssessmentEmail = async (assessmentData) => {
  const serviceId = import.meta.env?.VITE_EMAILJS_SERVICE_ID || '';
  const templateId = import.meta.env?.VITE_EMAILJS_TEMPLATE_ID || '';
  const publicKey = import.meta.env?.VITE_EMAILJS_PUBLIC_KEY || '';

  // Prepare standard email template parameters
  const templateParams = {
    to_name: `${assessmentData.firstName} ${assessmentData.lastName}`,
    to_email: assessmentData.email,
    score: assessmentData.score,
    archetype: assessmentData.archetypeName || assessmentData.archetype,
    date: new Date(assessmentData.date).toLocaleDateString(),
    strengths_score: Math.round(((assessmentData.dimScores?.[0] || 0) / 25) * 20),
    values_score: Math.round(((assessmentData.dimScores?.[1] || 0) / 25) * 20),
    patterns_score: Math.round(((assessmentData.dimScores?.[2] || 0) / 25) * 20),
    direction_score: Math.round(((assessmentData.dimScores?.[3] || 0) / 25) * 20),
    alignment_score: Math.round(((assessmentData.dimScores?.[4] || 0) / 25) * 20),
  };

  // If environment variables are set, attempt to send via EmailJS API
  if (serviceId && templateId && publicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EmailJS Error: ${response.status} - ${errorText}`);
      }

      console.log('Email successfully sent via EmailJS.');
      return { success: true, method: 'EmailJS' };
    } catch (err) {
      console.error('Failed to send email via EmailJS. Falling back to local delivery.', err);
      // We will fall back to local simulated delivery
    }
  }

  // Simulated email delivery delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Assessment results locally sent to:', assessmentData.email, templateParams);
      resolve({ success: true, method: 'Simulation' });
    }, 1500);
  });
};
