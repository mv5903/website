#!/bin/bash
# Encode legs for scrubbing: desktop (native 1080p, g8) + mobile beta (720p, g4).
# Also convert stills to webp posters.
WORK="$(cd "$(dirname "$0")" && pwd)"
SITE="$(dirname "$WORK")"
NAMES="hero rack services workshop work campus finale"

enc() { ffmpeg -v error -y -i "$1" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$2"; echo "enc $2 $(du -h "$2"|cut -f1)"; }

encm() { ffmpeg -v error -y -i "$1" -an -vf "scale=1280:720,unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$2"; echo "encm $2 $(du -h "$2"|cut -f1)"; }

for n in $NAMES; do
  enc  "$WORK/legs/leg_$n.mp4" "$SITE/assets/vid/$n.mp4"
  encm "$WORK/legs/leg_$n.mp4" "$SITE/assets/vid/$n-m.mp4"
  if command -v cwebp >/dev/null; then
    cwebp -quiet -q 84 -resize 1800 0 "$WORK/stills/still_$n.png" -o "$SITE/assets/$n.webp"
  else
    ffmpeg -v error -y -i "$WORK/stills/still_$n.png" -vf "scale=1800:-2" -quality 84 "$SITE/assets/$n.webp"
  fi
done
echo "ENCODE DONE"; ls -la "$SITE/assets/vid/"
