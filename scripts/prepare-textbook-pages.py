"""Prepare offline pages from the user's textbook; never fetch a different edition."""
import argparse
import hashlib
import json
from pathlib import Path
import pypdfium2 as pdfium

parser = argparse.ArgumentParser()
parser.add_argument('pdf', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'app' / 'textbook-pages'
out.mkdir(exist_ok=True)
book = pdfium.PdfDocument(args.pdf)
pages = []
for i in range(len(book)):
    page = book[i]
    bitmap = page.render(scale=1600 / page.get_width())
    picture = bitmap.to_pil()
    name = f'{i + 1:03}.webp'
    picture.save(out / name, 'WEBP', quality=85, method=4)
    pages.append({'pdfPage': i + 1, 'file': f'textbook-pages/{name}',
                  'width': picture.width, 'height': picture.height})
    bitmap.close()
    page.close()
manifest = {'edition': 'Enjoy English 6, Дрофа, 2019, 3-е исправленное издание',
            'sha256': hashlib.sha256(args.pdf.read_bytes()).hexdigest(),
            'pageCount': len(book), 'pages': pages}
(root / 'app' / 'textbook-pages.js').write_text(
    '/* User-provided edition. Page numbers are physical PDF positions. */\n'
    'window.TextbookPages = ' + json.dumps(manifest, ensure_ascii=False) + ';\n', encoding='utf-8')
print(f'Prepared {len(pages)} pages, {sum(p.stat().st_size for p in out.glob("*.webp")):,} bytes')
