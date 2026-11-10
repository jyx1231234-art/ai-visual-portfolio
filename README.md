# 景义翔 · AI Visual Designer

以白色、瑞士式大字号和蓝紫色文件夹为视觉语言的个人作品集。已接入用户提供的真实项目图片、个人照片、教育经历、实习经历、邮箱和 PDF 简历。

## 本地运行

需要 Node.js 20.9 或更高版本，以及 pnpm。

```sh
pnpm install
pnpm dev
```

浏览器打开 `http://127.0.0.1:3000`。如果 3000 被占用，可用 `pnpm dev --port 3001`。

生产预览：

Windows 下推荐在项目目录运行 `powershell -NoProfile -File scripts/start-preview.ps1`。脚本会在后台独立启动本地服务，关闭当前终端后仍可访问首页与二级页；日志位于 `.preview/`。电脑重启后需重新运行此命令。修改源代码后先重新构建再启动服务。

也可以使用常规的前台预览（需保持终端运行）：

```sh
pnpm build
pnpm start
```

类型检查：`pnpm typecheck`。代码格式化：`pnpm exec prettier --write src`。

## 技术与页面

- Next.js App Router、React、TypeScript、Tailwind CSS 4；GSAP / ScrollTrigger 编排开场与滚动揭幕，GSAP 保留局部磁吸交互。
- `/`：视觉首页 → About 与经历（第二屏）→ 精选作品 → Expertise → Contact。
- `/works`：独立作品集列表，支持 Branding / Campaign / UI/UX / AIGC 分类。
- `/works/[slug]`：六个独立项目页，包含背景、目标、过程、成果和大图查看。
- 文件夹进入相应分类；大图按完整 PDF 页展示，支持连续滚动、前后换页、方向键、原尺寸浏览与 Esc 关闭。
- 菜单与大图使用原生 dialog，支持焦点约束与键盘关闭。
- 系统启用“减少动态效果”时，自动停用位移动效、缩放和 CSS 动画。

## 修改内容

| 文件 | 用途 |
| --- | --- |
| `src/data/projects.ts` | 个人资料、教育/实习、邮箱、项目内容、分类、能力文案 |
| `src/data/assets.json` | 项目详情图的 URL、宽度、高度；按原 PDF 页码分组 |
| `public/images/projects/` | 项目封面和详情图片 |
| `public/images/portrait.webp` | 个人照片 |
| `public/documents/jing-yixiang-resume.pdf` | 可直接打开的简历 |
| `src/components/hero.tsx` | 文件夹分类、图片和文案 |
| `src/components/about.tsx` | 第二屏个人名片、实习时间线与教育经历 |
| `src/app/globals.css` | 颜色、字号、网格、文件夹材质与响应式断点 |
| `src/components/ui.tsx` | 导航、动效容器与联系页脚 |
| `src/components/editorial-motion.tsx` | Opening / TitleLine / Reveal，统一开场、标题遮罩、错峰与图片揭幕时序 |

### 添加项目

1. 把封面和详情图片放入 `public/images/projects/`。封面建议 1600 × 900，详情图保持原始比例。
2. 在 `src/data/assets.json` 增加一个未使用的分组编号，填写每张图片的路径、实际宽高。
3. 在 `src/data/projects.ts` 的 `projects` 中增加一个项目对象，设置唯一 `slug`，通过 `pages` 关联图片分组编号。
4. 更新 Hero 文件夹配图（如需要）。
5. 执行 `pnpm build` 检查新增路由与类型。

替换现有图片可以沿用文件名；如果新图比例不同，需同步更新 `assets.json` 的宽高。项目封面始终采用完整显示，详情图片自适应宽度，长图在加载层面分段，页面按 PDF 页序无缝衔接，不插入分段编号、留白或遮罩；点击可按完整 PDF 页面滚动浏览。

## 视觉规范

### 鼠标氛围动效

