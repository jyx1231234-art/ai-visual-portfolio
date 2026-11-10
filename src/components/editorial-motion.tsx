'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function TitleLine({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`motion-title-mask ${className}`}>
      <span data-motion-line>{children}</span>
    </span>
  );
}

/** SSR stays readable. matchMedia reverts all inline states when motion is disabled. */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const own = (selector: string) =>
          Array.from(element.querySelectorAll<HTMLElement>(selector)).filter(
            (node) => node.closest('[data-reveal-root]') === element,
          );
        const lines = own('[data-motion-line]');
        const items = own('[data-motion-item]');
        const veils = own('.image-reveal-veil');
        const images = own('.project-media');
        let trigger: ScrollTrigger | undefined;
        let cleanupFrame = 0;
        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          paused: true,
          delay,
          onComplete: () => {
            // Do not remove triggers while ScrollTrigger is iterating its refresh list.
            // `once: true` can do so during recursive first-refresh on route changes.
            cleanupFrame = requestAnimationFrame(() => trigger?.kill(false, true));
          },
        });
        animation.current = timeline;
        if (lines.length) {
          timeline.fromTo(
            lines,
            { yPercent: 115, rotation: 3, scaleY: 1.18, transformOrigin: '0% 100%' },
            {
              yPercent: 0,
              rotation: 0,
              scaleY: 1,
              duration: 1.45,
              stagger: 0.14,
              clearProps: 'transform',
            },
            0,
          );
          const kickers = own('.section-kicker');
          if (kickers.length)
            timeline.from(
              kickers,
              { x: -24, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' },
              0.05,
            );
        } else {
          timeline.from(
            element,
            { y: 72, scale: 0.97, opacity: 0, duration: 1.25, clearProps: 'transform,opacity' },
            0,
          );
        }
        if (items.length)
          timeline.from(
            items,
            {
              y: 48,
              opacity: 0,
              duration: 1.05,
              stagger: 0.1,
              clearProps: 'transform,opacity',
            },
            lines.length ? 0.48 : 0.16,
          );
        if (veils.length)
          timeline.fromTo(
            veils,
            { scaleY: 1 },
            {
              scaleY: 0,
              duration: 1.35,
              stagger: 0.1,
              ease: 'power4.inOut',
              clearProps: 'transform',
            },
            lines.length ? 0.5 : 0.08,
          );
        if (images.length)
          timeline.from(
            images,
            {
              scale: 1.09,
              yPercent: 3,
              duration: 1.65,
              clearProps: 'transform',
            },
            0.05,
          );
        // Populate the entire timeline BEFORE attaching / measuring its trigger.
        // A timeline-attached trigger otherwise defers refresh by a tick, leaving
        // subsequent triggers to recursively initialize it during scroll restoration.
        const rect = element.getBoundingClientRect();
        if (rect.bottom <= 0) {
          timeline.progress(1);
        } else {
          trigger = ScrollTrigger.create({
            trigger: element,
            animation: timeline,
            start: 'top 88%',
            toggleActions: 'play none none none',
            onLeave: () => timeline.progress(1),
            onRefresh: (self) => {
              // A restored scroll position must not leave readable content hidden.
              if (self.progress > 0 && timeline.progress() === 0) timeline.play();
            },
          });
          trigger.refresh();
          if (rect.top < window.innerHeight * .88) timeline.play();
        }
        return () => cancelAnimationFrame(cleanupFrame);
      });
      return () => {
        media.revert();
        animation.current = null;
      };
    },
    { scope: root, dependencies: [delay], revertOnUpdate: true },
  );
  return (
    <div
      ref={root}
      className={className}
      data-reveal-root
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) animation.current?.progress(1);
      }}
    >
      {children}
    </div>
  );
}

export function Opening({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const select = gsap.utils.selector(root);
        const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
        animation.current = timeline;
        timeline
          .fromTo(
            select('[data-opening-title]'),
            {
              yPercent: 115,
              scaleX: 0.86,
              scaleY: 0.62,
              rotation: 4,
              transformOrigin: '50% 100%',
            },
            {
              yPercent: 0,
              scaleX: 1,
              scaleY: 1,
              rotation: 0,
              duration: 1.8,
              clearProps: 'transform',
            },
            0.08,
          )
          .from(
            select('.hero-overline'),
            { x: -28, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' },
            0.2,
          )
          .from(
            select('.title-asterisk'),
            { rotation: -135, scale: 0, duration: 1.6, clearProps: 'transform' },
            0.55,
          )
          .from(
            select('.folder-opening'),
            {
              y: 220,
              scale: 0.82,
              rotation: (index) => (index - 1.5) * 9,
              duration: 1.5,
              stagger: 0.09,
              clearProps: 'transform',
            },
            0.62,
          )
          .from(
            select('.hero-subtitle,.hero-disciplines'),
            {
              y: 36,
              opacity: 0,
              duration: 1.1,
              stagger: 0.12,
              clearProps: 'transform,opacity',
            },
            0.95,
          );
        if (window.scrollY > (root.current?.offsetHeight ?? 800) * 0.5) timeline.progress(1);
        const finish = () => timeline.progress(1);
        // Scrolling is never locked behind an intro sequence.
        window.addEventListener('wheel', finish, { once: true, passive: true });
        window.addEventListener('touchstart', finish, { once: true, passive: true });
        return () => {
          window.removeEventListener('wheel', finish);
          window.removeEventListener('touchstart', finish);
        };
      });
      return () => {
        media.revert();
        animation.current = null;
      };
    },
    { scope: root },
  );
  return (
    <section
      ref={root}
      className="hero"
      aria-labelledby="hero-title"
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) animation.current?.progress(1);
      }}
    >
      {children}
    </section>
  );
}
