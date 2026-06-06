import { useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  text?: string;
}

interface EmailResponse {
  success?: boolean;
  messageId?: string;
  error?: string;
}

interface UseResendEmailReturn {
  loading: boolean;
  success: boolean;
  error: string | null;
  sendEmail: (payload: EmailPayload) => Promise<EmailResponse | null>;
  reset: () => void;
}

export const useResendEmail = (): UseResendEmailReturn => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const sendEmail = useCallback(async (payload: EmailPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke<EmailResponse>(
        "send-email",
        {
          body: payload,
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuccess(true);
      return data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send email";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const reset = useCallback(() => {
    setLoading(false);
    setSuccess(false);
    setError(null);
  }, []);

  return {
    loading,
    success,
    error,
    sendEmail,
    reset,
  };
};
