import type {
  AgentId,
  AgentMeta,
  BusinessPlan,
  FlowNode,
  PricingTier,
} from "@/lib/types";
import { classify, shortIdea, type Pack } from "@/lib/packs";

export const AGENTS: AgentMeta[] = [
  {
    id: "pm",
    name: "Aria",
    title: "产品经理",
    focus: "定义问题、划 MVP 边界、写 GTM 简报",
    accent: "violet",
  },
  {
    id: "dev",
    name: "Nova",
    title: "研发工程师",
    focus: "写页面、跑自检、产出可预览代码",
    accent: "blue",
  },
  {
    id: "ops",
    name: "Milo",
    title: "增长运营",
    focus: "定位、定价、SEO 与冷启动",
    accent: "cyan",
  },
];

export const AGENT_MAP: Record<AgentId, AgentMeta> = AGENTS.reduce(
  (acc, agent) => ({ ...acc, [agent.id]: agent }),
  {} as Record<AgentId, AgentMeta>,
);

export const FLOW_NODES: FlowNode[] = [
  {
    id: "definition",
    title: "产品定义",
    agent: "pm",
    deliverable: "问题定义 · 用户画像",
    brief: "读取想法，收敛核心矛盾与首批用户",
  },
  {
    id: "design",
    title: "产品设计",
    agent: "pm",
    deliverable: "信息架构 · 视觉基调",
    brief: "确定页面结构与唯一转化动作",
  },
  {
    id: "build",
    title: "研发实现",
    agent: "dev",
    deliverable: "落地页源码",
    brief: "把产品稿写成可运行的页面",
  },
  {
    id: "test",
    title: "测试校验",
    agent: "dev",
    deliverable: "质量检查报告",
    brief: "结构、响应式与性能自检",
  },
  {
    id: "review",
    title: "效果检查",
    agent: "ops",
    deliverable: "商业企划",
    brief: "用 PM 简报生成定位与冷启动方案",
  },
  {
    id: "launch",
    title: "准备并部署",
    agent: "ops",
    deliverable: "部署清单 · 预览链接",
    brief: "打包产物，准备对外演示",
  },
];

export interface CompanyContext {
  idea: string;
  pack: Pack;
  name: string;
  latin: string;
  tagline: string;
}

export function buildContext(idea: string): CompanyContext {
  const pack = classify(idea);
  return {
    idea: idea.trim(),
    pack,
    name: pack.name,
    latin: pack.latin,
    tagline: pack.tagline,
  };
}

function pricingLine(tiers: PricingTier[]): string {
  return tiers
    .map((t) => (t.price.startsWith("¥") ? `${t.name} ${t.price}${t.unit}` : t.name))
    .join(" / ");
}

export function nodeLines(
  ctx: CompanyContext,
  nodeId: string,
  meta: { kb: number },
): { lines: string[]; detail: string } {
  const { pack } = ctx;
  const idea = shortIdea(ctx.idea, 62);

  switch (nodeId) {
    case "definition":
      return {
        lines: [
          `收到想法：「${idea}」`,
          `拆解核心矛盾：${pack.problem}`,
          `锁定首批用户：${pack.targetUsers.slice(0, 2).join("、")}；MVP 边界收敛为「${pack.mvpScope}」。`,
        ],
        detail: `已定义问题与用户 · MVP 边界：${pack.mvpScope}`,
      };
    case "design":
      return {
        lines: [
          "输出信息架构：首屏主张 → 3 个核心能力 → 使用路径 → 定价与转化。",
          `视觉基调定为深色科技风 + ${pack.name} 品牌渐变，大字排版、留白优先。`,
          `唯一主行动统一为「${pack.cta}」，同时写下交给运营的 GTM 简报。`,
        ],
        detail: "信息架构与视觉基调已确定，产品稿移交研发",
      };
    case "build":
      return {
        lines: [
          "研发 Agent 接手产品稿，先搭响应式栅格与组件骨架。",
          `实现「${pack.features[0].title}」等 3 个能力区块、三步路径与定价表。`,
          "产出零外部依赖的自包含 HTML，可直接进入沙箱预览。",
        ],
        detail: `落地页 HTML 已生成（约 ${meta.kb}KB，零外部依赖）`,
      };
    case "test":
      return {
        lines: [
          "执行结构检查：标题层级、按钮可点击、移动端断点均通过。",
          "校对对比度与文案一致性，修复 2 处间距、1 处窄屏溢出。",
          "性能扫描通过：首屏无阻塞脚本，满足演示级性能基线。",
        ],
        detail: "6 项检查通过 · 0 阻塞问题",
      };
    case "review":
      return {
        lines: [
          "运营 Agent 读取 PM 的 GTM 简报，开始生成商业企划。",
          `定位收束为一句话：「${pack.tagline}」，关键词锁定 ${pack.seo.join(" / ")}。`,
          `定价采用 ${pricingLine(pack.pricing)}；冷启动第一步是「${pack.coldStart[0].title}」。`,
        ],
        detail: `商业企划已生成 · ${pack.name}：${pack.tagline}`,
      };
    case "launch":
    default:
      return {
        lines: [
          "生成部署清单：静态产物、SEO 元信息、埋点位置与演示域名。",
          "把预览链接、商业企划与交接记录打包进同一份交付物。",
          "全部就绪，可预览 MVP 与企划，等待你的下一句指令。",
        ],
        detail: "交付完成 · 预览 / 企划 / 部署清单",
      };
  }
}

export function buildBusinessPlan(ctx: CompanyContext): BusinessPlan {
  const p = ctx.pack;
  return {
    name: ctx.name,
    latin: ctx.latin,
    tagline: ctx.tagline,
    summary: ctx.pack.subline,
    problem: p.problem,
    promise: p.promise,
    features: p.features.slice(0, 3),
    pricing: p.pricing,
    targetUsers: p.targetUsers,
    seo: p.seo,
    coldStart: p.coldStart,
    stack: p.stack,
    mvpScope: p.mvpScope,
  };
}