`src/components/pointer-atmosphere.tsx` 使用 [Cuberto Mouse Follower](https://github.com/Cuberto/mouse-follower) 1.2.1（MIT）与现有 GSAP。普通区域为 34px 半透明磨砂光球，移动时按速度轻微拉伸；蓝紫、浅蓝和少量暖色以 7 秒节奏缓慢流动。菜单、筛选按钮和联系箭头磁性吸附；作品封面展开为 84px 磨砂 VIEW 圆盘。模糊仅作用于光球小区域，隐藏时暂停颜色动画。旧双弧、浮动标签和 Canvas 点阵已移除。

仅在精细鼠标且系统未开启减少动态效果时创建实例；滚动、键盘导航、弹窗、失焦会收起，页面切换和偏好变化会清理监听、ticker、定时器和 tween。静止时跳过重复样式写入；补齐上游横向或纵向单轴移动时的渲染。原生指针仅在作品封面的 VIEW 模式下隐藏，退出立即恢复。

### 局部交互动效

- 首页文件夹：悬停当前文件夹上移 12px、视觉缩放 1.035，左右紧邻文件夹各向外偏移 32px；保留封面轻启与内页露出，所有悬停过渡统一 300ms。335 × 264px 布局尺寸与点击区域不变，仅内部 `.folder-visual` 做 transform；邻项通过 CSS 相邻选择器联动，无逐帧 React 更新。精细鼠标、非低动效模式启用，键盘聚焦也有对应让位反馈。
- 作品封面：显示 Cuberto 彩色磨砂 `VIEW` 圆盘；鼠标悬停时隐藏重复的固定入口，键盘与触屏保留原入口。
- `src/components/magnetic.tsx`：可复用磁吸容器，Menu、查看全部箭头、联系箭头、返回顶部采用 5–7px 内位移；只移动内部视觉，链接和按钮的点击区域不变。
- 局部交互灵感来自 [React Bits Folder](https://reactbits.dev/components/folder)、[Codrops Magnetic Buttons](https://github.com/codrops/MagneticButtons) 和 [Cuberto Mouse Follower](https://github.com/Cuberto/mouse-follower)。文件夹与按钮使用 CSS / GSAP；鼠标跟随直接使用 Cuberto 的 MIT 开源依赖，并通过 GSAP 统一驱动。

### Opening 与滚动编排

- 首屏约 2.4 秒：Portfolio 从文字遮罩内以 115% 位移、横向 0.86 / 纵向 0.62 压缩归位，星号旋入，四个文件夹错峰展开；副标题随后进入。不添加加载等待或滚动锁。
- 各模块英文标题 1.45 秒揭幕，多行间隔 0.14 秒；正文延后 0.48 秒启动，经历等条目按 0.1 秒错峰。
- 作品双列按 0.18 秒错峰；图片覆盖层向上收起，同时画面从 1.09 倍缩放归位，结束后完整显示。动效只执行一次，不使用持续滚动视差或滚动劫持。
- 标题、文件夹入场和悬停分别使用独立层，避免动画争用 transform；只动画 transform / opacity，保持布局尺寸，结束清除内联动画样式。
- 使用 `useGSAP` / `matchMedia` 清理时间线与 ScrollTrigger。路由和分类变化后刷新滚动位置；快速滚动离开及键盘聚焦立即完成入场，减少动态效果时直接显示静态内容。
- CSS 默认可读，JavaScript 未执行时没有遮罩遮挡。未进行所有设备的帧率保证；实际性能需结合设备测量。

- 背景 `#FFFFFF`，正文 `#1A1A1A`，分区 `#F5F5F5`，交互强调 `#5346DF`。
- 固定导航采用 64% 白色半透明底、24px 背景模糊及细边缘高光；不支持 backdrop-filter 的浏览器退回高不透明度底色。
- 第二屏采用编辑式双栏布局：介绍置顶，左栏个人照片、身份、实际项目/经历数量和简历入口，右栏实习与教育经历；手机端按阅读顺序纵向排列。
- Inter Variable 本地打包，中文使用系统字体；运行时不依赖外部字体服务。
- 桌面参考 1440px、12 列网格，左右边距约 4.45vw；移动端 700px 以下为单列，边距 22px。
- Hero 的文件夹为 CSS 形状、渐变、软阴影和真实作品缩略图，不需要 WebGL 或大体积 3D 资源。
- 入场采用较大幅度遮罩位移与缓慢的 power3 / power4 缓动，无弹簧弹跳；局部悬停保留 300ms 的及时反馈。
- 图片使用 WebP 和 Next Image 的响应式加载；六个详情页构建时预生成。

## 内容来源与待补项

- 简历：`景义翔_合⼯⼤_品牌视觉设计师_2027届.pdf`。
- 作品素材：`景义翔-合工大-品牌视觉-2027校招讲.pdf`，92 页。
- 龙舟赛项目封面替换为用户单独提供的 `F:/作品集待整合页/龙舟赛xxxxxx.jpg`，原样存为 `public/images/projects/dragon-boat-main.jpg`，由 Next Image 按视口优化加载；详情中的原 PDF 过程图继续保留。
- 个人照片取自作品集第 2 页，教育和实习经历与简历核对。
- 首页“04 段实习 / 06 组项目”仅对应本站列出的经历与项目，不声称为全部项目数量。
- 项目介绍是基于所提供作品的网页摘要；原图里的文字与业绩数据保留原样。原简历与旧作品集中的部分效率指标不同，新增网页文案没有复述这些数字。
- 社交主页未提供，页面明确显示“待补充”，没有虚构链接。
- 如需增加社交链接，请在 `src/components/ui.tsx` 的 Footer 中填写真实地址。
- 当前交付为本地网站。正式部署后再配置实际域名对应的 canonical、sitemap 和分享图 URL。

## 素材追溯

| 项目 | 原 PDF 页码 |
| --- | --- |
| 携程 1024 极客文化节 | 5–6（长页分段） |
| 携程龙舟赛 | 7–15 |
| 携程旅行足迹 | 56–69 |
| 科大讯飞火宝 BOBO | 20–31 |
| AI Icon Skill | 71–81 |
| GreenPower 品牌包装 | 33–44 |

项目图和简历沿用用户提供的资料。Inter 字体遵循其 SIL Open Font License（见字体包 LICENSE）。

- AIGC 文件夹与 AI Icon Skill 项目封面使用用户提供的 `F:/作品集待整合页/标准化图标生产.jpg`，原样保存为 `public/images/projects/ai-icon-skill-main.jpg`，通过 Next Image 按尺寸优化加载。

### 局部点阵涟漪

`src/components/dot-ripple.tsx` 独立叠加局部 360px Canvas 点阵，保留原有 Cuberto、开场、滚动与文件夹动效。鼠标移动产生最多四个向外扩散的波纹，停止约 1.8 秒后消退并停止动画帧。DPR 上限 1.5；图片、文件夹、正文及标题区域留空。滚动、切页、弹窗、键盘操作与失焦清理，触屏和减少动态效果模式停用。

### PDF 页面完整性

现有六个项目使用原 PDF 的完整项目页段，共 60 页。范围和核查记录见 `docs/pdf-page-audit.md`。`scripts/import-portfolio.py` 可重建缺失的页面素材并验证尺寸；默认不会覆盖已替换的封面。


### 性能优化（2026-11-04）

- 封面原始 JPG 保留，网页引用由 `scripts/optimize-covers.py` 生成的 1600px WebP；覆盖素材后重新执行此脚本。
- Next Image 最大候选宽度为 1600px，避免放大 PDF 导出图；长图保持 quality=90 和懒加载，大图弹窗仍使用原始 WebP。
- Inter 拉丁字符可变字体使用 next/font/local 预加载，中文继续使用系统字体。
- 首屏文件夹图片 eager 加载；作品链接不自动预取所有详情页。
- 开场/滚动/磁吸统一使用 GSAP；ScrollTrigger 的路由与筛选刷新按帧合并。
- 桌面光标与点阵在开场后按需加载，触屏和低动效模式不加载。光标静止后移除 ticker，磁吸仅在悬停时注册一次性滚动复位。
- 点阵输入合并到每帧一次，几何测量限于当前 section；滚动清理不重复修改已隐藏光标。
- 详情页资源清单在服务端按项目筛选，客户端不再包含所有项目的清单。
- 数据与验证边界见 `docs/performance-audit.md`。
