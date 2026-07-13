export type Profile = {
  siteName: string;
  displayName: string;
  identity: string;
  tags: string[];
  intro: string;
  email: string;
  avatarSrc: string;
  avatarAlt: string;
};

export type HeroShowcasePanel = {
  eyebrow: string;
  title: string;
  description: string;
  signal: string;
  tags: string[];
};

export type StatWorkPreview = {
  type: string;
  title: string;
  description: string;
  tags: string[];
  previews: string[];
};

export type Stat = {
  value: string;
  label: string;
  work: StatWorkPreview;
};

export type JourneyItem = {
  period: string;
  title: string;
  description: string;
};

export type Work = {
  type: string;
  title: string;
  description: string;
  tags: string[];
};

export type Capability = {
  title: string;
  description: string;
  signals: string[];
};

export type SocialLink = {
  label: string;
  value: string;
  href: string;
};

export const profile: Profile = {
  siteName: "GanDen-说AI",
  displayName: "GanDen",
  identity: "AI博主 / Vibe-Coding爱好者 / AI-Agent开发者",
  tags: ["AI Agent", "AIGC落地", "Vibe Coding", "AI短视频"],
  intro:
    "这里将沉淀关于AI产品化、自动化工作流、创意编码与短视频内容生产的实践记录。当前为占位版本，后续可直接替换为真实简介。",
  email: "hello@example.com",
  avatarSrc: `${import.meta.env.BASE_URL}avatar.png`,
  avatarAlt: "GanDen个人头像占位",
};

export const heroShowcasePanels: HeroShowcasePanel[] = [
  {
    eyebrow: "AI Agent Lab",
    title: "智能体实验室",
    description: "预留 Agent 工作流、工具调用和自动化执行方案展示位。",
    signal: "Planning / Tools / Evaluation",
    tags: ["Agent", "Workflow", "Automation"],
  },
  {
    eyebrow: "Vibe Coding Works",
    title: "创意编码现场",
    description: "预留 React、动效、视觉系统和网页实验案例展示位。",
    signal: "React / GSAP / Prototype",
    tags: ["React", "Motion", "Design"],
  },
  {
    eyebrow: "AIGC Pipeline",
    title: "内容生产管线",
    description: "预留 AI 短视频、选题、脚本、分镜和多平台分发流程。",
    signal: "Prompt / Storyboard / Publish",
    tags: ["AIGC", "Video", "Creator"],
  },
];

export const stats: Stat[] = [
  {
    value: "24+",
    label: "AI实验项目占位",
    work: {
      type: "AI Project Archive",
      title: "智能内容工作台",
      description: "聚合选题、脚本、分镜与发布节奏管理的 AI 内容生产系统占位。",
      tags: ["Agent", "Workflow", "Creator Tool"],
      previews: ["选题池", "脚本板", "发布链"],
    },
  },
  {
    value: "12",
    label: "Vibe Coding案例",
    work: {
      type: "Vibe Coding Gallery",
      title: "未来感网页实验集",
      description: "使用 React、动效和视觉系统快速生成高完成度交互网页的案例集合。",
      tags: ["React", "GSAP", "Prototype"],
      previews: ["Hero", "Motion", "UI Kit"],
    },
  },
  {
    value: "8",
    label: "Agent工作流",
    work: {
      type: "Agent Workflow",
      title: "多步骤任务调度器",
      description: "用于拆解任务、调用工具、校验结果并沉淀自动化流程的 Agent 实验。",
      tags: ["Planning", "Tools", "Evaluation"],
      previews: ["规划", "执行", "校验"],
    },
  },
  {
    value: "100K",
    label: "内容曝光占位",
    work: {
      type: "AI Video Pipeline",
      title: "AI短视频创作流水线",
      description: "从热点拆解到脚本、配图、剪辑建议和封面文案的内容生产链路。",
      tags: ["Short Video", "Prompt", "AIGC"],
      previews: ["热点", "脚本", "封面"],
    },
  },
];

export const journey: JourneyItem[] = [
  {
    period: "阶段 01",
    title: "AI内容观察与表达",
    description: "围绕AI工具、模型能力和创作者工作流，形成稳定的内容选题与表达方法。",
  },
  {
    period: "阶段 02",
    title: "AIGC项目落地实践",
    description: "将生成式AI能力嵌入真实业务流程，探索从想法、原型到上线的最短路径。",
  },
  {
    period: "阶段 03",
    title: "AI Agent与自动化系统",
    description: "搭建任务拆解、工具调用、数据整理和内容生产相关的Agent实验方案。",
  },
];

export const works: Work[] = [
  {
    type: "AI Project",
    title: "智能内容工作台",
    description: "占位项目：聚合选题、脚本、分镜与发布节奏管理的AI内容生产系统。",
    tags: ["Agent", "Workflow", "Creator Tool"],
  },
  {
    type: "Vibe Coding",
    title: "未来感网页实验集",
    description: "占位项目：使用React、动画和视觉系统快速生成高完成度交互网页。",
    tags: ["React", "GSAP", "Prototype"],
  },
  {
    type: "Automation",
    title: "跨平台素材整理脚本",
    description: "占位项目：自动归档素材、提取要点、生成内容草稿并输出发布清单。",
    tags: ["Script", "AIGC", "Batch"],
  },
  {
    type: "AI Video",
    title: "AI短视频创作流水线",
    description: "占位项目：从热点拆解到脚本、配图、剪辑建议和封面文案的自动化链路。",
    tags: ["Short Video", "Prompt", "AIGC"],
  },
];

export const capabilities: Capability[] = [
  {
    title: "前端开发",
    description: "构建有表现力、响应式且便于维护的Web体验。",
    signals: ["React", "TypeScript", "Design System"],
  },
  {
    title: "GSAP动效",
    description: "使用克制的动效增强节奏感，不牺牲阅读和性能。",
    signals: ["ScrollTrigger", "Micro Motion", "Motion Audit"],
  },
  {
    title: "AI Agent",
    description: "设计任务拆解、工具调用和结果校验的自动化执行链。",
    signals: ["Tool Use", "Planning", "Evaluation"],
  },
  {
    title: "提示词工程",
    description: "把模糊意图转化为稳定、可复用、可评估的AI指令。",
    signals: ["Prompt System", "Templates", "Iteration"],
  },
  {
    title: "AI短视频",
    description: "面向内容传播设计脚本、节奏、封面和多平台分发方案。",
    signals: ["Script", "Storyboard", "Distribution"],
  },
];

export const socialLinks: SocialLink[] = [
  { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { label: "抖音", value: "账号占位", href: "#connect" },
  { label: "GitHub", value: "github.com/placeholder", href: "#connect" },
  { label: "小红书", value: "账号占位", href: "#connect" },
  { label: "TikTok", value: "@placeholder", href: "#connect" },
];
