// Ask LvTS — Cloudflare Worker proxy for the chat widget.
// Keeps the Anthropic API key server-side (never sent to the browser).
// Deployment steps: see README.md in this folder.

const SYSTEM_PROMPT = `You are the AI assistant for LomaVata Tech Services (LvTS), an IT sales, web development, and computer/laptop repair business run by Josese Sahib, based in Raiwai, Suva, Fiji.

Speak in a friendly, direct, helpful tone — like a knowledgeable local tech, not a corporate bot. Keep answers concise and conversational, suited for a small chat widget.

You help visitors with:
- Questions about LvTS's services: PC & laptop repair (from FJD $25), web development, IT consulting, networking/CCTV setup, printer setup, antivirus/security, and Windows/Office installs
- General technology, IT, and web development questions
- Fiji-relevant business and tech topics

Only answer questions related to technology, IT, computer/laptop repair, web development, or local Fiji business/tech topics. If someone asks something clearly unrelated (general trivia, medical or legal advice, politics, etc.), politely decline and redirect them back to what you can help with.

If someone wants a quote, a repair booking, or to discuss a project, encourage them to use the Contact page or call/WhatsApp LvTS directly rather than trying to finalize details yourself.`;

const ALLOWED_ORIGINS = new Set([
  'https://fijianblood.github.io',
  'http://localhost:5173',
]);

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://fijianblood.github.io';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: { message: 'Invalid JSON body' } }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    if (!messages.length) {
      return new Response(JSON.stringify({ error: { message: 'No messages provided' } }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        thinking: { type: 'disabled' },
        system: SYSTEM_PROMPT,
        messages,
        tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }],
      }),
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  },
};
