"""Generate web covers while retaining the original JPGs for future exports."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
for name in ('dragon-boat-main', 'ai-icon-skill-main'):
    source = root / 'public/images/projects' / f'{name}.jpg'
    target = source.with_suffix('.webp')
    with Image.open(source) as image:
        image = image.convert('RGB')
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=90, method=6)
    print(f'{name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes')
