import http.server, socketserver, pathlib, urllib.parse

PORT = 8080
BASE = pathlib.Path(r"C:\Users\PC\claude-workspace")

class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        txt = (BASE / "weather.txt").read_text("utf-8")
        body = f"""<!DOCTYPE html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>마포구 날씨</title>
<style>body{{background:#0f1117;color:#e8eaf6;font-family:monospace;padding:2rem}}
pre{{white-space:pre-wrap;line-height:1.7;font-size:.95rem}}</style></head>
<body><pre>{txt}</pre></body></html>""".encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type","text/html; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)
    def log_message(self, *a): pass

print(f"http://localhost:{PORT} 접속하세요  (종료: Ctrl+C)")
with socketserver.TCPServer(("", PORT), H) as s:
    s.serve_forever()
