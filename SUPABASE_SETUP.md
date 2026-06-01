# Supabase Setup for FlexYou

## Local development (Supabase CLI)

### 1. Google Cloud OAuth credentials

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application).
3. **Authorized redirect URIs** — add exactly:
   - `http://127.0.0.1:54321/auth/v1/callback` (local Supabase Auth)
   - If using hosted Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client secret** into `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 2. Start Supabase & app

```bash
npm run supabase:start
npm run db:migrate
npm run db:seed
npm run dev:local
```

After changing `supabase/config.toml` or Google env vars, restart Supabase:

```bash
npm run supabase:stop
npm run supabase:start
```

### 3. Local auth redirect URLs

`supabase/config.toml` is configured for:

- Site URL: `http://localhost:3001`
- Callback allow-list: `http://localhost:3001/auth/callback`

`NEXT_PUBLIC_APP_URL` must match the port you use (`3001` for `npm run dev:local`).

---

## Hosted Supabase (production)

### 1. Create project

Copy from **Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Database (Prisma)

- **Transaction pooler** (6543) → `DATABASE_URL?pgbouncer=true`
- **Direct** (5432) → `DIRECT_URL`

```bash
npx prisma migrate deploy
npm run db:seed
```

### 3. Auth providers

**Authentication → Providers:**

- Enable **Email**
- Enable **Google** with the same Google Cloud client
- Redirect URI in Google Console: `https://<project-ref>.supabase.co/auth/v1/callback`

**Authentication → URL Configuration → Redirect URLs:**

- `http://localhost:3001/auth/callback` (local)
- `https://your-domain.com/auth/callback` (production)

Set `NEXT_PUBLIC_APP_URL` to your public app URL in production.

### 4. Storage

Bucket `flex-items` (public) — see original policies in repo history if needed.

---

## Troubleshooting Google sign-in

| Symptom | Fix |
|--------|-----|
| Button does nothing | Use **Continue with Google** link → `/auth/oauth` (fixed in app) |
| Redirect to login?error=auth | Check Google redirect URI is Supabase (`.../auth/v1/callback`), not your app URL |
| redirect_uri_mismatch | Google Console URI must match Supabase exactly |
| Local: provider disabled | Set `GOOGLE_CLIENT_ID` / `SECRET` in `.env`, restart `supabase start` |
| Session not kept after login | Ensure `NEXT_PUBLIC_APP_URL` matches browser URL (port 3001) |
