#!/usr/bin/env bash
set -euo pipefail

# Deploy the conversation proxy to Scaleway Serverless Functions
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
#        name=converse \
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
#      export SCW_FUNCTION_NAMESPACE_ID=0ccbab11-6348-439f-b60c-0bc77217bc71
#      export SCW_CONVERSE_FUNCTION_ID=6a0b5320-3070-4697-a1e6-0b9540bbfb11
#
# Usage:
#   ./scripts/deploy-converse.sh

NAMESPACE_ID="${SCW_FUNCTION_NAMESPACE_ID:?Set SCW_FUNCTION_NAMESPACE_ID}"
FUNCTION_ID="${SCW_CONVERSE_FUNCTION_ID:?Set SCW_CONVERSE_FUNCTION_ID}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FUNCTION_DIR="${PROJECT_DIR}/functions/converse"
ZIP_FILE="/tmp/norsk-tracker-converse.zip"

echo "Packaging function..."
(cd "$FUNCTION_DIR" && zip -r "$ZIP_FILE" . -x '*.DS_Store')

echo "Deploying to Scaleway..."
scw function deploy \
  namespace-id="$NAMESPACE_ID" \
  name="converse" \
  runtime="node22" \
  zip-file="$ZIP_FILE"

rm -f "$ZIP_FILE"

echo ""
echo "Deployed! Get the function URL with:"
echo "  scw function get $FUNCTION_ID"
