import Link from 'next/link';
import Image from 'next/image';
import { Arrow } from './ui';
import { Opening } from './editorial-motion';

const folders = [
  {
    name: 'Campaign',
    index: '02',
    className: 'folder-campaign',
    label: 'Ideas that connect.',
    photo: '/images/projects/dragon-boat-main.webp',
  },
  {
    name: 'Branding',
    index: '01',
    className: 'folder-branding',
    label: 'Make a lasting impression.',
    photo: '/images/projects/cover-33.webp',
  },
  {
    name: 'AIGC',
    index: '04',
    className: 'folder-aigc',
    label: 'Imagine what’s next.',
    photo: '/images/projects/ai-icon-skill-main.webp',
  },
  {
    name: 'UI/UX',
    index: '03',
    className: 'folder-uiux',
    label: 'Designed for people.',
    photo: '/images/projects/cover-56.webp',
  },
];
export function Hero() {
  return (
    <Opening>
      <div className="hero-type">
        <div>
          <div className="hero-overline">
            <span className="status-dot" /> INDEPENDENT MIND. MULTIDISCIPLINARY DESIGN.
          </div>
          <h1 id="hero-title">
            <span className="hero-title-mask">
              <span data-opening-title>Portfolio</span>
            </span>
            <span className="title-asterisk" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p className="hero-subtitle">2024—2026 Selected Works</p>
          <p className="hero-disciplines">
            AI Visual Designer <span>/</span> Brand Visual <span>/</span> UIUX <span>/</span> AIGC
          </p>
        </div>
      </div>
      <div className="folder-scene">
        <div className="scene-inner">
          {folders.map((f) => (
            <Link
              href={`/works?category=${encodeURIComponent(f.name)}`}
              prefetch={false}
              className={`folder ${f.className}`}
              key={f.name}
              aria-label={`查看 ${f.name} 类作品`}
            >
              <div className="folder-opening">
                <div className="folder-visual">
                  <div className="folder-back" />
                  <div className="folder-sheet" aria-hidden="true" />
                  <div className="folder-paper">
                    <div className="paper-top">
                      SELECTED WORKS <span>↗</span>
                    </div>
                    <Image
                      src={f.photo}
                      width={320}
                      height={180}
                      sizes="320px"
                      loading="eager"
                      fetchPriority={f.name === 'AIGC' ? 'high' : 'auto'}
                      alt=""
                      draggable={false}
                    />
                    <div className="paper-caption">{f.label}</div>
                  </div>
                  <div className="folder-front">
                    <span className="folder-count">{f.index} / COLLECTION</span>
                    <span className="folder-name">{f.name}</span>
                    <span className="folder-bottom">
                      JING YIXIANG <Arrow diagonal />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Opening>
  );
}
