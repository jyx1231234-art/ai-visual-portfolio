from pathlib import Path
from PIL import Image
from pypdf import PdfReader
from concurrent.futures import ThreadPoolExecutor
import subprocess, json, re, math

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path('F:/作品集待整合页/过去版本/景义翔-合工大-品牌视觉-2027校招讲.pdf')
# Boundaries visually checked against the original PDF; other projects and chapter dividers are excluded.
RANGES = {
 'trip-geek-festival': (5,6),
 'trip-dragon-boat': (7,15),
 'trip-travel-footprint': (56,69),
 'iflytek-bobo': (20,31),
 'ai-icon-skill': (71,81),
 'greenpower-packaging': (33,44),
}

def main():
 manifest_path=ROOT/'src/data/assets.json'
 manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
 selected=sorted({p for a,b in RANGES.values() for p in range(a,b+1)})
 missing=[p for p in selected if str(p) not in manifest]
 temp=ROOT/'tmp/page-audit/full'; temp.mkdir(parents=True,exist_ok=True)
 def render(page):
  stem=temp/f'p{page:02}'
  subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-scale-to-x','1600','-scale-to-y','-1','-singlefile','-png',str(SOURCE),str(stem)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
  with Image.open(str(stem)+'.png') as raw:
   im=raw.convert('RGB')
  count=max(1,math.ceil(im.height/1800)) if im.height>2400 else 1
  height=math.ceil(im.height/count); parts=[]
  for k in range(count):
   tile=im.crop((0,k*height,im.width,min((k+1)*height,im.height)))
   name=f'p{page:02}-{k+1}.webp'
   tile.save(ROOT/'public/images/projects'/name,'WEBP',quality=87,method=6)
   parts.append({'src':'/images/projects/'+name,'width':tile.width,'height':tile.height})
  print(f'Imported PDF {page}: {im.width} x {im.height}',flush=True)
  return str(page),parts
 with ThreadPoolExecutor(max_workers=4) as pool:
  manifest.update(dict(pool.map(render,missing)))
 reader=PdfReader(SOURCE)
 for page in selected:
  tiles=manifest[str(page)]
  expected=math.ceil(float(reader.pages[page-1].mediabox.height)*1600/float(reader.pages[page-1].mediabox.width))
  assert abs(sum(t['height'] for t in tiles)-expected)<=1, f'Incomplete height: PDF {page}'
  for t in tiles:
   with Image.open(ROOT/'public'/t['src'].lstrip('/')) as image:
    assert image.size==(t['width'],t['height']),t['src']
 manifest_path.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
 project_path=ROOT/'src/data/projects.ts'; code=project_path.read_text(encoding='utf-8')
 for slug,(a,b) in RANGES.items():
  pattern=r"(slug: '"+re.escape(slug)+r"'[\s\S]*?pages: )\[[^\]]*\]"
  code,n=re.subn(pattern,lambda m:m[1]+str(list(range(a,b+1))),code,count=1)
  assert n==1,slug
 project_path.write_text(code,encoding='utf-8')
 print(f'Validated {len(selected)} PDF pages across {len(RANGES)} projects; imported {len(missing)} missing pages.')

if __name__=='__main__': main()
