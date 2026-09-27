# Runbook

## One-time setup (done 2026-09-27)

All in GCP project `vietrochack-lab`:

- APIs enabled: `cloudfunctions`, `run`, `cloudbuild`, `artifactregistry`, `eventarc`,
  `firestore`, `secretmanager`, `generativelanguage`, `apikeys`
- Firestore database `dainingrit` (native, `us-central1`), with a TTL policy on
  `rate_limits.expiresAt`
- Bucket `gs://vietrochack-lab-dainingrit` (`us-central1`, uniform access,
  `allUsers:objectViewer`). The runtime SA
  `246457606106-compute@developer.gserviceaccount.com` has `storage.objectCreator` on it.
- API key `dainingrit-gemini`, restricted to `generativelanguage.googleapis.com`.
  Its value lives only in Secret Manager secret `dainingrit-gemini-api-key`
  (the runtime SA has `secretAccessor` on it).
- Cloud Function `dainingrit-api` (gen2, python312, us-central1, max 3 instances)
- Firebase Hosting site `vietrochack-dainingrit`, target `dainingrit`
- Custom domain `dainingrit.vietrochack.com` requested on that site. Needs at
  Namecheap: `CNAME dainingrit -> vietrochack-dainingrit.web.app` (plus any TXT
  `_acme-challenge.dainingrit` record the status check below asks for).
- Budget: covered by the existing project-wide `vietrochack-lab` budget alert.
  `gcf-artifacts` already has the cleanup policy.
- Workload Identity Federation: provider `dainingrit` in the shared `github` pool,
  locked to `VietRocHack/dAIningRIT`, bound to
  `gh-actions-deploy-dainingrit@vietrochack-lab.iam.gserviceaccount.com`.
  Repo variables `WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` are set.

## Ongoing

- **Deploy:** push to `main`. Manual: `bash scripts/deploy.sh`.
- **Custom domain status:**
  ```bash
  TOKEN=$(gcloud auth print-access-token)
  curl -s "https://firebasehosting.googleapis.com/v1beta1/projects/vietrochack-lab/sites/vietrochack-dainingrit/customDomains/dainingrit.vietrochack.com" \
    -H "Authorization: Bearer $TOKEN" -H "X-Goog-User-Project: vietrochack-lab"
  ```
  Done when `hostState: HOST_ACTIVE` and `ownershipState: OWNERSHIP_ACTIVE`.
- **Logs:** `gcloud functions logs read dainingrit-api --gen2 --region=us-central1 --project=vietrochack-lab`
- **Rotate the Gemini key:** create a new restricted key, then
  `gcloud secrets versions add dainingrit-gemini-api-key --data-file=- --project=vietrochack-lab`,
  then redeploy (the function pins `:latest` at deploy time).
- **Check available models** (names get retired):
  ```bash
  curl -s "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200" \
    -H "x-goog-api-key: $(gcloud secrets versions access latest --secret=dainingrit-gemini-api-key --project=vietrochack-lab)"
  ```
- **Update the menu:** edit `backend/menu.json` (see backlog: it's a Feb 2024 snapshot).

## Credits

- Background and tiger mascot images: from the original hackathon repo (team-made/sourced).
- Favicon: VietRocHack `icon.svg` from the `home` repo.
- Fonts: Cormorant (cdnfonts), Londrina Outline (Google Fonts), both SIL OFL.
