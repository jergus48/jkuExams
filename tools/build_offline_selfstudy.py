"""Build the standalone offline AI Self-Study page with Pyodide embedded (Run blocks work without internet).

Usage: python tools/build_offline_selfstudy.py
Needs the Pyodide 0.26.4 core files in PYO (download them once from
https://cdn.jsdelivr.net/pyodide/v0.26.4/full/ : pyodide.js, pyodide.asm.js, pyodide.asm.wasm,
python_stdlib.zip, pyodide-lock.json).
"""
import base64, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public/self-study/index.html"
OUT = pathlib.Path(r"C:\Users\Jergus\Documents\AIselfStudying\offline\self-study-offline.html")
PYO = pathlib.Path(r"C:\Users\Jergus\Documents\AIselfStudying\pyodide-0.26.4")

NEW_LOADPY = r'''const loadPy = () => pyP || (pyP = (async () => {
  const base = "https://pyodide.offline.invalid/";
  const txt = id => document.getElementById(id).textContent;
  const toBin = s => { s = atob(s.trim()); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
  const files = { "pyodide.asm.wasm": ["pyo-wasm", "application/wasm"], "python_stdlib.zip": ["pyo-zip", "application/zip"], "pyodide-lock.json": ["pyo-lock", "application/json"] };
  const pkgScript = n => new Promise((res, rej) => { const s = document.createElement("script"); s.src = "pyodide-pkgs/" + n + ".js"; s.onload = res; s.onerror = () => rej(new Error("Missing offline package file pyodide-pkgs/" + n + ".js (keep the folder next to this HTML file)")); document.head.appendChild(s); });
  const of = window.fetch;
  window.fetch = function (u) {
    const k = String((u && u.url) || u);
    if (!k.startsWith(base)) return of.apply(this, arguments);
    const n = k.slice(base.length).split("?")[0], f = files[n];
    if (f) return Promise.resolve(new Response(f[0] === "pyo-lock" ? txt(f[0]) : toBin(txt(f[0])), { headers: { "Content-Type": f[1] } }));
    return pkgScript(n).then(() => { const b = toBin(window.__PYO_PKG[n]); delete window.__PYO_PKG[n]; return new Response(b, { headers: { "Content-Type": "application/octet-stream" } }); });
  };
  for (const id of ["pyo-js", "pyo-asm"]) { const s = document.createElement("script"); s.textContent = txt(id); document.head.appendChild(s); }
  return loadPyodide({ indexURL: base });
})().catch(e => { pyP = null; throw e; }));'''

def esc(t): return t.replace("</script", "<\/script")
def b64(n): return base64.b64encode((PYO / n).read_bytes()).decode()

html = SRC.read_text(encoding="utf-8").replace("\r\n", "\n")
html, n = re.subn(r"const loadPy = \(\) => pyP \|\| \(pyP = new Promise\(.*?\n\}\)\);", lambda m: NEW_LOADPY, html, count=1, flags=re.S)
assert n == 1, "loadPy block not found"
blocks = [
    ("pyo-js", esc((PYO / "pyodide.js").read_text(encoding="utf-8"))),
    ("pyo-asm", esc((PYO / "pyodide.asm.js").read_text(encoding="utf-8"))),
    ("pyo-wasm", b64("pyodide.asm.wasm")),
    ("pyo-zip", b64("python_stdlib.zip")),
    ("pyo-lock", esc((PYO / "pyodide-lock.json").read_text(encoding="utf-8"))),
]
emb = "".join(f'<script type="text/plain" id="{i}">{c}</script>\n' for i, c in blocks)
assert "</body>" in html
html = html.replace("</body>", emb + "</body>", 1)
OUT.write_bytes(html.replace("\n", "\r\n").encode("utf-8"))
PK = OUT.parent / "pyodide-pkgs"; PK.mkdir(exist_ok=True)
for w in sorted((PYO / "packages").iterdir()):
    (PK / (w.name + ".js")).write_text('(window.__PYO_PKG=window.__PYO_PKG||{})["%s"]="%s";' % (w.name, base64.b64encode(w.read_bytes()).decode()), encoding="ascii")
print("wrote", OUT, OUT.stat().st_size, "and", len(list(PK.iterdir())), "package files")
