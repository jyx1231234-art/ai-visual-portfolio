'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Cursor = dynamic(() => import('./pointer-atmosphere').then(m => m.PointerAtmosphere), { ssr: false });
const Ripple = dynamic(() => import('./dot-ripple').then(m => m.DotRipple), { ssr: false });

/** Optional decoration should not compete with the opening or load on touch devices. */
export function PointerEffects() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let timer = 0;
    const update = () => {
      clearTimeout(timer);
      setEnabled(false);
      if (media.matches) timer = window.setTimeout(() => setEnabled(true), 2200);
    };
    update();
    media.addEventListener('change', update);
    return () => { clearTimeout(timer); media.removeEventListener('change', update); };
  }, []);
  return enabled ? <><Cursor /><Ripple /></> : null;
}
