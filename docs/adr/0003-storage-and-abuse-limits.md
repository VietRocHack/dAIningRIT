# 0003: Per-app storage, and abuse limits on the paid endpoint

**Status:** Accepted (2026-09-27)

## Context

`POST /api/recipes` is public and costs money on every call: one text and one
image generation. The original code wrote to the default Firestore database and
the `brickfoodapp.appspot.com` bucket, and made each image public with per-object ACLs.

## Decision

- Firestore: dedicated named database `dainingrit` (us-central1). Collections:
  `recipes`, `recipe_requests` (an audit log of inputs), `rate_limits`.
- Photos: bucket `vietrochack-lab-dainingrit` with uniform bucket-level access and
  `allUsers:objectViewer`. The objects are generated food photos, so public read is intended.
- Limits on `POST /api/recipes`, as Firestore transactional counters:
  - 5 per client IP per hour (`PER_IP_HOURLY_LIMIT`)
  - 150 per day across all users (`GLOBAL_DAILY_LIMIT`), a hard cost ceiling
  - Counter docs carry `expiresAt`, with a TTL policy on `rate_limits` so they self-delete.
- Input caps: 15 ingredients, 60 chars per field.
- Function `--max-instances=3`.

## Consequences

- Worst case is about 150 image generations a day, whatever an abuser does.
- The per-IP key comes from the first `X-Forwarded-For` entry, which a client
  can spoof (see `docs/backlog.md`). The global cap is what actually bounds cost.
- Likes aren't authenticated. Anyone can inflate a count. That's acceptable for a fun ranking.
