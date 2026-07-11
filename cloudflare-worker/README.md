# Ask LvTS — Cloudflare Worker Setup

This is the missing piece that makes the "Ask LvTS" chat page on your site actually work. It's a small proxy that holds your Anthropic API key privately — your key never gets sent to visitors' browsers.

You need to do this part yourself since it requires creating a (free) Cloudflare account and entering your own Anthropic API key into it.

## Steps

1. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up (if you don't already have one).

2. **Create a Worker**
   - In the Cloudflare dashboard, go to **Workers & Pages** → **Create** → **Create Worker**.
   - Give it a name, e.g. `ask-lvts` (this becomes part of your URL: `ask-lvts.<your-subdomain>.workers.dev`).
   - Click **Deploy** to create it with the default template.

3. **Paste in the real code**
   - Click **Edit code**.
   - Delete everything in the editor and paste in the entire contents of `worker.js` from this folder.
   - Click **Deploy**.

4. **Add your Anthropic API key as a secret** (never put it directly in the code)
   - Go to your Worker's **Settings** → **Variables and Secrets**.
   - Add a new secret: Name = `ANTHROPIC_API_KEY`, Value = your Anthropic API key (starts with `sk-ant-...`).
   - Save.

5. **Copy your Worker's URL**
   - It'll look like `https://ask-lvts.yoursubdomain.workers.dev`.
   - Send me that URL and I'll wire it into the site and push the update — or you can paste it yourself into `src/pages/AskLvtsPage.tsx`, replacing the `PROXY_URL` constant at the top of the file.

## Optional but recommended: set a spending limit

Every message a visitor sends will use your Anthropic API credits. In the Anthropic Console (https://console.anthropic.com), under **Billing**, you can set a monthly spend limit so costs can't run away if the chat gets heavy traffic.

## Notes

- The Worker only accepts requests from your GitHub Pages site (and localhost, for testing). This isn't a hard security wall — CORS only stops browser-based copying, not a determined attacker — but it keeps casual misuse out.
- The system prompt (LvTS's voice, Fiji-focused scope, service info) lives in `worker.js` on Cloudflare's side, not in the public site code, so it can't be tampered with by visitors.
- To update the assistant's behavior later, just edit `worker.js` here and re-paste it into the Cloudflare Worker editor.
