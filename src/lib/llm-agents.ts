import type { BusinessPlan, Feature, PricingTier, Step } from "@/lib/types";
import { complete } from "@/lib/llm";

export interface PmResult {
  name: string;
  latin: string;
  tagline: string;
  summary: string;
  problem: string;
  promise: string;
  features: Feature[];
  targetUsers: string[];
  mvpScope: string;
  cta: string;
  definitionLines: string[];
  designLines: string[];
  gtmNote: string;
}

export interface DevResult {
  buildLines: string[];
  testLines: string[];
  html: string;
}

export interface OpsResult {
  plan: BusinessPlan;
  reviewLines: string[];
  launchLines: string[];
}

const PM_SYSTEM = `你是 Atoms-Mini 的 AI 产品经理 Aria，擅长把一句模糊的创业想法收敛成可交付的 MVP。只输出一个 JSON 对象，不要 markdown 代码围栏，不要解释。
JSON 字段：
name：中文产品名（2-6 字，避免「XX平台」这类空泛词）
latin：英文品牌名（≤12 字符）
tagline：一句话定位（≤20 字，说清给谁解决什么）
summary：一句话产品简介（≤40 字）
problem：用户当下的核心痛点（≤60 字）
promise：对用户的核心承诺（≤40 字）
features：恰好 3 个对象，每个 {title(≤8字), desc(≤30字), icon(从 route|users|shield|target|map|calendar|chart|bell|heart|search|wallet|clock|zap|package|mic|layers|sparkles 中选一个)}
targetUsers：恰好 3 条，每条 ≤16 字
mvpScope：MVP 第一版只做什么（≤40 字）
cta：页面唯一主按钮文案（≤8 字）
definitionLines：恰好 3 句，第一人称汇报你如何拆解问题（每句 ≤45 字）
designLines：恰好 3 句，说明信息架构与视觉基调（每句 ≤45 字）
gtmNote：给运营的 GTM 简报（≤60 字）
要求：内容必须紧扣用户想法，具体、可执行，禁止套话；不要出现真实公司名；三个功能的描述不要互相重复。`;

const DEV_SYSTEM = `你是 Atoms-Mini 的研发工程师 Nova。你会收到产品经理的产品稿，需要交付一个可直接运行的完整单文件 HTML。
只输出一个 JSON 对象，不要 markdown 代码围栏，不要解释。
JSON 字段：
buildLines：恰好 3 句，第一人称说明你如何实现（每句 ≤45 字）
testLines：恰好 3 句，说明你做了哪些自检与修复（每句 ≤45 字）
html：完整的 HTML 源码字符串

页面硬性要求：
1. 单文件：所有 CSS 放在 <style>，所有 JS 放在 <script>，不得引用任何外部资源（禁止 http/https 外链、CDN、外链字体与图片、import）。视觉元素用 CSS 渐变、内联 SVG 或 emoji。
2. 深色科技风 + 紫蓝渐变，参考 Atoms / Lovable 的观感；排版克制、留白充足；适配手机与桌面（至少一个 @media 断点），body 设置 overflow-x: hidden，所有区块左右至少 16px 内边距，标题与正文不得贴边或被裁切，禁止横向滚动。
3. 必须落实产品稿的唯一主行动（cta），并至少实现 1 个真实可用的交互，例如：提交表单后在页面内追加一条记录、列表筛选、切换定价、复制联系方式、步骤展开。数据放内存即可，刷新丢失可接受。
4. 文案全部使用简体中文，具体、可信；禁止真实登录、真实支付、真实公司名。
5. 使用语义化标签与 aria-label；按钮有 hover / active 状态；禁止使用 alert()。
6. HTML 体积控制在 24KB 以内，不写代码注释，要包含 <title>、viewport meta 和基础响应式。`;

