import Link from 'next/link';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { WorkGrid } from '@/components/works';
import { Arrow, Reveal, TitleLine } from '@/components/ui';
import { expertise, projects } from '@/data/projects';
import { Magnetic } from '@/components/magnetic';

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <section id="selected" className="selected section-shell">
        <Reveal>
          <div className="section-kicker">
            <span>02 / SELECTED WORKS</span>
            <span>2024—2026 · 精选项目</span>
          </div>
          <div className="section-title-row">
            <h2>
              <TitleLine>Selected</TitleLine>
              <TitleLine className="indented">
                Works<sup>({String(projects.length).padStart(2, '0')})</sup>
              </TitleLine>
            </h2>
            <div className="section-aside" data-motion-item>
              <p>
                从品牌表达，到数字体验。
                <br />
                让每一个想法，成为看得见的设计。
              </p>
              <Link href="/works" className="text-link">
                Explore all works{' '}
                <Magnetic>
                  <Arrow diagonal />
                </Magnetic>
              </Link>
            </div>
          </div>
        </Reveal>
        <WorkGrid />
        <Link href="/works" className="all-works-link">
          View all works <span>查看全部作品</span>
          <Magnetic>
            <Arrow diagonal />
          </Magnetic>
        </Link>
      </section>
      <section id="expertise" className="expertise section-shell">
        <Reveal>
          <div className="section-kicker">
            <span>03 / WHAT I BRING</span>
            <span>从概念到落地。</span>
          </div>
          <div className="section-title-row">
            <h2>
              <TitleLine>
                Expertise
                <span className="small-asterisk" aria-hidden="true">
                  ✳
                </span>
              </TitleLine>
            </h2>
            <p className="section-aside" data-motion-item>
              清晰的思考，准确的表达。
              <br />
              让创意与执行相互成就。
            </p>
          </div>
          <div className="expertise-grid">
            {expertise.map((item, i) => (
              <Reveal className="expertise-item" key={item.name} delay={i * 0.12}>
                <span className="expertise-number">0{i + 1}</span>
                <h3>{item.name}</h3>
                <span className="expertise-cn">{item.cn}</span>
                <p>{item.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="tools-line">
            <span>MY EVERYDAY TOOLKIT</span>
            <p>Photoshop / Illustrator / Figma / Blender / InDesign / AIGC</p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
