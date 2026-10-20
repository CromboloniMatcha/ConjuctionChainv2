"""Inline css/ and js/ into one self-contained file: dist/conjunction-chain.html
(useful for hosts that only accept a single HTML file)."""
import re
from pathlib import Path

root = Path(__file__).parent
read = lambda p: (root / p).read_text(encoding="utf-8")

html = read("index.html")
html = html.replace('<link rel="stylesheet" href="css/styles.css">', f"<style>\n{read('css/styles.css')}\n</style>")

names = re.findall(r'<script src="js/([^"]+)"></script>', html)   # keeps the order from index.html
js = "\n".join(read(f"js/{n}") for n in names)
html = re.sub(r'\s*<script src="js/[^"]+"></script>', "", html)
html = html.replace("</body>", f"  <script>\n{js}\n</script>\n</body>")
assert 'href="css/' not in html and 'src="js/' not in html

(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "conjunction-chain.html").write_text(html, encoding="utf-8")
print("Built dist/conjunction-chain.html")
