# Deploy FlexYou (Vercel + Supabase)

## 1. Supabase (production)

1. Create a project at [supabase.com](https://supabase.com).
2. **Database**: Settings → Database → copy **Connection string** (pooler, port 6543) and **Direct** URL (port 5432).
3. **Auth**: Authentication → URL configuration:
   - Site URL: `https://YOUR_VERCEL_DOMAIN`
   - Redirect URLs: `https://YOUR_VERCEL_DOMAIN/auth/callback`, `https://YOUR_VERCEL_DOMAIN/**`
4. **Google OAuth** (optional): Authentication → Providers → Google; use the hosted callback URL Supabase shows (not localhost).
5. Copy **Project URL**, **anon key**, and **service_role** key from API settings.

## 2. Vercel environment variables

**Required before the first deploy succeeds.** Local `.env` is not uploaded (see `.vercelignore`). Add variables in the [Vercel dashboard](https://vercel.com) → Project → Settings → Environment Variables, or:

```bash
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
# … repeat for each variable below
```

Set these in the Vercel project (Production + Preview):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Pooled Postgres URL with `?pgbouncer=true` |
| `DIRECT_URL` | Direct Postgres URL (migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (no trailing slash) |

Optional for local Supabase Google only: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

Build runs `prisma migrate deploy` then `next build` (see `vercel.json`).

**One-shot CLI setup** (after `supabase login` and `vercel login`):

```bash
./scripts/setup-production.sh
```

Mumbai (`ap-south-1`) projects use the `aws-1-ap-south-1` pooler host (see `supabase/.temp/pooler-url` after `supabase link`).

## 3. Deploy

```bash
# From repo root (after git push)
npx vercel link
npx vercel env pull   # optional, for local prod-like testing
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys.

## 4. Post-deploy

- Run `npm run db:seed` once against production **only** if you want demo data (optional).
- Confirm `/feed` loads and Google/email auth redirects use `NEXT_PUBLIC_APP_URL`.

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for local development.
