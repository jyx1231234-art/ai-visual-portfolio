'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Pulse = { x: number; y: number; born: number };

/** An independent decorative layer; never changes the cursor or content transforms. */
export function DotRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const layer = canvas;
    const ctx = context;
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const size = 360;
    const step = 14;
    const life = 1800;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    layer.width = layer.height = size * ratio;
    ctx.scale(ratio, ratio);
    let frame = 0;
    let inputFrame = 0;
    let pendingPointer: PointerEvent | null = null;
    let pulses: Pulse[] = [];
    let pointerX = 0, pointerY = 0;
    let source: Element | null = null;
    let bounds: DOMRect | null = null;
    let protectedRects: DOMRect[] = [];
    let measuredAt = -Infinity;
    let lastPulse: Pulse | null = null;

    function clear() {
      cancelAnimationFrame(inputFrame);
      inputFrame = 0;
      pendingPointer = null;
      if (!frame && !pulses.length && !source) return;
      cancelAnimationFrame(frame);
      frame = 0;
      pulses = [];
      lastPulse = null;
      source = null;
      bounds = null;
      measuredAt = -Infinity;
      ctx.clearRect(0, 0, size, size);
      layer.removeAttribute('data-active');
    }
    function paint(now: number) {
      frame = 0;
      pulses = pulses.filter((pulse) => now - pulse.born < life);
      ctx.clearRect(0, 0, size, size);
      if (!pulses.length || !bounds) {
        layer.removeAttribute('data-active');
        return;
      }
      const left = pointerX - size / 2;
      const top = pointerY - size / 2;
      layer.style.transform = `translate3d(${left}px,${top}px,0)`;
      if (!layer.hasAttribute('data-active')) layer.setAttribute('data-active', 'true');
      // Anchor the grid to page coordinates so dots do not swim with the pointer.
      const offsetX = ((-left % step) + step) % step;
      const offsetY = ((-(top + window.scrollY) % step) + step) % step;
      ctx.save();
      ctx.beginPath();
      ctx.rect(bounds.left - left, bounds.top - top, bounds.width, bounds.height);
      ctx.clip();
      for (let x = offsetX; x < size; x += step) {
        for (let y = offsetY; y < size; y += step) {
          const localDistance = Math.hypot(x - size / 2, y - size / 2);
          if (localDistance > 170) continue;
          const edge = Math.pow(1 - localDistance / 170, .7);
          let energy = 0;
          for (const pulse of pulses) {
            const age = (now - pulse.born) / life;
            const distance = Math.hypot(left + x - pulse.x, top + y - pulse.y);
            const radius = 14 + age * 185;
            const ring = Math.exp(-Math.pow((distance - radius) / 24, 2));
            const center = Math.exp(-distance / 65) * .25;
            energy += (ring + center) * Math.pow(1 - age, 1.4);
          }
          energy = Math.min(energy, 1) * edge;
          if (energy < .015) continue;
          ctx.fillStyle = `rgba(112,100,185,${energy * .5})`;
          ctx.beginPath();
          ctx.arc(x, y, .6 + energy * 1.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      // Keep imagery, typography and navigation clean, including near their edges.
      for (const rect of protectedRects) {
        ctx.clearRect(rect.left - left - 6, rect.top - top - 6, rect.width + 12, rect.height + 12);
      }
      frame = requestAnimationFrame(paint);
    }
    function update(event: PointerEvent) {
      if (!media.matches || event.pointerType !== 'mouse' || document.hidden || document.querySelector('dialog[open]')) {
        clear();
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      // Bound layout reads to the current section, not every image/text line on the page.
      const nextSource = target?.closest('main section,footer') ?? null;
      if (!nextSource || target?.closest('.project-gallery,.detail-cover,.folder-scene,.project-image,.about-portrait,input,textarea,select,[contenteditable="true"]')) {
        clear();
        return;
      }
      const now = performance.now();
      if (nextSource !== source || now - measuredAt > 100) {
        source = nextSource;
        bounds = source.getBoundingClientRect();
        protectedRects = Array.from(source.querySelectorAll('img,video,.folder-scene,.project-gallery,.detail-cover,.about-portrait,.project-image,.story-grid'))
          .map((node) => node.getBoundingClientRect());
        // Mask actual text lines rather than full-width paragraph boxes.
        for (const text of source.querySelectorAll('p,h1,h2,h3,h4')) {
          const range = document.createRange();
          range.selectNodeContents(text);
          protectedRects.push(...Array.from(range.getClientRects()));
        }
        const header = document.querySelector('.site-header');
        if (header) protectedRects.push(header.getBoundingClientRect());
        measuredAt = now;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!lastPulse || now - lastPulse.born > 140 || Math.hypot(pointerX - lastPulse.x, pointerY - lastPulse.y) > 38) {
        lastPulse = { x: pointerX, y: pointerY, born: now };
        pulses.push(lastPulse);
        pulses = pulses.slice(-4);
      }
      if (!frame) frame = requestAnimationFrame(paint);
    }
    function move(event: PointerEvent) {
      pendingPointer = event;
      if (inputFrame) return;
      inputFrame = requestAnimationFrame(() => {
        inputFrame = 0;
        const latest = pendingPointer;
        pendingPointer = null;
        if (latest) update(latest);
      });
    }
    const modalObserver = new MutationObserver(() => {
      if (document.querySelector('dialog[open]')) clear();
    });
    document.querySelectorAll('dialog').forEach((dialog) => modalObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('resize', clear, { passive: true });
    window.addEventListener('blur', clear);
    window.addEventListener('keydown', clear);
    document.documentElement.addEventListener('pointerleave', clear);
    document.addEventListener('visibilitychange', clear);
    media.addEventListener('change', clear);
    return () => {
      clear();
      modalObserver.disconnect();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', clear);
      window.removeEventListener('blur', clear);
      window.removeEventListener('keydown', clear);
      document.documentElement.removeEventListener('pointerleave', clear);
      document.removeEventListener('visibilitychange', clear);
      media.removeEventListener('change', clear);
    };
  }, [pathname]);

  return <canvas ref={canvasRef} className="pointer-dot-ripple" aria-hidden="true" />;
}
