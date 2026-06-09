import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface ConvertKitRequest {
  email: string;
  first_name?: string;
  form_id?: string;
  tag_id?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: ConvertKitRequest;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = body?.email?.trim();
  if (!email) {
    return new Response(JSON.stringify({ error: 'Missing required field: email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const convertKitApiKey = Deno.env.get('CONVERTKIT_API_KEY');
  if (!convertKitApiKey) {
    console.error('CONVERTKIT_API_KEY not configured');
    return new Response(
      JSON.stringify({ error: 'ConvertKit is not configured. Set CONVERTKIT_API_KEY in Supabase function secrets.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  const tagId = body.tag_id || Deno.env.get('CONVERTKIT_TAG_ID');
  const formId = body.form_id || Deno.env.get('CONVERTKIT_FORM_ID');

  if (!tagId && !formId) {
    return new Response(
      JSON.stringify({ error: 'ConvertKit tag or form is not configured. Set CONVERTKIT_TAG_ID or CONVERTKIT_FORM_ID.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  const endpoint = tagId
    ? `https://api.convertkit.com/v3/tags/${tagId}/subscribe`
    : `https://api.convertkit.com/v3/forms/${formId}/subscribe`;

  const payload = {
    api_key: convertKitApiKey,
    email,
    ...(body.first_name ? { first_name: body.first_name } : {}),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('ConvertKit API error', { status: response.status, data });
      return new Response(JSON.stringify({ error: data?.message || data?.error || 'ConvertKit request failed.' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ConvertKit subscription error', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
