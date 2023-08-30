#!/bin/bash

set -e

BRANCH_NAME="feat/update-auto-generated-models"

git config user.name devopness-automations
git config user.email automations@devopness.com

git fetch
if git checkout "$BRANCH_NAME" 2> /dev/null; then
    echo ::set-output name=pr_exists::true
else
    git checkout main
    git checkout -b "$BRANCH_NAME"
    echo ::set-output name=pr_exists::false
fi

npm run api-docs-zip-download
npm run api-docs-zip-extract
npm run api-docs-make-description-files

if [ -z "$(git status --porcelain)" ]; then
    echo "Auto generated models are up to date. Nothing to commit!"
    echo ::set-output name=has_changes::false
    exit 0
fi

git add .
git commit -m "feat: update auto generated models"

git push origin "$BRANCH_NAME"
echo ::set-output name=has_changes::true
