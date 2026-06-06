import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

const supabaseStatus = getSupabaseClient();

function includesAdminRole(value) {
  if (!value) return false;
  if (Array.isArray(value)) return value.includes('admin');
  return value === 'admin';
}

export function hasAdminRole(user) {
  if (!user) return false;

  const appMetadata = user.app_metadata || {};
  const userMetadata = user.user_metadata || {};

  return (
    includesAdminRole(appMetadata.role) ||
    includesAdminRole(appMetadata.roles) ||
    includesAdminRole(userMetadata.role) ||
    includesAdminRole(userMetadata.roles)
  );
}

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => !supabaseStatus.error);
  const [error, setError] = useState(() => supabaseStatus.error || '');

  useEffect(() => {
    const { client, error: clientError } = supabaseStatus;

    if (clientError || !client) {
      return undefined;
    }

    let isMounted = true;

    const loadUser = async () => {
      setIsLoading(true);
      setError('');

      const { data, error: authError } = await client.auth.getUser();

      if (!isMounted) return;

      if (authError) {
        setUser(null);
        setError(authError.message || 'Unable to verify admin access.');
      } else {
        setUser(data?.user || null);
      }

      setIsLoading(false);
    };

    loadUser();

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      if (typeof listener?.subscription?.unsubscribe === 'function') {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  const isAdmin = useMemo(() => hasAdminRole(user), [user]);

  return {
    user,
    isAdmin,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
  };
}
