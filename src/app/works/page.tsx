import { categories, projects, type Category } from '@/data/projects';
import { WorkGrid } from '@/components/works';
import { Reveal, TitleLine } from '@/components/ui';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Works · 全部作品' };
export default async function Works({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initial = categories.includes(category as Category) ? (category as Category) : 'All';
  return (
    <main id="main" className="works-page section-shell">
      <Reveal>
        <div className="section-kicker">
          <span>THE SELECTED COLLECTION</span>
          <span>2024—2026</span>
        </div>
        <h1>
          <TitleLine>
            Works<sup>({String(projects.length).padStart(2, '0')})</sup>
          </TitleLine>
        </h1>
        <p className="works-intro" data-motion-item>
          品牌、体验与 AI 创意。
          <br />
          每一个项目，都是一次新的探索。
        </p>
      </Reveal>
      <WorkGrid key={initial} filter initialCategory={initial} />
    </main>
  );
}
