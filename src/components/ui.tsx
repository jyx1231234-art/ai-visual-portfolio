'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/data/projects';
import { Magnetic } from './magnetic';
import { Reveal, TitleLine } from './editorial-motion';
import { requestScrollRefresh } from './refresh-scroll';
export { Reveal, TitleLine } from './editorial-motion';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      className="arrow-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    return requestScrollRefresh();
  }, [pathname]);
  return <>{children}</>;
}
export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    dialog.current?.close();
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  function close() {
    dialog.current?.close();
    setOpen(false);
  }
  return (
    <>
      <header className="site-header">
        <Link href="/" aria-label="景义翔，返回首页" className="wordmark">
          Designer <span>/ AI Visual Designer</span>
        </Link>
        <span className="collection-label">2026 — 2027 WORK COLLECTION</span>
        <button
          className="menu-trigger"
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
          aria-label="打开导航菜单"
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <Magnetic>
            <span className="menu-label">Menu</span>
            <span className="plus">+</span>
          </Magnetic>
        </button>
      </header>
      <dialog
        aria-label="网站导航"
        id="site-menu"
        className="menu-dialog"
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="menu-panel">
          <div className="menu-top">
            <span className="eyebrow">EXPLORE / 导航</span>
            <button onClick={close} className="round-button" aria-label="关闭菜单">
              ×
            </button>
          </div>
          <nav aria-label="主导航">
            {[
              ['/', 'Home', '首页'],
              ['/#about', 'About', '关于'],
              ['/works', 'Works', '作品'],
              ['/#expertise', 'Expertise', '能力'],
              ['/#contact', 'Contact', '联系'],
            ].map(([url, title, cn], i) => (
              <Link
                onClick={(event) => {
                  close();
                  if (pathname === '/' && url.startsWith('/#')) {
                    event.preventDefault();
                    // Wait for the dialog's scroll lock to be released, including repeated anchors.
                    requestAnimationFrame(() => {
                      document.getElementById(url.slice(2))?.scrollIntoView({
                        block: 'start',
                        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                          ? 'instant'
                          : 'smooth',
                      });
                      window.history.replaceState(window.history.state, '', url);
                    });
                  }
                }}
                href={url}
                key={title}
              >
                <small>0{i + 1}</small>
                <span>{title}</span>
                <em>{cn}</em>
                <Arrow diagonal />
              </Link>
            ))}
          </nav>
          <a className="menu-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <Arrow diagonal />
          </a>
        </div>
      </dialog>
    </>
  );
}
export function Footer() {
  return (
    <footer className="contact section-shell" id="contact">
      <Reveal>
        <div className="section-kicker">
          <span>04 / GET IN TOUCH</span>
          <span>保持联系，让想法发生。</span>
        </div>
        <h2>
          <TitleLine>Let’s Create</TitleLine>
          <TitleLine className="contact-muted">Something.</TitleLine>
          <a
            className="contact-arrow"
            aria-label="发送邮件给景义翔"
            href={`mailto:${profile.email}`}
          >
            <Magnetic amount={7}>
              <Arrow diagonal />
            </Magnetic>
          </a>
        </h2>
        <div className="contact-links" data-motion-item>
          <a href={`mailto:${profile.email}`}>
            {profile.email}
            <Arrow diagonal />
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            个人简历 <span>PDF</span>
            <Arrow diagonal />
          </a>
          <span className="social-placeholder">社交主页 · 待补充</span>
        </div>
      </Reveal>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} 景义翔 · JING YIXIANG</span>
        <span>DESIGNED WITH INTENTION.</span>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
          }
        >
          <Magnetic>
            Back to top <span aria-hidden="true">↑</span>
          </Magnetic>
        </button>
      </div>
    </footer>
  );
}
