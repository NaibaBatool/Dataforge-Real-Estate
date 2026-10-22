# DataForge Estates — Real Estate Lead Qualification & Admin Portal

DataForge Estates is a high-performance web solution developed by DataForge for boutique real estate agencies. It demonstrates how modern luxury branding, automated customer qualification, deterministic property matching, and a secure internal lead-management portal work together.

---

## 1. Project Overview & Architecture

### Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Brand Identity**: DataForge Estates (Navy `#0B1F3A`, Gold `#C9A24B`, Background `#F7F5F0`).
- **Official Asset**: Logo located at `/images/dataforge_logo.jpeg` (1024x1024).
- **Backend API**: Next.js API Routes + Python Flask service with CORS and input validation.
- **Admin Portal**: Secure authentication via HTTP-only session tokens, real-time KPI metrics, lead dossier drawer, and workflow status persistence.
- **Database (Target / Ready)**: Supabase PostgreSQL schema with RLS security policies and seed data in `/supabase`.
- **Automation**: n8n webhook event dispatcher.

---

## 2. Administrator Portal & Access

### Credentials
- **Email**: `admin@dataforge.com`
- **Password**: `1234dataforge`
*(Configurable via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`)*

### Admin Features
1. **Discreet Public Navigation Access**:
   - Desktop: Click **"Admin"** with the shield badge in the top-right navbar.
   - Mobile: Click **"Admin Portal Login"** in the responsive slide-out menu.
   - Footer: **"Admin Portal"** link under Company.
2. **Dedicated Login (`/admin/login`)**:
   - Official DataForge logo and secure sign-in card.
   - Show/hide password control, server-side credential verification, and generic error handling.
   - Automatically redirects authenticated admins to `/admin/leads`.
3. **Protected Leads Dashboard (`/admin/leads`)**:
   - **Summary Metrics**: Live counts for Total Leads, Hot Leads, Warm Leads, and Cold Leads.
   - **Leads Table**: Displays customer name, submission timestamp, direct WhatsApp link, phone, email, purpose, property type, preferred neighborhoods, budget range, timeline, score/tier badge, and status.
   - **Sorting**: Prioritized by Hot &rarr; Warm &rarr; Cold, then by submission recency.
   - **Multi-Filter & Search**: Search by name, phone, email, or area; filter by Priority Tier, Purpose, and Workflow Status.
   - **Status Management**: Inline status dropdown (`New`, `Contacted`, `Qualified`, `Closed`) that updates the database/store via `PATCH /api/admin/leads/[id]`.
   - **Detailed Lead Dossier (Slide-over Drawer)**:
     - Customer contact channels with 1-click WhatsApp (`https://wa.me/...`), Phone, and Email.
     - Full requirement parameters and customer notes.
     - Transparent scoring breakdown (+3 for timeline, +2 for budget, etc.).
     - Matched inventory recommendations for that specific lead.

---

## 3. Public Customer-Facing Features (Preserved & Rebranded)

1. **Homepage (`/`)**:
   - Luxury hero section with DataForge Estates logo, quick-search assistant, trust badges, featured properties, services, team profiles, and WhatsApp CTA.
2. **Public Property Catalog (`/properties`)**:
   - Browse 24+ verified properties without signing up.
   - Working filters for Purpose (Buy / Rent), Property Type, Neighborhood, Max Price slider, and keyword search.
3. **Property Detail Pages (`/properties/[id]`)**:
   - Dynamic pages for `prop-01` to `prop-24` with high-res photos, specs, features, neighborhood insights, and WhatsApp booking.
4. **Progressive Qualification Flow (`/qualify`)**:
   - 6-step questionnaire capturing purpose, type, areas, budget, timeline, contact info, and consent.
   - Submissions automatically generate structured lead dossiers that appear in the Admin Portal!
5. **Personalized Property Matches (`/matches`)**:
   - Immediate deterministic property matches with transparent explanation badges (*e.g., "✓ Comfortably within budget"*).

---

## 4. Protected API Endpoints

- `POST /api/admin/auth/login` — Authenticates administrator, sets secure HTTP-only cookie.
- `POST /api/admin/auth/logout` — Destroys session cookie.
- `GET /api/admin/auth/me` — Checks current administrator authentication status.
- `GET /api/admin/leads` — Retrieves all qualified leads with search, filters, and metrics (requires admin session).
- `GET /api/admin/leads/[id]` — Retrieves single lead dossier and matched properties (requires admin session).
- `PATCH /api/admin/leads/[id]` — Updates workflow status (`new`, `contacted`, `qualified`, `closed`) (requires admin session).
- `GET /api/properties` — Public property listing endpoint.
- `GET /api/properties/[id]` — Public single property endpoint.
- `POST /api/leads` — Public customer qualification submission endpoint.
- `GET /api/leads/[id]/matches` — Public matched recommendations endpoint (PII safe).

---

## 5. Local Setup & Running Instructions

### 1. Running the Next.js Frontend & Admin Portal
```bash
# In the project root:
pnpm run dev
# OR if PATH is not refreshed in your PowerShell session:
pnpm.cmd run dev
```
- Open [http://localhost:3000](http://localhost:3000) for the public website.
- Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in to the Admin Portal.
  - **Email**: `admin@dataforge.com`
  - **Password**: `1234dataforge`

### 2. Running Automated Tests
```bash
pnpm test
# OR
node tests/auth.test.mjs && node tests/leads.test.mjs
```

### 3. Running TypeScript Typecheck & Production Build
```bash
pnpm run typecheck
pnpm run build
```

### 4. Running the Python Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python -m unittest discover -s .
python app.py
```
The Flask API runs at [http://localhost:5000](http://localhost:5000).
