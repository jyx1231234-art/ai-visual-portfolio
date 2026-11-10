# 交付检查记录

检查时间：2026-11-02。环境：Windows、本机 Node.js、Next.js 生产服务。

## 构建与资源

- `pnpm install`：通过，已生成 `pnpm-lock.yaml`。
- `pnpm build`：通过，包括 TypeScript 编译与六个详情页预生成。
- `pnpm typecheck`：通过。
- 首页、作品列表、Branding / UI/UX 分类链接、六个详情页：HTTP 200。
- PDF 简历与 Next Image 优化请求：HTTP 200。
- 不存在的项目路径：HTTP 404。
- `assets.json` 中的图片引用：缺失 0 个。
- 58 张 WebP 素材约 7.6 MB；图片懒加载，Hero 缩略图使用响应式图片服务。

## 浏览器检查

在应用内 Chromium 浏览器检查：

- 1440 × 900：首屏标题、文件夹与作品区布局；已修正初版文件夹与副标题重叠。
- 375 × 812：首页、作品筛选、项目详情、大图弹层、菜单与 About 锚点。
- 768 × 1024：主要文本及网格的横向溢出检查。
- 三种宽度均未检测到页面或主要文字元素向右溢出。
- UI/UX 筛选正确显示 1 个项目。
- 导航菜单打开、关闭、进入 Works / About 正常。
- 卡片进入对应项目详情，详情图可打开、切换下一张、通过 Esc 关闭。
- Back to top 返回顶部正常。
- 最终浏览器 console error / warning：0 条。

减少动态效果通过 `prefers-reduced-motion` CSS 与 Framer Motion 的用户偏好设置实现；本次未切换操作系统设置进行实测。未执行 Lighthouse 评分，也未在实体 iOS / Android 设备上测试。

## 交付内容

- `desktop-preview.png`：1440px 首屏实际浏览器截图。
- `mobile-preview.png`：375px 首屏实际浏览器截图。
- 源码 ZIP 排除了依赖、构建缓存、PDF 提取中间文件；解压后执行 `pnpm install` 即可安装。
- 当前预览地址仅限本地使用，未配置线上域名。

## 2026-11-03 局部动效更新

- 生产构建及 TypeScript 检查通过，未新增依赖。
- 浏览器实际悬停 AIGC 文件夹：封面旋转 15°，作品内页上浮 48px；保留正常分类链接。
- 作品封面出现 VIEW 跟随提示，位置限定在图片边界内；按 Tab 后透明度回到 0。点击第一张卡片成功进入携程 1024 详情页。
- Menu 内部内容检测到轻微位移；菜单打开、关闭与 Works 导航正常。
- 375 × 812：首页无横向溢出，菜单仍为 44 × 44px，Menu 文字按移动端规则隐藏。
- 本轮浏览器捕获的 console error 为 0；低动效和粗指针降级已通过代码检查，未切换系统偏好或实体触控测试。
- `folder-motion-preview.png` 与 `work-hover-preview.png` 为动效实际截图。

## 2026-11-03 磨砂导航与第二屏信息布局

- 首页 DOM 顺序为 Hero → About（个人介绍与全部经历）→ Selected Works → Expertise。
- 1280px 预览中 About 高度约 663px；照片、身份、四段实习、两项教育、数据与简历入口完整呈现。
- 导航计算样式为 64% 白底、24px blur、145% saturation，实测能透出后方文件夹色彩。
- 375px 与 768px 无横向溢出；平板介绍和经历文本没有容器内溢出。
- 手机菜单重复点击 About 后，分区起点约 84px，处于 66px 导航下方；修复相同锚点无法重新定位的问题。
- 生产构建通过。截图为 `about-glass-desktop.png`、`about-mobile.png`。

## 2026-11-03 文件夹相邻让位

- 生产构建通过，浏览器未捕获 console error。
- AIGC 悬停后，四个视觉层依次为：原位、X -32px、上移 12px / 缩放 1.035、X +32px；计算过渡时长均为 0.3s。
- 对比悬停前后四个链接的 bounding rect 与 offsetWidth/offsetHeight：完全一致，布局宽高仍为 335 × 264px。
- 移开后四个视觉层均恢复单位矩阵；整组 scene translate 为 none。
- Branding 文件夹点击后成功进入 `/works?category=Branding`，Branding 筛选按钮为 pressed。
- 去掉逐帧整组位移与高光更新，文件夹区不绘制点阵；让位只动画 transform。未进行硬件帧率追踪，不将实现检查视为所有设备零掉帧保证。
- 悬停截图：`folder-space-preview.png`。

## 2026-11-03 GSAP 开场与滚动揭幕

- 新增 GSAP 3.15.0、@gsap/react 2.1.2；生产构建及 TypeScript 通过。
- 在浏览器观察到首屏标题压缩 / 位移的中间矩阵，后续归位；未进入视口的模块标题保持在遮罩下方。
- Selected Works 揭幕中标题与图片遮罩均出现过渡中间态；结束后标题 transform 为 none，卡片 opacity 为 1，图片遮罩 scaleY 为 0，图片已加载。
- UI/UX 筛选返回 1 张卡片；点击进入旅行足迹详情页成功，返回作品列表正常。
- 375px 下首页及 About 未出现横向溢出，锚点仍定位于导航下方约 84px。
- 本轮浏览器未捕获 error / warning。键盘聚焦可立即完成所属模块动画；鼠标聚焦不会强制跳变。
- 减少动画与卸载回收通过 GSAP matchMedia / useGSAP 实现，CSS 默认可读；未切换系统低动效设置实测，未做硬件帧率追踪。
- 静态截图不能完整表达时间线；请刷新首页查看 opening，并向下滚动体验。截图：`editorial-opening-in-progress.png`、`editorial-works-preview.png`。
