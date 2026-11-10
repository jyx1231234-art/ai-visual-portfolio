'use client';

import gsap from 'gsap';
import { useEffect, useRef, type ReactNode } from 'react';

/** Reuse GSAP; animate only while this control is hovered. */
export function Magnetic({ children, amount = 5 }: { children: ReactNode; amount?: number }) {
  const root = useRef<HTMLSpanElement>(null);
  const content = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!root.current || !content.current) return;
    const target = root.current;
    const inner = content.current;
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const x = gsap.quickTo(inner, 'x', { duration: .35, ease: 'power3.out' });
      const y = gsap.quickTo(inner, 'y', { duration: .35, ease: 'power3.out' });
      let rect: DOMRect | null = null;
      function reset() {
        if (!rect) return;
        rect = null;
        x(0); y(0);
        window.removeEventListener('scroll', reset);
      }
      function enter() {
        rect = target.getBoundingClientRect();
        window.addEventListener('scroll', reset, { passive: true, once: true });
      }
      function move(event: PointerEvent) {
        if (event.pointerType !== 'mouse') return;
        if (!rect) enter();
        if (!rect) return;
        x(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * amount);
        y(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * amount);
      }
      target.addEventListener('pointerenter', enter);
      target.addEventListener('pointermove', move, { passive: true });
      target.addEventListener('pointerleave', reset);
      target.addEventListener('pointercancel', reset);
      window.addEventListener('blur', reset);
      window.addEventListener('resize', reset, { passive: true });
      window.addEventListener('keydown', reset);
      return () => {
        window.removeEventListener('scroll', reset);
        window.removeEventListener('blur', reset);
        window.removeEventListener('resize', reset);
        window.removeEventListener('keydown', reset);
        target.removeEventListener('pointerenter', enter);
        target.removeEventListener('pointermove', move);
        target.removeEventListener('pointerleave', reset);
        target.removeEventListener('pointercancel', reset);
        x.tween.kill(); y.tween.kill();
      };
    });
    return () => media.revert();
  }, [amount]);
  return <span ref={root} className="magnetic-target"><span ref={content} className="magnetic-content">{children}</span></span>;
}
