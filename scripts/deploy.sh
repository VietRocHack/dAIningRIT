#!/usr/bin/env bash
set -euo pipefail

# Deploys the API to Cloud Functions (gen2) and the frontend to the
# "dainingrit" Firebase Hosting site, both in vietrochack-lab. Same steps as
# .github/workflows/deploy.yml. See docs/adr/0001-deploy-topology.md and
# docs/runbook.md for the one-time setup this assumes.

cd "$(dirname "${BASH_SOURCE[0]}")/.."

PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-vietrochack-lab}"
REGION="${REGION:-us-central1}"
FUNCTION_NAME="${FUNCTION_NAME:-dainingrit-api}"

command -v gcloud >/dev/null || { echo "gcloud CLI not found"; exit 1; }
command -v firebase >/dev/null || { echo "firebase CLI not found: npm install -g firebase-tools"; exit 1; }

echo "==> Deploying $FUNCTION_NAME to Cloud Functions ($PROJECT_ID, $REGION)"
gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=python312 \
  --region="$REGION" \
  --source=backend \
  --entry-point=api \
  --trigger-http \
  --allow-unauthenticated \
  --memory=512Mi \
  --timeout=120s \
  --max-instances=3 \
  --set-env-vars=FIRESTORE_DATABASE=dainingrit,IMAGE_BUCKET=vietrochack-lab-dainingrit \
  --set-secrets=GEMINI_API_KEY=dainingrit-gemini-api-key:latest \
  --project="$PROJECT_ID"

echo "==> Building frontend"
(cd frontend && npm ci && npm run build)

echo "==> Deploying frontend to Firebase Hosting (dainingrit)"
firebase deploy --only hosting:dainingrit --project "$PROJECT_ID"

echo "==> Done: https://dainingrit.vietrochack.com (also https://vietrochack-dainingrit.web.app)"
