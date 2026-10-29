"""Create bounded display thumbnails without touching archived originals.
Run after importing or adding media: python3 scripts/prepare-thumbnails.py
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
archive = json.loads((root / 'src/data/archive.json').read_text())
target = root / 'public/media/thumbs'
target.mkdir(parents=True, exist_ok=True)
sources = {item['src'] for dog in archive['dogs'] for item in dog['photos'] + dog.get('concepts', [])}
manifest = {}
for src in sorted(sources):
    source = root / 'public' / src.lstrip('/')
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:16]
    name = digest + '-384.webp'
    with Image.open(source) as image:
        thumb = ImageOps.exif_transpose(image).convert('RGB')
        thumb.thumbnail((384, 384), Image.Resampling.LANCZOS)
        thumb.save(target / name, 'WEBP', quality=82)
        manifest[src] = {'src': '/media/thumbs/' + name, 'width': thumb.width, 'height': thumb.height}
(root / 'src/data/thumbnails.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Prepared {len(manifest)} bounded thumbnails; originals unchanged.')
