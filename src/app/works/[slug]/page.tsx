import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import { Gallery, type GallerySheet } from '@/components/gallery';
import assets from '@/data/assets.json';
import { Arrow, Reveal, TitleLine } from '@/components/ui';
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.name ?? '未找到项目', description: project?.description };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  // Validate at build time and send only this project's pages to the client.
  const sheets: GallerySheet[] = project.pages.map(page => {
    const images = (assets as Record<string, GallerySheet['images']>)[String(page)];
    if (!images?.length) throw new Error(`Missing portfolio assets for PDF page ${page}`);
    return { page, images };
  });
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main id="main" className="project-page">
      <section className="project-heading section-shell">
        <Link href="/works" className="back-link">
          ← All works / 全部作品
        </Link>
        <Reveal>
          <div className="project-heading-meta">
            <span>
              {project.category} / {project.tags.join(' · ')}
            </span>
            <span>{project.year}</span>
          </div>
          <h1>
            <TitleLine>{project.name}</TitleLine>
          </h1>
          <p className="project-english" data-motion-item>
            {project.english}
          </p>
          <div className="project-summary" data-motion-item>
            <p>{project.description}</p>
            <div>
              <span>MY ROLE / 参与职责</span>
              <p>{project.role}</p>
            </div>
          </div>
        </Reveal>
      </section>
      <div className="detail-cover">
        <Image
          src={project.cover}
          width={1600}
          height={900}
          alt={`${project.name}主视觉`}
          sizes="100vw"
          preload
          quality={85}
        />
      </div>
      <section className="project-story section-shell">
        <div className="story-label">
          THE THINKING
          <br />
          <span>设计思考</span>
        </div>
        <div className="story-grid">
          {[
            ['01 / Background', '项目背景', project.background],
            ['02 / Objective', '设计目标', project.goal],
            ['03 / Process', '设计过程', project.process],
            ['04 / Outcome', '最终成果', project.outcome],
          ].map(([en, cn, text]) => (
            <Reveal key={en}>
              <span className="eyebrow">{en}</span>
              <h2>{cn}</h2>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section-shell detail-gallery-section">
        <div className="section-kicker">
          <span>THE VISUAL STORY / 项目展示</span>
          <span>点击图片，浏览细节 ↗</span>
        </div>
        <Gallery sheets={sheets} title={project.name} />
      </section>
      <section className="next-project section-shell">
        <span className="eyebrow">KEEP EXPLORING / 下一个项目</span>
        <Link href={`/works/${next.slug}`} prefetch={false}>
          <h2>{next.name}</h2>
          <Arrow diagonal />
        </Link>
        <Link className="text-link" href="/works">
          返回全部作品 <Arrow />
        </Link>
      </section>
    </main>
  );
}
