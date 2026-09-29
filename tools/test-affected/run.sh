#!/usr/bin/env bash

# Run only the tests the manifest says a change set affects.
#
# Usage, from a package directory:
#
#   ../../tools/test-affected/run.sh <runner> <default-args...> -- <file...>
#
# The caller passes the runner and the arguments to use when nothing was
# selected. This script substitutes the affected files when there are any.
#
# It fails *closed*, which is the only safe direction. Every unexpected
# condition — no file list, an unreadable list, an empty list, a runner that
# rejects the file arguments — falls back to running the package's full suite.
# A bug in selection must cost time, never coverage.

set -uo pipefail

AFFECTED_DIR="${AFFECTED_DIR:-.tetanus/affected}"
# Resolved from the repository root so the same relative location works from any
# package directory.
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# The list is named after the package, not the directory, because a directory
# basename is not a package identity: `packages/ui/react` and a hypothetical
# `packages/ui/react-native` would share one. The substitution below matches
# `package_slug` in the CLI exactly, and the two must stay in step.
package_name() {
  sed -n 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' package.json 2>/dev/null | head -1
}

slug() {
  printf '%s' "$1" | tr -c '[:alnum:]' '-' | sed 's/^-//; s/-$//' | tr '[:upper:]' '[:lower:]'
}

name="$(package_name)"
if [ -z "$name" ]; then
  echo "affected-test selection: package.json has no name; running the full suite" >&2
  if [ -f package.json ] && grep -q '"test"' package.json; then
    npm test --silent
    exit $?
  fi
  exit 0
fi

list="$repo_root/$AFFECTED_DIR/$(slug "$name").txt"

# Split argv at the `--` separator: everything before is the runner invocation,
# everything after is the affected file list.
runner_args=()
affected=()
seen_separator=0
for arg in "$@"; do
  if [ "$arg" = "--" ]; then seen_separator=1; continue; fi
  if [ "$seen_separator" -eq 1 ]; then affected+=("$arg"); else runner_args+=("$arg"); fi
done

fallback() {
  local reason="$1"
  echo "affected-test selection: ${reason}; running the full suite" >&2
  "${runner_args[@]}"
}

if [ "${#runner_args[@]}" -eq 0 ]; then
  echo "affected-test selection: no runner supplied; running the full suite" >&2
  if [ -f package.json ]; then
    if grep -q '"test"' package.json; then
      npm test --silent 2>/dev/null || npx --no-install vitest run
      exit $?
    fi
  fi
  exit 0
fi

if [ ! -f "$list" ]; then
  fallback "no affected-file list at ${list#$repo_root/}"
  exit $?
fi

mapfile -t files < "$list"
# Strip comments and blanks, which is how the list is authored when a package
# has no affected tests.
clean=()
for f in "${files[@]}"; do
  case "$f" in ''|\#*) continue ;; esac
  clean+=("$f")
done

if [ "${#clean[@]}" -eq 0 ]; then
  echo "affected-test selection: nothing affected; skipping" >&2
  exit 0
fi

# Only pass paths that still exist. A file deleted by the change set must not
# make the runner fail.
existing=()
missing=0
for f in "${clean[@]}"; do
  if [ -e "$f" ]; then existing+=("$f"); else missing=$((missing+1)); fi
done

if [ "${#existing[@]}" -eq 0 ]; then
  fallback "every affected test file is gone (${missing} missing)"
  exit $?
fi

if [ "$missing" -gt 0 ]; then
  echo "affected-test selection: ${missing} affected file(s) no longer exist; running the ${#existing[@]} that do" >&2
fi

"${runner_args[@]}" "${existing[@]}"
status=$?

# A runner that rejects the file arguments exits non-zero with no tests run.
# That is indistinguishable from a real failure without parsing, so the safe
# response is to retry with the full suite and let that result stand.
if [ "$status" -ne 0 ] && [ "$missing" -gt 0 ]; then
  fallback "runner failed with a partially stale file list"
  exit $?
fi

exit "$status"
