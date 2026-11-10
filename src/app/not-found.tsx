import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="not-found section-shell">
      <span className="eyebrow">404 / PAGE NOT FOUND</span>
      <h1>
        A little
        <br />
        off the grid.
      </h1>
      <p>这一页暂时不在作品集中。</p>
      <Link href="/works" className="text-link">
        探索全部作品 ↗
      </Link>
    </main>
  );
}
