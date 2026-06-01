# FlexYou

A social platform where people flex their personal collections and everyday carry items — Instagram meets a personal inventory showcase.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js Server Actions + Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (Google + Email)
- **Storage:** Supabase Storage

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create your Supabase project, enable auth providers, and set up the `flex-items` storage bucket.

Copy environment variables:

```bash
cp .env.example .env
```

Fill in your Supabase credentials and database URLs.

### 3. Run migrations & seed

```bash
npx prisma migrate deploy   # or: npm run db:migrate
npm run db:seed
```

### 4. Start local stack

```bash
npm run supabase:start    # local Supabase (Docker required)
npm run db:migrate
npm run db:seed
npm run dev:local         # http://localhost:3001
```

For production:

```bash
npm run build
npm run start
```

Open [http://localhost:3001](http://localhost:3001) for local dev.

**Note:** Feed, profiles, and item pages are public. Sign in to react, follow, or save items.

## Demo Users (after seed)

| Username | Profile |
|----------|---------|
| arjunflex | `/u/arjunflex` |
| priyaflex | `/u/priyaflex` |
| rahulwatches | `/u/rahulwatches` |
| snehaedc | `/u/snehaedc` |
| vikramtech | `/u/vikramtech` |

## Routes (this pass)

| Route | Description |
|-------|-------------|
| `/` | Landing page with stats & Flex of the Day |
| `/login`, `/signup` | Auth (Google + email) |
| `/onboarding` | Username, bio, interests setup |
| `/feed` | Infinite scroll feed with filters |
| `/u/[username]` | User profile with collections/items/saved |
| `/u/[username]/[collectionSlug]` | Collection detail |
| `/item/[itemId]` | Item detail with reactions & comments |
| `/settings` | Settings placeholder |

## Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run dev:local    # Start dev server (port 3001)
npm run build        # Production build
npm run start        # Production server
npm run supabase:start  # Local Supabase
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed demo data
npm run setup:local  # Supabase + migrate + seed
```

## Flex Score Algorithm

```
flexScore = min(10000,
  items × 10 +
  totalValue / 1000 +
  reactions × 5 +
  followers × 8 +
  rarityWeightedScore +
  affiliateClicks × 3
)
```

Rarity weights: GRAIL=100, ULTRA_RARE=50, RARE=20, UNCOMMON=5, COMMON=1
