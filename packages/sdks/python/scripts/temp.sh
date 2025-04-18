#!/usr/bin/env bash

# TEMPORARY CLEANUP FOR INITIAL SDK DEVELOPMENT
#
# We're removing all generated files that are not user-related
# to keep the number of auto-generated files as low as possible
# during the development of SDK version 1.
# This helps validate the core structure and functionality
# of the SDK before exposing all endpoints.

echo "🧽  Removing non-user related service files..."

KEEP=(
  "user"
  "credits import"
  "language import"
  "social_account_displayable_name import"
  "social_account_provider import"
  "social_account_relation import"
  "static_billing_info import"
  "subscription import"
  "subscription_balance import"
  "subscription_plan import"
  "triggered_actions import"
  "triggered_action_stats import"
  "triggered_action_summary import"
)

INIT_FILE="devopness/api/generated/models/__init__.py"
GREP_EXPR=$(printf "|^from .%s" "${KEEP[@]}")
GREP_EXPR=${GREP_EXPR:1}
grep -E "$GREP_EXPR" "$INIT_FILE" >"${INIT_FILE}.tmp" && mv "${INIT_FILE}.tmp" "$INIT_FILE" --force

find "devopness/api/generated/api" -type f -name '*.py' \
  ! -iname 'user*.py' \
  ! -iname '__init__.py' \
  -exec rm -f {} +

find "devopness/api/generated/models" -type f -name '*.py' \
  ! -iname 'user*.py' \
  ! -iname '__init__.py' \
  ! -iname 'credits.py' \
  ! -iname 'language.py' \
  ! -iname 'social_account_displayable_name.py' \
  ! -iname 'social_account_provider.py' \
  ! -iname 'social_account_relation.py' \
  ! -iname 'static_billing_info.py' \
  ! -iname 'subscription.py' \
  ! -iname 'subscription_balance.py' \
  ! -iname 'subscription_plan.py' \
  ! -iname 'triggered_actions.py' \
  ! -iname 'triggered_action_stats.py' \
  ! -iname 'triggered_action_summary.py' \
  -exec rm -f {} +
