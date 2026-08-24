# Nightstash

Four files, all plain text. No binaries, nothing to base64-encode, nothing a
file-upload API can corrupt. The app icons live inside `manifest.webmanifest`
as data URIs.

## Files
- `index.html` - the app
- `manifest.webmanifest` - install metadata, icons inlined
- `sw.js` - service worker, caches the shell for offline open
- `worker.js` - Cloudflare Worker, holds your API key. Does NOT go in this repo's
  Pages output; paste it into the Cloudflare dashboard instead.

## Publish
1. Commit all four to `main`.
2. Settings > Pages > Deploy from branch `main`, folder `/ (root)`.
3. Repo must be Public for Pages on the free tier.
4. Open `https://<you>.github.io/nightstash-app/`

## Key
1. Cloudflare > Workers & Pages > Create Worker > paste `worker.js` > Deploy.
2. Settings > Variables: secret `ANTHROPIC_API_KEY`, plain var `ALLOWED_ORIGIN`
   set to `https://<you>.github.io` (origin only, no path, no trailing slash).
3. In the app: Setup > Proxy URL > the worker URL. Leave the key field blank.

## Install
Chrome on the phone > menu > Add to Home screen.

## Updating
After editing `index.html`, bump `CACHE` in `sw.js` (`nightstash-v2` to `v3`) or
the phone keeps serving the cached old copy.
