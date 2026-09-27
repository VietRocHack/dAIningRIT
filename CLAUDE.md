# CLAUDE.md

dAIningRIT: "when dining hall meets AI". Pick a cuisine and some ingredients and
Gemini invents a no-cook dish from what RIT's dining hall is serving, with the
station each ingredient comes from and a generated photo. Others can browse and
like today's dishes. Built at BrickHack X (Feb 2024); see `docs/product/pitch.md`.

Live at https://dainingrit.vietrochack.com (also https://vietrochack-dainingrit.web.app).

## Repo map

- `frontend/`: Vite + React UI (MUI, styled-components). Calls a relative `/api/...`
  (`src/api.js`). Hosting rewrites `/api/**` to the function, so no CORS
  (`docs/adr/0001-deploy-topology.md`).
- `backend/`: one Python Cloud Function (gen2), `dainingrit-api`, entry point `api`
  in `main.py`. Routes:
  - `POST /api/recipes` `{cuisine, ingrs}`: generate and store a recipe (rate-limited)
  - `GET /api/recipes/<id>`
  - `POST /api/recipes/<id>/like` `{liked}`
  - `GET /api/ranking`: today's recipes (Eastern time), most-liked first
  - `menu.json` is the dining hall menu snapshot, bundled with the function.
- `firebase.json` / `.firebaserc`: Hosting site `vietrochack-dainingrit`, target `dainingrit`.
- `scripts/deploy.sh` and `.github/workflows/deploy.yml`: the same deploy, manual and on push to `main`.
- `docs/`: ADRs, runbook, backlog, progress log.

Git history of both original repos (`dAIningRIT-backend`, `VuDuc1610/dAIning-rit`) is
preserved via `git subtree` under `backend/` and `frontend/`.

## Before changing anything architectural

Read `docs/adr/` first. If you're making a different choice than one recorded
there, add a new ADR (or mark the old one superseded). Don't silently deviate.

## Progress logging: one file per day

`docs/progress/YYYYMMDD.md`, **one file per calendar day**. At the end of a work
session, append a `## HH:MM — title` section to today's file: what changed,
decisions made, open TODOs. Create the file if needed; never make a second file
for the same day. At the **start** of a session, read the most recent progress
file.

## Running things

```bash
# Backend (needs `gcloud auth application-default login` with access to vietrochack-lab)
cd backend
python -m venv .venv && .venv/Scripts/pip install -r requirements.txt   # bin/ on macOS/Linux
export GOOGLE_CLOUD_PROJECT=vietrochack-lab
export GEMINI_API_KEY="$(gcloud secrets versions access latest --secret=dainingrit-gemini-api-key --project=vietrochack-lab)"
.venv/Scripts/functions-framework --target=api --port=8080

# Frontend (Vite proxies /api to localhost:8080; override with API_PROXY_TARGET)
cd frontend
npm install
npm run dev            # http://localhost:5173

# Deploy (manual). CI does the same on push to main.
bash scripts/deploy.sh
```

Local dev talks to the **real** `dainingrit` Firestore database and bucket.
Recipes you generate locally show up on the live ranking page.

Windows: stop the Vite dev server before `npm ci`; it holds `esbuild.exe` open.

## No test suite

Verify by running the app and clicking through: cuisine → ingredients →
recipe card (like it, reload it) → "See others". Check the network tab.
