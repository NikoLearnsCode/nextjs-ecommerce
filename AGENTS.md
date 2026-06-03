# AGENTS.md

## Cursor Cloud specific instructions

### Services

| Service | Port | Notes |
|---------|------|--------|
| PostgreSQL 16 | 5432 | Not started automatically after install; run `sudo service postgresql start` before DB commands or the dev server. |
| Next.js (`npm run dev`) | 3000 | Single app — storefront, API routes, checkout, admin. |

There is no Docker Compose or separate API/worker process in this repo.

### First-time database setup (per machine / fresh DB)

1. Copy `.env.example` to `.env` and set `DB_URL`, `DB_SSL`, `AUTH_SECRET` (`openssl rand -base64 32`), and `AUTH_URL=http://localhost:3000`.
2. Create a local database (example): `sudo -u postgres psql -c "CREATE USER clothing_dev WITH PASSWORD 'clothing_dev' CREATEDB;"` and `CREATE DATABASE db OWNER clothing_dev;`
3. `npm run db:push`
4. Seed data — on Linux the script files are `scripts/SEEDcategories.ts` and `scripts/SEEDproducts.ts`, but `package.json` references lowercase `seedCategories.ts` / `seedProducts.ts`, so `npm run seed:c` and `npm run seed:p` fail on case-sensitive filesystems. Use:
   - `npx tsx scripts/SEEDcategories.ts`
   - `npx tsx scripts/SEEDproducts.ts 128`

### Routine dev commands

See `README.md` for the full flow. Quick reference:

- **Dev server:** `npm run dev`
- **Typecheck:** `npx tsc --noEmit` (no `lint` script in `package.json`; ESLint is a dependency only)
- **Production build:** `npm run build` then `npm run start`
- **DB browser (optional):** `npm run db:studio`

### OAuth and admin

Google/GitHub OAuth env vars are optional for **guest** flows (catalog, cart, checkout via “Continue as guest”). Login, profile, and admin require OAuth and a user with `role === 1` for admin (or temporarily commenting the check in `app/admin/layout.tsx` per README).

### Gotchas

- `DB_SSL` must be `"false"` for typical local Postgres; `"true"` for Neon/cloud URLs.
- Re-running category seed deletes existing categories first.
- Uploaded admin images land under `public/uploads/` (gitignored).
