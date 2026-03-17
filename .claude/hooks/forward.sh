#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/c1d9040c-2525-4923-ac22-62ec5678e853/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 1ec9cb304f6bb366f17fb1158b02ba897c7a16d86f58e3227489c03c005717ad" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0