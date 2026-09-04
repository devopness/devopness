#!/usr/bin/env bash

set -euo pipefail

# Import the generated API docs models from S3.
# This script is invoked by `.github/workflows/sync-api-spec.yml`.
# The workflow creates `apps/api-docs/.env` before calling this file, so the
# AWS credentials can be sourced locally without duplicating the import logic
# in the workflow itself.
#
# Local usage:
#   bash .github/scripts/sync-api-spec-import-auto-generated-models.sh
#
# Required environment variables after sourcing `.env`:
#   CREDENTIAL_AWS_ACCESS_KEY_ID
#   CREDENTIAL_AWS_SECRET_ACCESS_KEY

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
API_DOCS_DIR="${ROOT_DIR}/apps/api-docs"

cd "${API_DOCS_DIR}"

set -a
. ./.env
set +a

export AWS_ACCESS_KEY_ID="${CREDENTIAL_AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${CREDENTIAL_AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION=us-east-1

npm run api-docs-zip-download
npm run api-docs-zip-extract
npm run api-docs-make-description-files
