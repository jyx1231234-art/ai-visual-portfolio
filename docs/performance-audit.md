# 性能审查 · 2026-11-04

范围：本地 Next.js 生产构建。保持开场、标题遮罩、滚动揭幕、文件夹让位、磨砂光标和点阵涟漪。所有 60 页项目内容保留。

## 1. 视频和图片

- public 中无视频文件，业务组件无视频播放或自动播放请求。
- 龙舟赛封面：原始 JPG 3,164,344 B → 网页 WebP 204,454 B。
- AI Icon Skill 封面：原始 JPG 1,127,632 B → 网页 WebP 55,070 B。
- 两张封面网页源文件合计约 260 KB，较原 JPG 减少约 94%。这是源文件对比，**不是页面实际网络流量减少 94%**：旧站也经过 Next Image 优化。原 JPG 留作素材备份，页面已引用 WebP。
- 最大响应式候选宽度由默认 3840px 限制到 1600px，匹配原 PDF 导出宽度，避免下载放大图。新增 320px 缩略图候选。
- 作品过程图仍保留 quality=90、尺寸属性、原始比例和懒加载；大图弹窗直接读取 1600px 原始 WebP。未降低过程稿文字画质。
- 详情页清单改为服务端筛选，仅发送当前项目的页面列表。

## 2. 滚动和鼠标监听

- 磁吸控件不再各自常驻 scroll 监听，仅悬停后注册一次性滚动复位，离开即解除。
- 光标滚动隐藏有状态保护，已隐藏时不再重复操作 DOM、创建隐藏定时器。
- 磁吸目标边界只在目标变化时测量，不在每次 mousemove 里读布局。
- 点阵 pointermove 合并为每帧一次；几何测量从整个 main 缩小为当前 section，测量频率上限保持约 10Hz。滚动、失焦、切页后清理。
- 光标静止后注销自身 GSAP ticker；浏览器验证 will-change 从 transform 回到 auto，点阵 data-active 清除。

## 3. GSAP

- 开场和滚动时间线保持原节奏，仍以 transform / opacity 为主；一次性 ScrollTrigger 和 matchMedia 清理保留。
- 磁吸统一使用现有 GSAP 的 quickTo，移除仅用于磁吸的 Framer Motion 依赖；轻微回归采用平滑缓动。
- 路由与筛选同时触发的 ScrollTrigger.refresh 按动画帧合并，避免同帧重复全局布局测量。
- 文件夹 will-change 限于鼠标进入文件夹区或键盘聚焦时。
- 导航磨砂、光标色彩保留，未为了跑分删除视觉效果。

## 4. 首屏加载

| 指标 | 优化前 | 优化后 |
| --- | ---: | ---: |
| 首页 HTML 引用的初始 JS 原始字节 | 867,890 | 728,795 |
| 上述 JS 的 gzip 字节合计 | 281,203 | 236,172 |
| 字体 preload 数量 | 0 | 1 |

初始 JS gzip 体积降低约 16%。测量方法：获取生产首页 HTML，去重 script src，逐个下载并用 Python gzip 压缩后求和；未包含异步装饰模块。原始记录在 performance-before.json / performance-after.json。

- 本地 Inter Latin 可变字体通过 next/font/local 预加载，中文继续使用系统字体。
- 首屏四张文件夹缩略图 eager 加载，中央 AIGC 缩略图提高优先级；下方项目图继续懒加载。
- 光标与点阵在开场后 2.2 秒异步加载，触屏和 reduced-motion 不加载这两个装饰模块。
- 关闭文件夹和作品卡片的自动路由预取，避免首屏预取所有详情页；点击仍正常导航。

## 验证和边界

- TypeScript 检查和生产构建通过，11 个路由产物生成成功。
- HTTP 核验六个详情页的 PDF 页码顺序，合计 60 页；首页缩略图均 eager，srcset 最大 1600px。
- 浏览器验证桌面首屏、滚动 About、鼠标光标/涟漪触发与静止复位、375px 视口、分类导航、详情大图（原图宽 1600px）、返回首页。检查期间控制台无错误或警告。
- 未执行 Lighthouse、真实移动设备 CPU/网络限速或线上 Web Vitals 采样；不将资源体积下降解释为等比例 LCP 改善，也不承诺所有设备恒定帧率。开场仍刻意保留约 2 秒的展示节奏。

实现参考：[Next Image](https://nextjs.org/docs/app/api-reference/components/image)、[GSAP quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo()/)、[GSAP ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker/)。
