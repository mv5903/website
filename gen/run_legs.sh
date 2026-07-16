#!/bin/bash
# Architecture A: continuous forward take. Legs render SEQUENTIALLY —
# each leg's --start-image is the previous leg's ACTUAL last frame.
# No --end-image ever. 3 attempts per leg (NSFW/503 re-rolls).
# Usage: ./run_legs.sh            -> render all legs in order (skips ones already done)
#        ./run_legs.sh workshop   -> re-render one leg (and you must re-render all after it!)
WORK="$(cd "$(dirname "$0")" && pwd)"
NAMES="hero rack services workshop work campus finale"
VMODEL=seedance_2_0
VOPTS="--mode std --resolution 1080p"
DUR=8

extract_last() { # name -> frames/last_<name>.png
  ffmpeg -v error -y -sseof -0.15 -i "$WORK/legs/leg_$1.mp4" -frames:v 1 -q:v 2 "$WORK/frames/last_$1.png"
}

gen_leg() { # name startImage
  attempt=1
  while [ $attempt -le 3 ]; do
    echo "[leg $1] attempt $attempt (start: $2)"
    higgsfield generate create "$VMODEL" --prompt "$(cat "$WORK/prompts/leg_$1.txt")" \
      --start-image "$2" \
      $VOPTS --aspect_ratio 16:9 --duration "$DUR" \
      --wait --wait-timeout 20m --json > "$WORK/legs/leg_$1.json" 2> "$WORK/legs/leg_$1.err"
    url=$(jq -r '.[0].result_url // empty' "$WORK/legs/leg_$1.json")
    if [ -n "$url" ]; then
      curl -fsSL "$url" -o "$WORK/legs/leg_$1.mp4" && extract_last "$1" && echo "[leg $1] OK" && return 0
    fi
    echo "[leg $1] failed: $(head -c 300 "$WORK/legs/leg_$1.err") $(head -c 300 "$WORK/legs/leg_$1.json")"
    attempt=$((attempt+1))
  done
  echo "[leg $1] GAVE UP after 3 attempts"; return 1
}

prev=""
for n in $NAMES; do
  if [ "$prev" = "" ]; then start="$WORK/stills/still_hero.png"; else start="$WORK/frames/last_$prev.png"; fi
  if [ -n "$1" ] && [ "$1" != "$n" ]; then
    # single-leg mode: skip others, but still track prev for the start frame
    prev="$n"; continue
  fi
  if [ -z "$1" ] && [ -s "$WORK/legs/leg_$n.mp4" ]; then
    echo "[leg $n] already rendered, skipping"; extract_last "$n"; prev="$n"; continue
  fi
  gen_leg "$n" "$start" || exit 1
  prev="$n"
done
echo "ALL LEGS DONE"
