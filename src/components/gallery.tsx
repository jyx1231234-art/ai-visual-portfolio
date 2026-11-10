'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

type Asset = { src: string; width: number; height: number };
export type GallerySheet = { page: number; images: Asset[] };
export function Gallery({ sheets, title }: { sheets: GallerySheet[]; title: string }) {
  const [index, setIndex] = useState(0),
    [opened, setOpened] = useState(false),
    [zoom, setZoom] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [opened]);
  useEffect(() => {
    canvas.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [index, opened, zoom]);
  function move(delta: number) {
    if (!sheets.length) return;
    setIndex((i) => (i + delta + sheets.length) % sheets.length);
    setZoom(false);
  }
  const current = sheets[index];
  return (
    <>
      <div className="project-gallery" aria-label={`${title}，连续项目展示`}>
        {sheets.map((sheet, i) => (
          <figure key={sheet.page} data-pdf-page={sheet.page}>
            <button
              onClick={() => {
                setIndex(i);
                setZoom(false);
                setOpened(true);
                dialog.current?.showModal();
              }}
              aria-label={`放大查看${title}，第 ${i + 1} 页完整长图`}
            >
              {sheet.images.map((asset, tile) => (
                <Image
                  key={asset.src}
                  src={asset.src}
                  width={asset.width}
                  height={asset.height}
                  alt={`${title} · 第 ${i + 1} 页，连续内容 ${tile + 1}`}
                  sizes="(max-width: 700px) 100vw, 92vw"
                  quality={90}
                />
              ))}
            </button>
          </figure>
        ))}
      </div>
      <dialog
        aria-label={title + '大图浏览'}
        ref={dialog}
        className="lightbox"
        onClose={() => setOpened(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            move(e.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <div className="lightbox-toolbar">
          <span>{title} · 第 {index + 1} / {sheets.length} 页</span>
          <div>
            <button onClick={() => setZoom((v) => !v)}>{zoom ? '适应宽度' : '查看原尺寸'}</button>
            <button onClick={() => dialog.current?.close()} aria-label="关闭大图">关闭 ×</button>
          </div>
        </div>
        <div
          ref={canvas}
          className={`lightbox-canvas ${zoom ? 'zoomed' : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          {opened && current && (
            <div className="lightbox-sheet" style={{ width: current.images[0].width }}>
              {current.images.map((asset, tile) => (
                <img
                  key={asset.src}
                  src={asset.src}
                  width={asset.width}
                  height={asset.height}
                  alt={`${title}，第 ${index + 1} 页，连续内容 ${tile + 1}`}
                  loading={tile === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ))}
            </div>
          )}
        </div>
        <div className="lightbox-controls">
          <button onClick={() => move(-1)} aria-label="上一页" disabled={sheets.length < 2}>← 上一页</button>
          <span>上下滚动阅读 · 方向键换页 · Esc 关闭</span>
          <button onClick={() => move(1)} aria-label="下一页" disabled={sheets.length < 2}>下一页 →</button>
        </div>
      </dialog>
    </>
  );
}
