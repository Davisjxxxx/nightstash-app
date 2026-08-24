// Cloudflare Worker: keeps your Anthropic API key off the phone.
// Deploy at workers.cloudflare.com, then set ANTHROPIC_API_KEY as a secret
// and ALLOWED_ORIGIN to wherever Nightstash is hosted.

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });
    if (origin !== '*' && request.headers.get('Origin') !== origin)
      return new Response('Forbidden', { status: 403, headers: cors });

    const body = await request.json();

    // Cap spend: this app never needs more than one modest completion per call.
    body.max_tokens = Math.min(body.max_tokens || 1000, 3000);

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { ...cors, 'content-type': 'application/json' }
    });
  }
};
