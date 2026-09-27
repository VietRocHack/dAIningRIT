# 0001: One origin: Firebase Hosting + a single gen2 Cloud Function

**Status:** Accepted (2026-09-27)

## Context

The hackathon version was two repos. The CRA frontend was on Firebase Hosting in a
teammate's personal `brickfoodapp` project. It called two separate personal Cloud
Functions (`find_recipe`, `ranking`) by absolute `cloudfunctions.net` URL, with
`Access-Control-Allow-Origin: *`. `ranking` multiplexed like/unlike/list through an
`action` field in a POST body. Each function loaded a `serviceAccount.json` from disk.

## Decision

- Merge both repos into this one (`backend/`, `frontend/`, history kept via `git subtree`).
- Collapse the two functions into **one** gen2 Cloud Function, `dainingrit-api`
  (entry point `api`), which routes on `request.path`. The app is a static frontend
  plus a few small HTTP routes, so the migration guide's "single HTTP function"
  row applies. It doesn't need Cloud Run.
- Firebase Hosting site `vietrochack-dainingrit` rewrites `/api/**` to that function.
  The frontend uses relative `/api/...` URLs, so there's no CORS.
- Use Application Default Credentials (the function's runtime service account)
  instead of a service-account key file.
- Frontend moved from Create React App to Vite.

## Consequences

- One deploy unit per side and one DNS record.
- The API became REST-shaped (`GET /api/ranking`, `POST /api/recipes/<id>/like`, ...)
  instead of the `action` field. No other clients existed, so there's nothing to keep compatible.
- Added `GET /api/recipes/<id>` so recipe cards survive reloads and can be shared as links.
  Previously they depended on in-memory router state and crashed on refresh.
