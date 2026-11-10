import Image from 'next/image';
import { profile, projects } from '@/data/projects';
import { Arrow, Reveal, TitleLine } from './ui';

export function About() {
  return (
    <section id="about" className="about section-shell" aria-labelledby="about-title">
      <Reveal>
        <div className="section-kicker">
          <span>01 / ABOUT & EXPERIENCE</span>
          <span>用设计连接想法与真实世界。</span>
        </div>
        <div className="about-heading">
          <h2 id="about-title">
            <TitleLine>
              About me<span className="title-dot">.</span>
            </TitleLine>
          </h2>
          <p className="about-intro" data-motion-item>
            {profile.intro}
          </p>
        </div>
        <div className="about-grid">
          <div className="about-profile">
            <div className="about-identity" data-motion-item>
              <div className="about-portrait">
                <Image
                  src="/images/portrait.webp"
                  width={606}
                  height={624}
                  alt="景义翔在湖边的个人照片"
                  sizes="(max-width:700px) 112px, 148px"
                />
                <span className="image-reveal-veil" aria-hidden="true" />
              </div>
              <div className="about-name">
                <span className="eyebrow">HELLO, I’M</span>
                <h3>{profile.name}</h3>
                <p>{profile.english}</p>
                <span className="about-role">
                  AI Visual Designer
                  <br />
                  2027 届 · 视觉传达
                </span>
              </div>
            </div>
            <dl className="about-facts" data-motion-item>
              <div>
                <dt>设计实习经历</dt>
                <dd>
                  {String(profile.experience.length).padStart(2, '0')}
                  <span>段</span>
                </dd>
              </div>
              <div>
                <dt>精选设计项目</dt>
                <dd>
                  {String(projects.length).padStart(2, '0')}
                  <span>组</span>
                </dd>
              </div>
            </dl>
            <a
              className="text-link"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-motion-item
            >
              View résumé / 查看简历 <Arrow diagonal />
            </a>
          </div>
          <div className="about-history">
            <div className="experience-block">
              <h3>
                Experience <span>/ 实习经历</span>
              </h3>
              <ol className="experience-list">
                {profile.experience.map((item) => (
                  <li className="experience-row" key={item.company} data-motion-item>
                    <span className="experience-period">{item.period}</span>
                    <h4>{item.company}</h4>
                    <p>{item.role}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="education-block" data-motion-item>
              <h3>
                Education <span>/ 教育经历</span>
              </h3>
              <div className="education-list">
                {profile.education.map((item) => (
                  <div className="education-row" key={item.school}>
                    <h4>{item.school}</h4>
                    <p>{item.degree}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
