'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import MouseFollower from 'mouse-follower';

// The upstream render skips either axis when its velocity is zero. Render changed
// positions on both axes, and avoid style writes after the cursor has settled.
class PortfolioFollower extends MouseFollower {
  private lastFrame?: string;
  private rendering = false;
  wake() {
    if (this.rendering) return;
    this.rendering = true;
    gsap.ticker.add(this.ticker);
  }
  rest() {
    this.rendering = false;
    gsap.ticker.remove(this.ticker);
    this.setter.wc('auto');
  }
  render(force: boolean) {
    const signature = [this.pos.x, this.pos.y, this.vel.x, this.vel.y, this.skewing].join(',');
    if (!force && signature === this.lastFrame) {
      this.rest();
      return;
    }
    this.lastFrame = signature;
    super.render(true);
  }
}

export function PointerAtmosphere() {
  const pathname = usePathname();

  useEffect(() => {
    MouseFollower.registerGSAP(gsap);
    const media = matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let cursor: PortfolioFollower | null = null;
    let artwork: HTMLElement | null = null;
    let mode = '';
    let shown = false;
    let stickyTarget: HTMLElement | null = null;

    function clearArtwork() {
      artwork?.removeAttribute('data-pointer-preview');
      artwork = null;
    }
    function hide() {
      clearArtwork();
      if (!cursor || !shown) return;
      stickyTarget = null;
      cursor.removeStick();
      cursor.removeText();
      cursor.removeState('-pointer -active');
      cursor.hide();
      gsap.killTweensOf(cursor.pos);
      cursor.rest();
      shown = false;
      mode = '';
    }
    function destroy() {
      clearArtwork();
      if (!cursor) return;
      // Upstream destroy does not cancel delayed callbacks or in-flight tweens.
      clearTimeout(cursor.visibleInt);
      clearTimeout(cursor.mediaInt);
      gsap.killTweensOf(cursor.pos);
      gsap.killTweensOf(cursor);
      cursor.destroy();
      cursor = null;
      shown = false;
      mode = '';
      stickyTarget = null;
      document.documentElement.removeAttribute('data-cuberto-cursor');
    }
    function updatePreference() {
      destroy();
      if (!media.matches || document.hidden) return;
      cursor = new PortfolioFollower({
        speed: 0.48,
        ease: 'expo.out',
        skewing: 1,
        skewingText: 1.35,
        skewingDeltaMax: 0.12,
        stickDelta: 0.18,
        visible: false,
        dataAttr: null,
        stateDetection: {},
      });
      cursor.el.setAttribute('aria-hidden', 'true');
      cursor.rest();
      document.documentElement.setAttribute('data-cuberto-cursor', 'ready');
    }
    function move(event: MouseEvent) {
      if (!cursor) return;
      const element = event.target instanceof Element ? event.target : null;
      if (!element || document.querySelector('dialog[open]') || element.closest('input,textarea,select,iframe,[contenteditable="true"]')) {
        hide();
        return;
      }
      const nextArtwork = element.closest<HTMLElement>('.project-link .project-image');
      if (nextArtwork !== artwork) {
        clearArtwork();
        artwork = nextArtwork;
        artwork?.setAttribute('data-pointer-preview', 'active');
      }
      const sticky = element.closest<HTMLElement>('.menu-trigger,.contact-arrow,.filter-row button,.footer-bottom button');
      const nextMode = artwork ? 'view' : element.closest('a,button') ? 'link' : 'idle';
      if (mode !== nextMode) {
        cursor.removeText();
        cursor.removeState('-pointer');
        if (nextMode === 'view') cursor.setText('VIEW');
        else if (nextMode === 'link') cursor.addState('-pointer');
        mode = nextMode;
      }
      if (sticky !== stickyTarget) {
        if (sticky) cursor.setStick(sticky);
        else cursor.removeStick();
        stickyTarget = sticky;
      }
      cursor.wake();
      if (!shown) {
        cursor.show();
        shown = true;
      }
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Tab' || event.key === 'Escape') hide();
    }
    function pointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') hide();
    }
    const dialogs = new MutationObserver(() => {
      if (document.querySelector('dialog[open]')) hide();
    });
    document.querySelectorAll('dialog').forEach((dialog) =>
      dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] }),
    );
    updatePreference();
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('pointerdown', pointer, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', keyboard);
    document.documentElement.addEventListener('mouseleave', hide);
    document.addEventListener('visibilitychange', updatePreference);
    media.addEventListener('change', updatePreference);
    return () => {
      dialogs.disconnect();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('pointerdown', pointer);
      window.removeEventListener('scroll', hide);
      window.removeEventListener('resize', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', keyboard);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.removeEventListener('visibilitychange', updatePreference);
      media.removeEventListener('change', updatePreference);
      destroy();
    };
  }, [pathname]);

  return null;
}
