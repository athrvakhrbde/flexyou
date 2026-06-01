# FlexYou — Neobrutalism Design System

## Principles

- **Hard edges**: 3px black borders (`border-ink`, `neo-border`)
- **Offset shadows**: no blur — `shadow-neo` (4px 4px), `shadow-neo-lg` (6px 6px)
- **Bold type**: Space Grotesk, heavy weights, uppercase labels where needed
- **Flat saturated fills**: lime primary, pink accent, lavender secondary, cream background

## Tokens (`app/globals.css`)

| Token | Role |
|-------|------|
| `--ink` | Borders & shadows (black) |
| `--primary` | Lime — CTAs, active chips |
| `--accent` | Pink — highlights |
| `--secondary` | Lavender — sections |
| `--background` | Warm cream page |

## Utility classes

| Class | Use |
|-------|-----|
| `neo-card` | Bordered card + shadow |
| `neo-card-hover` | Lift on hover, press on active |
| `neo-btn` | Buttons (also via `<Button />`) |
| `neo-input` | Text fields |
| `neo-chip` | Filters, tags, nav pills |
| `neo-chip-active` | Selected filter |
| `neo-sticker` | Badges, price tags |
| `neo-heading` | Display headings |
| `neo-page` | Main content width |

## Components

All shadcn primitives in `components/ui/*` are themed neo. Feature UI uses the classes above — avoid one-off shadows or thin borders.

## Image product tags

Instagram-style tap-to-tag on flex photos. See `ImageProductTag` in Prisma and `TaggedImage` component.

- **View**: tap dots on the image → product name, brand, value
- **Edit** (owner): “Tag products” on item page → tap image to place a tag
- Coordinates are `x` / `y` as 0–100% of image dimensions
