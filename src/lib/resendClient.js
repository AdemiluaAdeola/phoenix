import { env } from '../config/env';

const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

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
  from = env.resendFromEmail,
  signal,
}) {
  if (!env.resendApiKey) {
    return {
      data: null,
      error: 'Resend API key is missing.',
    };
  }

  if (!from) {
    return {
      data: null,
      error: 'Resend from email is missing.',
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
      return {
        data: null,
        error:
          payload?.message ||
          payload?.error ||
          `Resend request failed with status ${response.status}.`,
      };
    }

    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Unable to send email.'),
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
      headers: {
        'Content-Type': 'application/json',
      },
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

    return {
      data: payload,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error, 'Unable to send email.'),
    };
  }
}

export async function sendEmail(payload) {
  if (env.emailApiUrl) {
    return sendEmailViaApi(payload);
  }

  return sendEmailWithResend(payload);
}
