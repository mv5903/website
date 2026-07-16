#!/bin/bash
# Generate all 7 scene stills concurrently (gpt_image_2). bash 3.2 safe.
WORK="$(cd "$(dirname "$0")" && pwd)"
NAMES="hero rack services workshop work campus finale"

gen_still() { # name
  higgsfield generate create gpt_image_2 --prompt "$(cat "$WORK/prompts/still_$1.txt")" \
    --aspect_ratio 3:2 --resolution 2k --quality high --wait --wait-timeout 15m --json \
    > "$WORK/stills/still_$1.json" 2> "$WORK/stills/still_$1.err"
  url=$(jq -r '.[0].result_url // empty' "$WORK/stills/still_$1.json")
  if [ -n "$url" ]; then
    curl -fsSL "$url" -o "$WORK/stills/still_$1.png" && echo "still $1 ok"
  else
    echo "still $1 FAIL"
  fi
}

if [ -n "$1" ]; then gen_still "$1"; exit; fi   # re-roll a single still: ./run_stills.sh rack
for n in $NAMES; do gen_still "$n" & done
wait
echo "ALL STILLS DONE"
ls -la "$WORK/stills/"*.png 2>/dev/null
