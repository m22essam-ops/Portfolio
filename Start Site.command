#!/bin/bash
# Double-click me (macOS) to start your portfolio's local server and open the
# site in your browser. Stop it with Ctrl+C in the Terminal window that opens.
cd "$(dirname "$0")"
exec python3 local-server.py
