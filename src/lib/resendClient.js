import { env } from '../config/env';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

/**
 * Determines the safest available "from" address.
 *
 * Priority:
 *  1. VITE_RESEND_FROM_EMAIL if set (requires domain to be verified on resend.com/domains)
 *  2. onboarding@resend.dev  — Resend's pre-verified sandbox sender.
 *     Works without domain verification but can ONLY deliver to the
 *     Resend account owner's email. Suitable for testing / early production.
 *
 * Once phoenixclearinsight.com is verified in Resend, VITE_RESEND_FROM_EMAIL
 * will be used automatically and emails can go to any recipient.
 */
function resolveFromAddress() {
  return env.resendFromEmail || 'onboarding@resend.dev';
}

function normalizeRecipients(to) {
  return Array.isArray(to) ? to : [to];
}

function getErrorMessage(error, fallback) {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  return error.message || fallback;
}

async function parseJson(response) {
  return response.json().catch(() => null);
}

export async function sendEmailWithResend({
  to,
  subject,
  html,
  text,
  from = resolveFromAddress(),
  signal,
}) {
  if (!env.resendApiKey) {
    return {
      data: null,
      error: 'Resend API key is missing. Set VITE_RESEND_API_KEY in your environment.',
    };
  }

  try {
    const response = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: normalizeRecipients(to),
        subject,
        html,
        text,
      }),
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      // Provide a helpful hint for the most common production error
      const rawMsg =
        payload?.message || payload?.error || `Resend request failed with status ${response.status}.`;
      const hint =
        response.status === 403 && rawMsg.includes('domain is not verified')
          ? ' → Go to https://resend.com/domains to verify phoenixclearinsight.com.'
          : '';

      return { data: null, error: rawMsg + hint };
    }

    return { data: payload, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Unable to send email — network error.'),
    };
  }
}

export async function sendEmailViaApi({ to, subject, html, text, signal }) {
  if (!env.emailApiUrl) {
    return {
      data: null,
      error: 'Email API URL is missing.',
    };
  }

  try {
    const response = await fetch(env.emailApiUrl, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html, text }),
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      return {
        data: null,
        error:
          payload?.error ||
          payload?.message ||
          `Email request failed with status ${response.status}.`,
      };
    }

    return { data: payload, error: null };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Unable to send email — network error.'),
    };
  }
}

/**
 * Unified send function.
 * Routes through VITE_EMAIL_API_URL (server-side proxy) when set,
 * otherwise calls Resend directly from the browser.
 *
 * For production: set VITE_EMAIL_API_URL to keep your Resend key server-side.
 * For MVP/early launch: direct browser call is acceptable.
 */
export async function sendEmail(payload) {
  if (env.emailApiUrl) {
    return sendEmailViaApi(payload);
  }
  return sendEmailWithResend(payload);
}
