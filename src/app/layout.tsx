import type { Metadata } from 'next';
import { Header, Footer, MotionProvider } from '@/components/ui';
import localFont from 'next/font/local';
import 'mouse-follower/dist/mouse-follower.min.css';
import './globals.css';
import { PointerEffects } from '@/components/pointer-effects';
const inter = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});
export const metadata: Metadata = {
  title: { default: '景义翔 — AI Visual Designer', template: '%s · 景义翔' },
  description: '景义翔的个人设计作品集，精选品牌视觉、运营视觉、UI/UX 与 AIGC 创意设计作品。',
  openGraph: {
    title: '景义翔 — AI Visual Designer',
    description: '2024—2026 Selected Works · Brand Visual / UIUX / AIGC',
    locale: 'zh_CN',
    type: 'website',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>
        <MotionProvider>
          <a className="skip-link" href="#main">
            跳转到主要内容
          </a>
          <Header />
          {children}
          <Footer />
          <PointerEffects />
        </MotionProvider>
      </body>
    </html>
  );
}
