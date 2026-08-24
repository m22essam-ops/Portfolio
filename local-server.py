#!/usr/bin/env python3
"""Local portfolio server.

Serves the whole portfolio folder so you can view it at http://127.0.0.1:8888/,
AND gives admin.html a way to save without downloading anything:

    POST /api/save   body: {"content": "...content.js source...",
                            "files": {"name.jpg": "<base64>", ...}}
    -> writes content.js and any files into images/ right here in the folder.

    GET  /api/version  -> {"ok": true, "version": "<content.js mtime>"}
    -> the site polls this and reloads itself when content.js changes, so
       after "Save locally" the site tab updates with no Cmd+R.

Run it by double-clicking "Start Site.command" (macOS) or from a terminal:

    python3 local-server.py          # uses port 8888 (or the next free one)

Press Ctrl+C to stop.
"""
import base64
import http.server
import json
import os
import re
import socket
import sys
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PORT = 8888


def pick_port(start):
    for p in range(start, start + 20):
        s = socket.socket()
        try:
            s.bind(('127.0.0.1', p))
            s.close()
            return p
        except OSError:
            s.close()
    return start


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # let admin.html opened straight from the folder (file://) reach the
        # save endpoint too
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # never cache: this is an editing workflow, every change should show
        # immediately on refresh (or on the auto-refresh below)
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path.rstrip('/') == '/api/version':
            try:
                version = str(os.path.getmtime(os.path.join(ROOT, 'content.js')))
            except OSError:
                version = '0'
            self.send_json({'ok': True, 'version': version})
            return
        if self.headers.get('Range') and self.serve_range():
            return
        super().do_GET()  # everything else: serve the site as usual

    def serve_range(self):
        """Answer a Range request, which the stock handler does not.

        Without this a browser can only ever play a video from the start:
        dragging the scrubber, or setting currentTime, needs the server to be
        able to hand back the middle of a file, and the stock handler always
        replies 200 with the whole thing. The browser reads that as "ranges
        not supported" and refuses to seek, so currentTime silently stays at
        0. It looks exactly like a broken video.

        Returns True if it answered, False to let the normal path handle it.
        """
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return False
        try:
            size = os.path.getsize(path)
            m = re.match(r'bytes=(\d*)-(\d*)\s*$', self.headers.get('Range', ''))
            if not m:
                return False
            start, end = m.group(1), m.group(2)
            if start == '':
                if end == '':
                    return False
                length = min(int(end), size)          # the last N bytes
                start, end = size - length, size - 1
            else:
                start = int(start)
                end = int(end) if end else size - 1
            if start >= size or start > end:
                self.send_response(416)
                self.send_header('Content-Range', 'bytes */%d' % size)
                self.send_header('Content-Length', '0')
                self.end_headers()
                return True
            end = min(end, size - 1)
            length = end - start + 1

            self.send_response(206)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
            self.send_header('Content-Length', str(length))
            self.end_headers()
            with open(path, 'rb') as f:
                f.seek(start)
                left = length
                while left > 0:
                    chunk = f.read(min(64 * 1024, left))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    left -= len(chunk)
            return True
        except (BrokenPipeError, ConnectionResetError):
            return True          # the browser moved on; not an error worth noise
        except Exception:
            return False         # anything unexpected: fall back to the whole file

    def do_POST(self):
        if self.path.rstrip('/') != '/api/save':
            self.send_json({'ok': False, 'error': 'Unknown endpoint'}, 404)
            return
        try:
            length = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
        except Exception as e:
            self.send_json({'ok': False, 'error': 'Bad request: %s' % e}, 400)
            return
        try:
            if isinstance(payload.get('content'), str):
                with open(os.path.join(ROOT, 'content.js'), 'w', encoding='utf-8') as f:
                    f.write(payload['content'])
            written = []
            files = payload.get('files') or {}
            if isinstance(files, dict):
                for name, b64 in files.items():
                    clean = re.sub(r'[^A-Za-z0-9._ \-]', '', os.path.basename(name))
                    if not clean:
                        continue
                    try:
                        data = base64.b64decode(b64)
                    except Exception:
                        continue
                    with open(os.path.join(ROOT, 'images', clean), 'wb') as f:
                        f.write(data)
                    written.append(clean)
            self.send_json({'ok': True, 'files': written})
        except Exception as e:
            self.send_json({'ok': False, 'error': str(e)}, 500)

    def send_json(self, obj, code=200):
        data = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):  # keep the console quiet
        pass


if __name__ == '__main__':
    start = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    port = pick_port(start)
    url = 'http://127.0.0.1:%d/index.html' % port
    print('')
    print('Your portfolio is live at:  %s' % url)
    print('Open admin.html from that same address to edit, then hit "Save locally" —')
    print('it writes content.js and picked images straight into the folder. No downloads.')
    print('The site tab refreshes itself automatically when you save — just switch to it.')
    print('Press Ctrl+C to stop.')
    print('')
    try:
        webbrowser.open(url)
    except Exception:
        pass
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
