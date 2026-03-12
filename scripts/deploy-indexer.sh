#!/usr/bin/env bash
set -euo pipefail

# Deploy the resource indexer to Scaleway Serverless Functions
#
# Prerequisites:
#   1. Install the Scaleway CLI:
#      brew install scw
#
#   2. Create the function (one-time):
#      scw function function create \
#        namespace-id=<NAMESPACE_ID> \
#        name=index-resources \
#        runtime=node22 \
#        handler=handler.handle \
#        memory-limit=256 \
#        min-scale=0 \
#        max-scale=1 \
#        timeout=60s \
#        environment-variables.S3_REGION=fr-par \
#        environment-variables.S3_BUCKET=lang-learning-tracking-app \
#        secret-environment-variables.0.key=S3_ACCESS_KEY \
#        secret-environment-variables.0.value=<YOUR_ACCESS_KEY> \
#        secret-environment-variables.1.key=S3_SECRET_KEY \
#        secret-environment-variables.1.value=<YOUR_SECRET_KEY> \
#        secret-environment-variables.2.key=YOUTUBE_API_KEY \
#        secret-environment-variables.2.value=<YOUR_YOUTUBE_API_KEY>
#      Note the function ID from the output.
#
#   3. Set up cron trigger (one-time, every 6 hours):
#      scw function cron create \
#        function-id=<INDEXER_FUNCTION_ID> \
#        schedule="11 1 2 */1 *" \
#        name=index-resources-cron
#
#   4. Set environment variables:
#      export SCW_FUNCTION_NAMESPACE_ID=<your-namespace-id>
#      export SCW_INDEXER_FUNCTION_ID=<your-function-id>
#
# Usage:
#   ./scripts/deploy-indexer.sh

NAMESPACE_ID="${SCW_FUNCTION_NAMESPACE_ID:?Set SCW_FUNCTION_NAMESPACE_ID}"
FUNCTION_ID="${SCW_INDEXER_FUNCTION_ID:?Set SCW_INDEXER_FUNCTION_ID}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FUNCTION_DIR="${PROJECT_DIR}/functions/index-resources"
ZIP_FILE="/tmp/norsk-tracker-index-resources.zip"

echo "Installing dependencies..."
(cd "$FUNCTION_DIR" && npm install --production)

echo "Packaging function..."
(cd "$FUNCTION_DIR" && zip -r "$ZIP_FILE" . -x '*.DS_Store' -x 'node_modules/.cache/*')

echo "Deploying to Scaleway..."
scw function deploy \
  namespace-id="$NAMESPACE_ID" \
  name="index-resources" \
  runtime="node22" \
  zip-file="$ZIP_FILE"

rm -f "$ZIP_FILE"

echo ""
echo "Deployed! Get the function URL with:"
echo "  scw function function get $FUNCTION_ID"
echo ""
echo "Trigger a manual run:"
echo "  curl -X POST <FUNCTION_URL>"
