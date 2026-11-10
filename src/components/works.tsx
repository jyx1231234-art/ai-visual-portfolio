'use client';
import { useEffect, useState } from 'react';
import { requestScrollRefresh } from './refresh-scroll';
import Image from 'next/image';
import Link from 'next/link';
import { projects, categories, type Category, type Project } from '@/data/projects';
import { Arrow, Reveal } from './ui';

export function ProjectCard({
  project,
  index,
  featured = false,
  order = 0,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  order?: number;
}) {
  return (
    <Reveal
      className={`project-card ${featured ? 'project-featured' : ''}`}
      delay={(order % 2) * 0.18}
    >
      <Link href={`/works/${project.slug}`} prefetch={false} className="project-link">
        <div className="project-image" style={{ background: project.color }}>
          <div className="project-media">
            <Image
              src={project.cover}
              alt={`${project.name}项目主视觉`}
              width={1600}
              height={900}
              sizes={featured ? '(max-width: 700px) 100vw, 90vw' : '(max-width: 700px) 100vw, 46vw'}
              quality={85}
            />
          </div>
          <span className="image-reveal-veil" aria-hidden="true" />
          <span className="view-project">
            View project <Arrow diagonal />
          </span>
          <span className="image-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="project-meta">
          <div>
            <div className="project-category">
              {project.category}
              <span> / </span>
              {project.tags[0]}
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-side">
            <span>{project.year}</span>
            <Arrow diagonal />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
export function WorkGrid({
  filter = false,
  initialCategory = 'All',
}: {
  filter?: boolean;
  initialCategory?: Category;
}) {
  const [active, setActive] = useState<Category>(initialCategory);
  useEffect(() => {
    return requestScrollRefresh();
  }, [active]);
  const shown =
    active === 'All'
      ? projects
      : projects.filter((p) => p.category === active);
  return (
    <>
      {filter && (
        <div className="filter-row" aria-label="筛选项目">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={active === category ? 'active' : ''}
            >
              {category === 'All' ? 'All Works' : category}
              <sup>
                {category === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === category).length}
              </sup>
            </button>
          ))}
        </div>
      )}
      <div className={`works-grid ${filter ? 'filtered-grid' : ''}`} aria-live="polite">
        {shown.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
            featured={!filter && index === 0}
            order={filter ? index : Math.max(0, index - 1)}
          />
        ))}
      </div>
    </>
  );
}
