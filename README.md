# Next.js Clothing Retail

Full-stack demo: product catalog, search, cart, checkout, account area, favorites, and an admin section for categories, products and orders.

## Stack

- **Framework:** Next.js (App Router), React 19, TypeScript
- **Data:** PostgreSQL, Drizzle ORM
- **Auth:** NextAuth.js (OAuth-ready; Drizzle adapter)
- **UI:** Tailwind CSS, Framer Motion
- **Forms / validation:** React Hook Form, Zod

## Implementation (high level)

- Hierarchical category navigation (desktop mega-menu, mobile stack + animations)
- Product listing with filters, sort, and cursor-based infinite scroll
- Guest cart and favorites merged into the user account on login
- Multi-step checkout with server actions
- Admin flows for catalog content (categories, products, image handling)
- Accessibility-oriented patterns: keyboard shortcuts, focus handling, scroll lock for overlays

## Local development

Prerequisites: Node.js, PostgreSQL, `npm i`.

1. Copy `.env.example` to `.env` and set `DB_URL` + `DB_SSL`. Create the local database if it does not exist (`createdb db`).

   ```env
   # Local PostgreSQL
   DB_URL=postgresql://USER:PASSWORD@localhost:5432/db
   DB_SSL=false

   # Neon
   # DB_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
   # DB_SSL=true

   # Auth (Base requirement)
   AUTH_SECRET=generate-with-openssl-rand-base64-32
   AUTH_URL=http://localhost:3000
   ```

2. Apply schema, seed sample data, and start the development server:

   ```bash
   npm run db:push
   npm run seed:c
   npm run seed:p
   npm run dev
   ```

_Optional:_ To enable OAuth login, add Google/GitHub client IDs and secrets to `.env`. For temporary unrestricted access to `/admin`, comment out the role check in `app/admin/layout.tsx`.
