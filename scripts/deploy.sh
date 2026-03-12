#!/usr/bin/env bash
set -euo pipefail

# Deploy Norsk Tracker to Scaleway Object Storage
#
# Prerequisites:
#   1. Install the AWS CLI (Scaleway is S3-compatible):
#      brew install awscli
#
#   2. Create a Scaleway account and:
#      - Create an Object Storage bucket (e.g. "norsk-tracker")
#      - Enable "Static Website Hosting" on the bucket
#      - Generate API keys (Access Key + Secret Key)
#
#   3. Configure credentials:
#      aws configure --profile scaleway
#        AWS Access Key ID: <your SCW access key>
#        AWS Secret Access Key: <your SCW secret key>
#        Default region: fr-par
#        Default output format: json
#
# Usage:
#   ./scripts/deploy.sh

BUCKET="${SCW_BUCKET:-lang-learning-tracking-app}"
REGION="${SCW_REGION:-fr-par}"
ENDPOINT="https://s3.${REGION}.scw.cloud"
PROFILE="${AWS_PROFILE:-scaleway}"

echo "Building..."
npm run build

echo "Deploying to Scaleway bucket: ${BUCKET} (${REGION})..."

# Sync all files
# Exclude externally-managed paths from --delete so they aren't wiped:
#   curated-resources.json  — written by the indexer serverless function
#   audio/*                 — audio files uploaded by scripts/ingest-ntnu-now.mjs
#                             (not in out/, so --delete would remove them)
aws s3 sync out/ "s3://${BUCKET}/" \
  --endpoint-url "${ENDPOINT}" \
  --profile "${PROFILE}" \
  --delete \
  --exclude "*.wasm" \
  --exclude "_next/static/*" \
  --exclude "curated-resources.json" \
  --exclude "audio/*"

# Upload immutable assets with long cache
aws s3 sync out/_next/static/ "s3://${BUCKET}/_next/static/" \
  --endpoint-url "${ENDPOINT}" \
  --profile "${PROFILE}" \
  --cache-control "public, max-age=31536000, immutable"

# Upload WASM with correct content type
aws s3 cp out/sql-wasm.wasm "s3://${BUCKET}/sql-wasm.wasm" \
  --endpoint-url "${ENDPOINT}" \
  --profile "${PROFILE}" \
  --content-type "application/wasm" \
  --cache-control "public, max-age=31536000, immutable"

echo ""
echo "Deployed! Your site is at:"
echo "  https://${BUCKET}.s3-website.${REGION}.scw.cloud"
