#!/bin/bash
#
# DOUBLE-CLICK ME.
#
# Starts your site's local server and opens the editor at
# http://127.0.0.1:8888/admin.html
#
# The one thing this does that double-clicking "Start Site.command" does not:
# it checks first, and it will NOT start a second server.
#
# Why that matters. local-server.py takes the next free port if 8888 is busy,
# so a second double-click puts a server on 8889 and opens the site there.
# Everything looks normal. But the browser keeps your GitHub connection per
# ADDRESS, so the editor on 8889 has never heard of your token: "Save to
# GitHub" sits there dead. That reads exactly like a broken save and is not
# one. This script always lands you on 8888, or tells you why it can't.
#
# This Terminal window IS the server. Leave it open while you work.
# Ctrl+C stops it.

cd "$(dirname "$0")/.." || exit 1

PORT=8888
ADMIN="http://127.0.0.1:$PORT/admin.html"

# Is a server answering on 8888 AND actually serving your folder?
#
# It has to be both. On 29 Aug a server was found squatting on 8888 that
# answered /api/version perfectly and returned 404 for every real file,
# including index.html. It had been there since 25 Aug, which is why
# Start Site.command kept quietly landing on 8889. So the check asks for a
# real file: /api/version only reads a timestamp, and a timestamp is not
# proof that anything can be served.
ours() { curl -fs -o /dev/null --max-time 3 "http://127.0.0.1:$PORT/admin.html"; }

# Something is listening on the port but cannot serve the site.
squatter() {
  lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1 && ! ours
}

if ours; then
  echo ""
  echo "  Your server is already running. Opening the editor."
  echo ""
  open "$ADMIN"
  sleep 2
  exit 0
fi

if squatter; then
  echo ""
  echo "  Something is sitting on port $PORT but is not serving your site."
  echo "  Not starting a second server, because it would land on 8889 and the"
  echo "  editor there cannot save to GitHub."
  echo ""
  echo "  This clears it:"
  echo ""
  echo "      pkill -f local-server.py"
  echo ""
  echo "  That stops every copy of the server, including any window you have"
  echo "  open. Nothing is lost. Then double-click this file again."
  echo ""
  exit 1
fi

# Open the editor the moment the port answers, then hand this window to the
# server. The server opens the site itself, so you get two tabs: the site,
# which refreshes on its own every time you save, and the editor.
#
# Only if it actually comes up. Opening the editor at a port that never
# answered would put a "not found" page in front of you and make a server
# that failed to start look like an editor that is broken.
( for _ in $(seq 1 60); do
    if ours; then open "$ADMIN"; break; fi
    sleep 0.25
  done ) &

echo ""
echo "  Starting your site."
echo "  This window is the server: leave it open. Ctrl+C stops it."
echo ""
exec python3 local-server.py $PORT
