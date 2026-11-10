export type Category = 'All' | 'Branding' | 'Campaign' | 'UI/UX' | 'AIGC';
export type Project = {
  slug: string;
  name: string;
  english: string;
  category: Category;
  tags: string[];
  year: string;
  cover: string;
  color: string;
  description: string;
  role: string;
  background: string;
  goal: string;
  process: string;
  outcome: string;
  pages: number[];
};
export const profile = {
  name: '景义翔',
  english: 'Jing Yixiang',
  email: '2298946759@qq.com',
  title: 'AI Visual Designer',
  resume: '/documents/jing-yixiang-resume.pdf',
  intro:
    '我是一名专注于品牌视觉、数字体验与 AI 创意设计的视觉设计师。擅长将业务需求转化为具有辨识度和传播力的视觉方案，同时探索 AIGC 在设计流程中的实际应用。',
  education: [
    { school: '合肥工业大学', degree: '视觉传达 · 硕士 · 2027 届' },
    { school: '山西大学', degree: '视觉传达 · 本科' },
  ],
  experience: [
    { period: '2026.04 — 2026.09', company: '携程集团', role: '创意设计实习' },
    { period: '2025.11 — 2026.03', company: '科大讯飞', role: '视觉设计实习' },
    { period: '2025.07 — 2025.09', company: '不眠虎设计工作室', role: '品牌设计实习' },
    { period: '2023.07 — 2023.09', company: '好未来', role: '产品设计实习' },
  ],
};
export const projects: Project[] = [
  {
    slug: 'trip-geek-festival',
    name: '携程 1024 极客文化节',
    english: 'A celebration of geek culture.',
    category: 'Campaign',
    tags: ['活动主视觉', '品牌延展'],
    year: '2026',
    cover: '/images/projects/cover-5.webp',
    color: '#e9e7f2',
    description: '以极客文化为线索，构建从主视觉到活动现场的完整视觉表达。',
    role: '品牌活动视觉设计',
    background: '围绕携程 1024 极客文化节，建立兼具技术氛围与活动感染力的品牌视觉。',
    goal: '让核心主题在主视觉、传播物料与线下场景中形成一致的识别。',
    process: '从主题表达与视觉探索出发，逐步建立主视觉语言，并延展至活动传播与现场物料。',
    outcome: '作品集中呈现了主视觉、延展设计与场景应用。以下保留原项目中的设计推导和完整视觉成果。',
    pages: [5, 6],
  },
  {
    slug: 'trip-dragon-boat',
    name: '携程龙舟赛',
    english: 'Together, beyond the current.',
    category: 'Campaign',
    tags: ['活动视觉', 'IP 周边'],
    year: '2026',
    cover: '/images/projects/dragon-boat-main.webp',
    color: '#e8f4fc',
    description: '同心破浪，无界争流。让传统节日与年轻化的品牌表达相遇。',
    role: '主视觉 / 传播物料 / 周边设计',
    background: '携程龙舟赛需要在节日文化与团队活力之间建立鲜明的活动形象。',
    goal: '以“同心破浪，无界争流”为主题，营造轻松、有力量的赛事氛围。',
    process:
      '通过草图、角色与色彩探索确定视觉方向，将龙舟、角色和水面动势整合为核心画面，再完成海报与周边延展。',
    outcome: '完成活动主视觉、传播海报、贴纸与周边等多场景设计。',
    pages: [7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  {
    slug: 'trip-travel-footprint',
    name: '携程旅行足迹',
    english: 'Every journey tells a story.',
    category: 'UI/UX',
    tags: ['产品体验', '界面视觉'],
    year: '2026',
    cover: '/images/projects/cover-56.webp',
    color: '#e9eff8',
    description: '从地点记录到旅行叙事，探索更有情感的数字旅行体验。',
    role: '参与 UI/UX 设计与视觉探索',
    background: '围绕携程 App 的旅行足迹功能，探索旅行记录的视觉呈现与体验升级。',
    goal: '梳理旅行信息的层级，让用户更直观地回顾足迹、查看地点并分享旅行故事。',
    process: '结合用户痛点与竞品分析，探索地图、地球和旅行卡片的视觉关系，并对关键界面进行迭代。',
    outcome: '形成多版界面探索与关键功能设计，覆盖足迹总览、旅行信息、地点图片和分享等场景。',
    pages: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
  },
  {
    slug: 'iflytek-bobo',
    name: '科大讯飞 · 火宝 BOBO',
    english: 'A little spark. A lot of character.',
    category: 'Branding',
    tags: ['品牌 IP', '角色体系'],
    year: '2026',
    cover: '/images/projects/cover-20.webp',
    color: '#fff1df',
    description: '为智慧体育赋予温度，构建有活力、可延展的品牌角色。',
    role: '参与 IP 形象升级与视觉延展',
    background: '针对科大讯飞智慧体育场景，参与品牌 IP 的形象升级，探索更贴近用户的角色表达。',
    goal: '将运动活力、科技感与亲和力融入角色，并建立可用于不同场景的视觉体系。',
    process:
      '从原有形象问题和用户场景出发，进行角色设定、造型探索、表情动作与场景延展，结合 AI 辅助设计推进方案迭代。',
    outcome: '形成火宝 BOBO 角色形象、表情、应用场景与品牌周边等视觉成果。',
    pages: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  },
  {
    slug: 'ai-icon-skill',
    name: 'AI Icon Skill',
    english: 'From design rules to a workflow.',
    category: 'AIGC',
    tags: ['AI 工作流', '图标规范'],
    year: '2026',
    cover: '/images/projects/ai-icon-skill-main.webp',
    color: '#edf0fa',
    description: '将图标设计规范转化为可复用的 AI 工作流，让创作与交付更连贯。',
    role: 'AI 辅助设计流程探索',
    background: '在携程设计实践中，探索跨场景图标需求的标准化生成与交付方式。',
    goal: '让图标生成遵循设计规范，同时关注可编辑性、风格一致性与交付验证。',
    process:
      '将需求理解、规范约束、生成流程与验证组织成 Skill，并通过持续迭代完善从需求到图标的工作流。',
    outcome: '作品集中展示了 Skill 架构、生成步骤、设计规范与图标实例。',
    pages: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81],
  },
  {
    slug: 'greenpower-packaging',
    name: 'GreenPower · 品牌包装',
    english: 'Good things, naturally.',
    category: 'Branding',
    tags: ['包装设计', 'AIGC 创意'],
    year: '2025',
    cover: '/images/projects/cover-33.webp',
    color: '#eaf3e8',
    description: '以鲜明色彩和植物语言，打造超级食物粉的品牌包装与传播视觉。',
    role: '包装主视觉 / 版式 / 电商视觉',
    background: '在不眠虎设计工作室实习期间，参与“植然力超级食物粉”的品牌包装与相关视觉设计。',
    goal: '建立清晰的产品系列识别，并将包装语言延展到电商与品牌传播场景。',
    process:
      '围绕产品特征组织色彩、字体与植物图形，探索包装版式和系列关系，结合 AIGC 辅助创意与场景视觉探索。',
    outcome: '完成系列包装视觉、电商内容与品牌应用延展，呈现统一的产品形象。',
    pages: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
  },
];
export const categories: Category[] = ['All', 'Branding', 'Campaign', 'UI/UX', 'AIGC'];
export const expertise = [
  {
    name: 'Brand Visual',
    cn: '品牌视觉',
    description: '品牌识别、活动主视觉、IP 视觉体系及多场景延展。',
  },
  {
    name: 'Digital Experience',
    cn: '数字体验',
    description: 'UI/UX、信息架构、交互视觉与数字化体验。',
  },
  {
    name: 'AI Creative',
    cn: 'AI 创意',
    description: 'AIGC 创意探索、AI 辅助设计、设计工作流与效率优化。',
  },
  {
    name: 'Visual Execution',
    cn: '视觉落地',
    description: '从概念构思到跨媒介视觉落地，保持设计一致性。',
  },
];
