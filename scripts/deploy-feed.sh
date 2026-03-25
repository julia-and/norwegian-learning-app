#!/usr/bin/env bash
set -euo pipefail

# Deploy the feed generator to Scaleway Serverless Functions
#
# Prerequisites:
#   1. Install the Scaleway CLI:
#      brew install scw
#
#   2. Initialize the CLI with your Scaleway credentials:
#      scw init
#
#   3. Create the function (one-time):
#      scw function function create \
#        namespace-id=<NAMESPACE_ID> \
#        name=generate-feed \
#        runtime=node22 \
#        handler=handler.handle \
#        memory-limit=256 \
#        min-scale=0 \
#        max-scale=5 \
#        secret-environment-variables.0.key=ANTHROPIC_API_KEY \
#        secret-environment-variables.0.value=<YOUR_ANTHROPIC_KEY> \
#        environment-variables.ALLOWED_ORIGIN=https://lang-learning-tracking-app.s3-website.fr-par.scw.cloud
#      Note the function ID from the output.
#
#   4. Set environment variables below or export them:
#      export SCW_FUNCTION_NAMESPACE_ID=<your-namespace-id>
#      export SCW_FEED_FUNCTION_ID=<your-function-id>
#
# Usage:
#   ./scripts/deploy-feed.sh

NAMESPACE_ID="${SCW_FUNCTION_NAMESPACE_ID:?Set SCW_FUNCTION_NAMESPACE_ID}"
FUNCTION_ID="${SCW_FEED_FUNCTION_ID:?Set SCW_FEED_FUNCTION_ID}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FUNCTION_DIR="${PROJECT_DIR}/functions/generate-feed"
ZIP_FILE="/tmp/norsk-tracker-generate-feed.zip"

echo "Packaging function..."
(cd "$FUNCTION_DIR" && zip -r "$ZIP_FILE" . -x '*.DS_Store')

echo "Deploying to Scaleway..."
scw function deploy \
  namespace-id="$NAMESPACE_ID" \
  name="generate-feed" \
  runtime="node22" \
  zip-file="$ZIP_FILE"

rm -f "$ZIP_FILE"

echo ""
echo "Deployed! Get the function URL with:"
echo "  scw function function get $FUNCTION_ID"
echo ""
echo "Then set NEXT_PUBLIC_FEED_API_URL to the endpoint URL before building the frontend."