const OPS_SYSTEM = `你是 Atoms-Mini 的增长运营 Milo。你会收到产品经理的产品稿与研发的自检结果，需要产出可执行的商业企划。
只输出一个 JSON 对象，不要 markdown 代码围栏，不要解释。
JSON 字段：
plan：{
  name、latin、tagline：沿用产品稿，不得改动；
  summary(≤40字)、problem(≤60字)、promise(≤40字)；
  features：恰好 3 个 {title,desc,icon}，沿用产品稿的功能，可润色 desc；
  pricing：恰好 3 档 {name, price(如「¥39」), unit(如「/月」「/次」「/年」), desc(≤30字), perks(恰好3条，每条≤10字), featured(仅一档为 true)}；
  targetUsers：恰好 3 条；seo：恰好 3 条中文搜索词（每条 ≤12 字）；
  coldStart：恰好 3 步 {title(≤10字), desc(≤40字)}；
  stack：3-5 项技术或能力关键词；mvpScope：≤40 字
}
reviewLines：恰好 3 句，第一人称说明你如何核对效果与卖点（每句 ≤45 字）
launchLines：恰好 3 句，第一人称说明发布清单（每句 ≤45 字）
要求：定价符合中国市场的早期产品，价位要有梯度；冷启动第一步必须能在 7 天内执行；禁止空话与套话。`;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function parseJson(raw: string): Record<string, unknown> {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const candidates = [cleaned];
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) candidates.push(cleaned.slice(start, end + 1));
  for (const candidate of candidates) {
    try {
      const value = JSON.parse(candidate);
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
      }
    } catch {
      // 尝试下一个候选
    }
  }
  throw new Error("模型未返回可解析的 JSON");
}

function str(value: unknown, fallback: string, max: number): string {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  return text ? text.slice(0, max) : fallback;
}

function lines(value: unknown, fallback: string[], count = 3): string[] {
  const list = Array.isArray(value) ? value : [];
  const out = list
    .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    .map((item) => item.trim().slice(0, 80))
    .slice(0, count);
  while (out.length < count) {
    out.push(fallback[out.length] ?? fallback[fallback.length - 1] ?? "");
  }
  return out;
}

function stringList(
  value: unknown,
  fallback: string[],
  count: number,
  max: number,
): string[] {
  const list = Array.isArray(value) ? value : [];
  const out = list
    .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    .map((item) => item.trim().slice(0, max))
    .slice(0, count);
  while (out.length < count) {
    out.push(fallback[out.length] ?? fallback[fallback.length - 1] ?? "");
  }
  return out;
}

function normalizeFeatures(value: unknown, fallback: Feature[]): Feature[] {
  const list = Array.isArray(value) ? value : [];
  const out: Feature[] = [];
  for (const item of list) {
    const record = asRecord(item);
    const title = str(record.title, "", 20);
    if (!title) continue;
    out.push({
      title,
      desc: str(record.desc, "", 60),
      icon: str(record.icon, "sparkles", 20),
    });
    if (out.length === 3) break;
  }
  while (out.length < 3) {
    out.push(
      fallback[out.length] ?? fallback[0] ?? { title: "核心能力", desc: "", icon: "sparkles" },
    );
  }
  return out;
}

function normalizePricing(value: unknown, fallback: PricingTier[]): PricingTier[] {
  const list = Array.isArray(value) ? value : [];
  const out: PricingTier[] = [];
  for (let i = 0; i < list.length && out.length < 3; i++) {
    const base = fallback[out.length] ?? fallback[0];
    const record = asRecord(list[i]);
    const name = str(record.name, base?.name ?? "方案", 16);
    const rawPrice = str(record.price, base?.price ?? "¥0", 14);
    out.push({
      name,
      price: /^[¥￥$]/.test(rawPrice) ? rawPrice.replace("￥", "¥") : rawPrice,
      unit: str(record.unit, base?.unit ?? "", 8),
      desc: str(record.desc, base?.desc ?? "", 50),
      perks:
        Array.isArray(record.perks) && record.perks.some((p) => typeof p === "string" && p.trim())
          ? stringList(record.perks, base?.perks ?? [], 3, 16)
          : (base?.perks ?? []).slice(0, 3),
      featured: Boolean(record.featured),
    });
  }
  while (out.length < 3) {
    const base = fallback[out.length] ?? fallback[0];
    if (!base) break;
    out.push({ ...base });
  }
  let featuredSeen = false;
  return out.map((tier) => {
    if (!tier.featured || featuredSeen) return { ...tier, featured: false };
    featuredSeen = true;
    return tier;
  });
}

function normalizeSteps(value: unknown, fallback: Step[]): Step[] {
  const list = Array.isArray(value) ? value : [];
  const out: Step[] = [];
  for (const item of list) {
    const record = asRecord(item);
    const title = str(record.title, "", 20);
    if (!title) continue;
    out.push({ title, desc: str(record.desc, "", 60) });
    if (out.length === 3) break;
  }
  while (out.length < 3) {
    out.push(fallback[out.length] ?? fallback[0] ?? { title: "下一步", desc: "" });
  }
  return out;
}

function normalizeHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  const cleaned = value
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/, "");
  const lower = cleaned.toLowerCase();
  const htmlStart = lower.indexOf("<!doctype");
  const start = htmlStart >= 0 ? htmlStart : lower.indexOf("<html");
  const end = lower.lastIndexOf("</html>");
  if (start < 0 || end < 0) return "";
  const html = cleaned.slice(start, end + 7);
  if (html.length < 500 || html.length > 300_000) return "";
  return html;
}

export async function runPm(
  idea: string,
  fallback: PmResult,
  signal?: AbortSignal,
): Promise<PmResult> {
  const raw = await complete(
    [
      { role: "system", content: PM_SYSTEM },
      { role: "user", content: `创业想法：${idea}\n请直接输出 JSON。` },
    ],
    {
      model: process.env.LLM_MODEL_PM,
      json: true,
      temperature: 0.6,
      maxTokens: 2000,
      timeoutMs: 90_000,
      signal,
    },
  );
  const data = parseJson(raw);
  return {
    name: str(data.name, fallback.name, 16),
    latin: str(data.latin, fallback.latin, 24).toUpperCase(),
    tagline: str(data.tagline, fallback.tagline, 40),
    summary: str(data.summary, fallback.summary, 60),
    problem: str(data.problem, fallback.problem, 80),
    promise: str(data.promise, fallback.promise, 60),
    features: normalizeFeatures(data.features, fallback.features),
    targetUsers: stringList(data.targetUsers, fallback.targetUsers, 3, 20),
    mvpScope: str(data.mvpScope, fallback.mvpScope, 60),
    cta: str(data.cta, fallback.cta, 12),
    definitionLines: lines(data.definitionLines, fallback.definitionLines),
    designLines: lines(data.designLines, fallback.designLines),
    gtmNote: str(data.gtmNote, fallback.gtmNote, 80),
  };
}

export async function runDev(
  idea: string,
  brief: PmResult,
  fallbackLines: { build: string[]; test: string[] },
  signal?: AbortSignal,
): Promise<DevResult> {
  const raw = await complete(
    [
      { role: "system", content: DEV_SYSTEM },
      {
        role: "user",
        content: `创业想法：${idea}\n产品稿 JSON：\n${JSON.stringify(brief, null, 2)}\n请直接输出 JSON。`,
      },
    ],
    {
      model: process.env.LLM_MODEL_DEV,
      json: true,
      temperature: 0.75,
      maxTokens: 9000,
      timeoutMs: 240_000,
      signal,
    },
  );
  const data = parseJson(raw);
  const html = normalizeHtml(data.html);
  if (!html) throw new Error("研发未返回有效 HTML");
  return {
    html,
    buildLines: lines(data.buildLines, fallbackLines.build),
    testLines: lines(data.testLines, fallbackLines.test),
  };
}

export async function runOps(
  idea: string,
  brief: PmResult,
  checks: string[],
  fallbackPlan: BusinessPlan,
  fallbackLines: { review: string[]; launch: string[] },
  signal?: AbortSignal,
): Promise<OpsResult> {
  const raw = await complete(
    [
      { role: "system", content: OPS_SYSTEM },
      {
        role: "user",
        content: `创业想法：${idea}\n产品稿 JSON：\n${JSON.stringify(
          brief,
          null,
          2,
        )}\n研发自检结果：\n${checks.join("\n")}\n请直接输出 JSON。`,
      },
    ],
    {
      model: process.env.LLM_MODEL_OPS,
      json: true,
      temperature: 0.65,
      maxTokens: 3000,
      timeoutMs: 120_000,
      signal,
    },
  );
  const data = parseJson(raw);
  const planData = asRecord(data.plan);
  const plan: BusinessPlan = {
    name: brief.name,
    latin: brief.latin,
    tagline: brief.tagline,
    summary: str(planData.summary, brief.summary, 60),
    problem: str(planData.problem, brief.problem, 80),
    promise: str(planData.promise, brief.promise, 60),
    features: normalizeFeatures(planData.features, brief.features),
    pricing: normalizePricing(planData.pricing, fallbackPlan.pricing),
    targetUsers: stringList(planData.targetUsers, brief.targetUsers, 3, 20),
    seo: stringList(planData.seo, fallbackPlan.seo, 3, 16),
    coldStart: normalizeSteps(planData.coldStart, fallbackPlan.coldStart),
    stack: stringList(planData.stack, fallbackPlan.stack, 5, 20),
    mvpScope: str(planData.mvpScope, brief.mvpScope, 60),
  };
  return {
    plan,
    reviewLines: lines(data.reviewLines, fallbackLines.review),
    launchLines: lines(data.launchLines, fallbackLines.launch),
  };
}
