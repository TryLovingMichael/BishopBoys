# BishopBoys — Operations Dashboard

A secure, dark-mode, dashboard-style web application. Deployable as a static site to Netlify. Features a password-protected hub, an ImHex-style hex/binary editor, and a full case management system.

---

## Stack

- **Framework**: React 18 + TypeScript (Vite)
- **Routing**: React Router v6
- **State**: Zustand + localStorage persistence
- **Styles**: Tailwind CSS v4 + CSS custom properties
- **Auth**: Netlify Edge Functions (Deno), HTTP-only cookie
- **Deployment**: Netlify (static + edge functions)

---

## Local Development

### Prerequisites

- Node.js 18+
- Netlify CLI (for local edge function testing)

### Install

```bash
npm install
```

### Run (Vite dev server only — auth API calls will fail without Netlify CLI)

```bash
npm run dev
```

### Run with full Edge Function support (recommended)

```bash
npm install -g netlify-cli
netlify dev
```

When using `netlify dev`, set a local env variable so the edge function works:

```bash
# Create a .env file at the project root (never commit this)
SITE_PASSWORD=your_local_password
```

---

## Project Structure

```
BishopBoys/
├── netlify/
│   └── edge-functions/
│       ├── auth.ts       # POST /api/login — validates password, sets cookie
│       ├── verify.ts     # GET /api/verify — validates session cookie
│       └── logout.ts     # POST /api/logout — clears cookie
├── src/
│   ├── components/
│   │   ├── auth/         ProtectedRoute.tsx
│   │   ├── cases/        CaseCard, CaseForm, CaseList, CaseExportImport
│   │   ├── hex/          HexEditor, HexPane, DataInspector, ColorBar, MagicBytes
│   │   └── layout/       AppShell, Sidebar, StatusBar
│   ├── hooks/            useAuth.ts, useHexBuffer.ts
│   ├── pages/            LoginPage, DashboardPage, HexEditorPage, CaseManagerPage
│   ├── router/           index.tsx
│   ├── store/            authStore.ts, caseStore.ts
│   ├── types/            hex.ts, cases.ts
│   ├── utils/            hexUtils, dataInspector, magicBytes, caseUtils
│   └── styles/           globals.css
├── netlify.toml
└── vite.config.ts
```

---

## Netlify Deployment

### Step 1 — Push to a Git repository

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2 — Create a Netlify site

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect your Git provider and select this repository

### Step 3 — Configure build settings

Netlify should auto-detect from `netlify.toml`, but verify:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

### Step 4 — Set the environment variable (CRITICAL)

1. In your Netlify site dashboard, go to **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Set:
   - **Key**: `SITE_PASSWORD`
   - **Value**: your chosen password (strong, no spaces)
4. Click **Save**

> The edge functions read `Deno.env.get('SITE_PASSWORD')`. Without this variable set in the Netlify dashboard, login will return a 500 error.

### Step 5 — Deploy

Trigger a deploy from the Netlify dashboard, or push to your main branch to trigger automatic deployment.

---

## Authentication Flow

1. User visits any protected route → redirected to `/login`
2. User submits password → `POST /api/login` (Netlify Edge Function)
3. Edge function compares against `SITE_PASSWORD` env var
4. On match: sets `bb_auth` HTTP-only, Secure, SameSite=Strict cookie (8-hour expiry)
5. Client sets `isAuthenticated = true` in Zustand → navigates to `/dashboard`
6. On page reload: `GET /api/verify` validates cookie server-side
7. Logout: `POST /api/logout` clears cookie, redirects to `/login`

---

## Case Management — Data Persistence

Cases are stored in **browser localStorage** via Zustand persist middleware. This is per-device and per-browser.

### Export cases

Click **EXPORT JSON** in the Case Manager toolbar. Downloads a timestamped `.json` file.

### Import cases

Click **IMPORT JSON**, select a previously exported file. Duplicate case IDs are skipped (merge, not overwrite).

### Backup recommendation

Export to JSON regularly. Store exports in a secure location.

---

## Hex Editor

- Drag-and-drop or browse any file to load it
- Supports files of any size (virtual scrolling — only visible rows render)
- Click any byte to select it; the Data Inspector panel updates in real time
- **Data Inspector** shows: binary, all integer types (8/16/24/32-bit, signed/unsigned, LE/BE), floats (32/64-bit), ASCII, UTF-8, RGB/RGBA/RGB565 color swatches
- **File Signature** panel auto-detects 30+ common formats (PNG, JPEG, PDF, ZIP, ELF, PE, MP3, MP4, SQLite, etc.)
- Read-only viewer — no byte editing

---

## Security Notes

- The `SITE_PASSWORD` env var is **never** exposed to the client
- The auth cookie is `HttpOnly` (not accessible from JavaScript), `Secure` (HTTPS only), `SameSite=Strict`
- Cookie payload is time-limited (8 hours)
- No sensitive data is stored in the cookie — only a timestamp + random token
- This is a single-password gate, not a multi-user auth system
