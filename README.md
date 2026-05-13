# icompass Platform

A web-based learning and customer discovery platform for NSF icompass participants, instructors, and administrators. Built with React + Vite + Zustand. Deployable to GitHub Pages with zero backend.

![License](https://img.shields.io/badge/license-MIT-blue)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)

---

## Features

| Module | Participant | Instructor | Admin |
|---|---|---|---|
| Dashboard | Personal progress | Cohort overview | Platform analytics |
| Interview tracker | Log & manage own | View all teams | View all |
| Learning center | Complete modules | Monitor progress | Monitor progress |
| Hypothesis AI | Ollama-powered chat | — | — |
| Interview analysis AI | Ollama-powered chat | — | — |
| Teams view | — | Full team detail | Full team detail |
| Settings | — | — | Cohort config, export |

- **All data is stored in `localStorage`** — no backend, no auth server, no database
- **AI runs locally** via [Ollama](https://ollama.com) — your data never leaves your machine
- **Fully parameterized** via environment variables — one codebase, many deployments
- **GitHub Actions CI/CD** — push to `main`, auto-deploys to GitHub Pages

---

## Quick start (local dev)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/icompass-platform.git
cd icompass-platform

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local as needed (defaults work for local dev)

# 4. Start Ollama (required for AI features)
OLLAMA_ORIGINS="*" ollama serve
ollama pull llama3.2   # or any model you prefer

# 5. Run
npm run dev
```

Open http://localhost:5173 and select a role to begin.

---

## Deploy to GitHub Pages

### Step 1 — Enable GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Set **Source** to **GitHub Actions**

### Step 2 — Set environment variables

Go to **Settings → Secrets and variables → Actions → Variables** (not Secrets — these are non-sensitive build-time values):

| Variable | Example value | Notes |
|---|---|---|
| `VITE_BASE_URL` | `/icompass-platform/` | Must match your repo name, with leading and trailing `/` |
| `VITE_APP_NAME` | `icompass Platform` | Displayed in sidebar and browser tab |
| `VITE_APP_TAGLINE` | `Spring 2025 Cohort` | Subtitle under the app name |
| `VITE_OLLAMA_BASE_URL` | `http://localhost:11434` | URL of Ollama instance |
| `VITE_OLLAMA_MODEL` | `llama3.2` | Model name (must be pulled) |
| `VITE_OLLAMA_TIMEOUT` | `60000` | Request timeout in ms |
| `VITE_FEATURE_AI_HYPOTHESIS` | `true` | Show/hide hypothesis AI |
| `VITE_FEATURE_AI_ANALYSIS` | `true` | Show/hide interview analysis AI |
| `VITE_FEATURE_EXPORT` | `true` | Show/hide data export |
| `VITE_DEFAULT_INTERVIEW_GOAL` | `15` | Interview target per team |
| `VITE_STORAGE_KEY` | `icompass_v1` | localStorage namespace |

> **Tip:** If you skip setting variables, sensible defaults are used (see `deploy.yml`).

### Step 3 — Push to main

```bash
git add .
git commit -m "initial deploy"
git push origin main
```

The Actions workflow builds and deploys automatically. Your site will be live at:
`https://YOUR_USERNAME.github.io/icompass-platform/`

---

## Project structure

```
icompass-platform/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── public/
├── src/
│   ├── components/
│   │   ├── ui/                 # Primitive UI components (Button, Card, Modal…)
│   │   ├── layout/             # AppShell, Sidebar, TopBar, ProtectedRoute
│   │   ├── dashboard/          # Role-specific dashboards
│   │   ├── interviews/         # Interview tracker page
│   │   ├── courses/            # LMS / learning center
│   │   ├── ai/                 # AI chat pages (hypothesis + analysis)
│   │   ├── teams/              # Teams view
│   │   ├── admin/              # Settings page
│   │   └── RolePicker.jsx      # Login / role selection screen
│   ├── config/
│   │   ├── env.js              # All env vars — import from here, never from import.meta.env directly
│   │   └── roles.js            # Role definitions, permissions, nav structure
│   ├── hooks/
│   │   ├── useOllamaChat.js    # Streaming AI chat hook
│   │   └── useOllamaHealth.js  # Ollama connectivity check
│   ├── services/
│   │   ├── ollama.js           # Ollama API client (streaming, abort, error handling)
│   │   └── export.js           # CSV / JSON export utilities
│   ├── store/
│   │   ├── index.js            # Zustand store (persisted, immer mutations)
│   │   └── seed.js             # Demo seed data
│   ├── styles/
│   │   └── globals.css         # Tailwind base + global styles
│   ├── utils/
│   │   ├── cn.js               # className helper
│   │   └── format.js           # Date and number formatters
│   ├── App.jsx                 # Root router
│   └── main.jsx                # React entry point
├── .env.example                # All env vars documented
├── .env.local                  # Local overrides (gitignored)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Adding a new role

1. Add the role constant to `src/config/roles.js` → `ROLES`
2. Add metadata (label, icon, color) to `ROLE_META`
3. Add nav items to `ROLE_NAV`
4. Add a case to `src/components/dashboard/Dashboard.jsx`
5. Create `src/components/dashboard/YourRoleDashboard.jsx`

No other files need to change.

---

## Adding a new nav section

1. Add the route to `ROLE_NAV` in `src/config/roles.js`
2. Add the `<Route>` in `src/App.jsx`
3. Add the title to the `TITLES` map in `src/components/layout/AppShell.jsx`
4. Create your page component

---

## Ollama setup

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start with CORS enabled (required for browser access)
OLLAMA_ORIGINS="*" ollama serve

# Pull a model
ollama pull llama3.2       # recommended, fast
ollama pull mistral        # alternative
ollama pull llama3.1:8b    # larger, better reasoning

# List available models
ollama list
```

The AI features show a live connection status badge and gracefully display an error message if Ollama is unreachable.

---

## Resetting data

All data lives in `localStorage`. To reset to seed data:

```js
// In browser console:
localStorage.removeItem('icompass_v1')
location.reload()
```

Or change `VITE_STORAGE_KEY` to a new value to start fresh while keeping old data.

---

## License

MIT
