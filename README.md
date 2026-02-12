# Romantic Single-Page App (GitHub Pages)

## What this is
A tiny, playful, mobile-friendly page that asks: “Will you be my girlfriend?” with teasing buttons and heart animations.

## Deploy on GitHub Pages
1. Create a new GitHub repository (public or private).
2. Add the `index.html` from this folder to the root of the repo.
3. Commit and push to the `main` branch.
4. In the GitHub repo, go to `Settings` → `Pages`.
5. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` and `/ (root)`
6. Save. GitHub will show your live URL.

## URL format
Your page will be available at:
```
https://<username>.github.io/<repo>/
```

## Notes
- This is a single static file — no build tools required.
- Share the URL on mobile and it will work instantly.

## Optional: Track YES clicks with Cloudflare Workers + D1
If you want to log YES clicks (IP + timestamp), a small Cloudflare Worker handles it.

### 1) Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2) Create the D1 database
```bash
wrangler d1 create valentine_clicks
```
Copy the `database_id` printed by the command.

### 3) Configure the Worker
Update `valentine-worker/wrangler.toml`:
```
database_id = "YOUR_DATABASE_ID"
```

### 4) Create the schema
```bash
wrangler d1 execute valentine_clicks --file=./valentine-worker/schema.sql
```

### 5) Add the admin token (for stats)
```bash
wrangler secret put ADMIN_TOKEN
```

### 6) Deploy the Worker
```bash
cd valentine-worker
wrangler deploy
```
You’ll get a Worker URL like:
```
https://your-worker.your-subdomain.workers.dev
```

### 7) Connect the web page
Update `index.html` and replace:
```
https://REPLACE_ME.workers.dev/log
```
with your Worker URL.

### 8) View stats
Open in your browser (replace the token):
```
https://your-worker.your-subdomain.workers.dev/stats?token=YOUR_ADMIN_TOKEN
```

### Notes
- GitHub Pages stays the same; the Worker is just an API endpoint.
- Browsers won’t let the page read IPs; the Worker gets IPs from Cloudflare automatically.
