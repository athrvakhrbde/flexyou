#!/usr/bin/env bash
# Provision FlexYou on Supabase + Vercel (requires: supabase login, vercel login)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ORG_ID="${SUPABASE_ORG_ID:-wfljbtbivblemfyesjpr}"
REGION="${SUPABASE_REGION:-ap-south-1}"
PROJECT_NAME="${SUPABASE_PROJECT_NAME:-flexyou}"
APP_URL="${NEXT_PUBLIC_APP_URL:-https://flexyou.vercel.app}"

if [[ -f /tmp/flexyou-db-pass.txt ]]; then
  DB_PASS="$(cat /tmp/flexyou-db-pass.txt)"
else
  DB_PASS="$(openssl rand -hex 16)"
  echo "$DB_PASS" > /tmp/flexyou-db-pass.txt
  chmod 600 /tmp/flexyou-db-pass.txt
fi

echo "→ Creating Supabase project (if missing)…"
REF="$(supabase projects list -o json | python3 -c "
import sys, json
name = sys.argv[1]
for p in json.load(sys.stdin):
    if p.get('name') == name:
        print(p['id']); break
" "$PROJECT_NAME" 2>/dev/null || true)"

if [[ -z "${REF:-}" ]]; then
  supabase projects create "$PROJECT_NAME" --org-id "$ORG_ID" --db-password "$DB_PASS" --region "$REGION" --yes
  REF="$(supabase projects list -o json | python3 -c "
import sys, json
for p in json.load(sys.stdin):
    if p.get('name') == sys.argv[1]: print(p['id']); break
" "$PROJECT_NAME")"
fi

echo "→ Linking project $REF…"
supabase link --project-ref "$REF" --password "$DB_PASS" --yes

POOLER_HOST="$(grep -o 'aws-[0-9]*-[^:]*' supabase/.temp/pooler-url | head -1)"
DATABASE_URL="postgresql://postgres.${REF}:${DB_PASS}@${POOLER_HOST}.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.${REF}:${DB_PASS}@${POOLER_HOST}.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://${REF}.supabase.co"

export DATABASE_URL DIRECT_URL
npx prisma migrate deploy

KEYS_JSON="$(supabase projects api-keys --project-ref "$REF" -o json)"
ANON_KEY="$(echo "$KEYS_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(next(x['api_key'] for x in d if x.get('id')=='anon'))")"
SERVICE_KEY="$(echo "$KEYS_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); print(next(x['api_key'] for x in d if x.get('id')=='service_role'))")"

add_secret() { printf '%s' "$2" | vercel env add "$1" production --yes --sensitive --force; printf '%s' "$2" | vercel env add "$1" preview --yes --sensitive --force; }
add_public() { for e in production preview development; do printf '%s' "$2" | vercel env add "$1" "$e" --yes --force; done; }

echo "→ Setting Vercel env…"
add_secret DATABASE_URL "$DATABASE_URL"
add_secret DIRECT_URL "$DIRECT_URL"
add_secret SUPABASE_SERVICE_ROLE_KEY "$SERVICE_KEY"
add_public NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL"
add_public NEXT_PUBLIC_SUPABASE_ANON_KEY "$ANON_KEY"
add_public NEXT_PUBLIC_APP_URL "$APP_URL"

echo "→ Pushing Supabase auth config…"
supabase config push --yes

echo "→ Deploying…"
vercel --prod --yes

echo "Done. App: $APP_URL | Supabase: $SUPABASE_URL"
