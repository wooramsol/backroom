#!/usr/bin/env bash
set -euo pipefail

echo "BUILD_TIME=$(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M:%S')" >> "${GITHUB_ENV:?}"
echo "BUILD_SHA=$(git rev-parse HEAD)" >> "${GITHUB_ENV}"

PR="${BUILD_PR_OVERRIDE:-}"
if [ -z "$PR" ]; then
  PR="$(git log -1 --pretty=%B | sed -n 's/^Merge pull request #\([0-9]*\).*/\1/p')"
fi

if [ -z "$PR" ]; then
  PR="$(git log -1 --pretty=%B | sed -n 's/.*PR #\([0-9][0-9]*\).*/\1/p' | head -1)"
fi

if [ -z "$PR" ]; then
  BRANCH="$(git log -1 --pretty=%B | sed -n 's/.*auto-promote[[:space:]]\+\(cursor\/[^[:space:]]*\).*/\1/p')"
  if [ -n "$BRANCH" ] && command -v gh >/dev/null 2>&1; then
    PR="$(gh pr list --state merged --head "$BRANCH" --json number -q '.[0].number' 2>/dev/null || true)"
  fi
fi

if [ -z "$PR" ]; then
  PR="$(git log -30 --pretty=%B | sed -n 's/^Merge pull request #\([0-9]*\).*/\1/p' | head -1)"
fi

if [ -n "$PR" ]; then
  echo "BUILD_PR=$PR" >> "${GITHUB_ENV}"
fi
