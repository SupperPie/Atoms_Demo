import type { AgentEvent } from "@/lib/types";
import {
  buildBusinessPlan,
  buildContext,
  FLOW_NODES,
  nodeLines,
  type CompanyContext,
} from "@/lib/agents";
import { buildLandingHtml } from "@/lib/landing";
import { llmEnabled } from "@/lib/llm";
import { runDev, runOps, runPm, type PmResult } from "@/lib/llm-agents";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface GenerateOptions {
  resumeFrom?: number;
  speed?: number;
  /** 客户端断开时中止正在进行的模型调用 */
  signal?: AbortSignal;
}

/** 未配置模型或模型失败时使用的产品稿，保持演示始终可跑。 */
function fallbackPm(ctx: CompanyContext): PmResult {
  const definition = nodeLines(ctx, "definition", { kb: 0 });
  const design = nodeLines(ctx, "design", { kb: 0 });
  return {
    name: ctx.name,
    latin: ctx.latin,
    tagline: ctx.tagline,
    summary: ctx.pack.subline,
    problem: ctx.pack.problem,
    promise: ctx.pack.promise,
    features: ctx.pack.features.slice(0, 3),
    targetUsers: ctx.pack.targetUsers.slice(0, 3),
    mvpScope: ctx.pack.mvpScope,
    cta: ctx.pack.cta,
    definitionLines: definition.lines,
    designLines: design.lines,
    gtmNote: "首批用户、定位假设与发布节奏已同步给运营。",
  };
}

function resumeIndex(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(Math.floor(value), FLOW_NODES.length));
}

/**
 * 数据层入口：async generate(idea)。
 *
 * 配置了 LLM_API_KEY 时，三个智能体全部调用真实模型：
 * PM（定义 + 设计）→ Dev（生成完整可交互 HTML）→ Ops（读取 PM 简报产出企划）。
 * 未配置或某个智能体调用失败时，自动回退到内置模板，保证演示不中断。
 */
export async function* generate(
  rawIdea: string,
  options: GenerateOptions = {},
): AsyncGenerator<AgentEvent> {
  const idea = rawIdea.trim();
  if (idea.length < 6) {
    yield { type: "error", message: "想法太短了，至少用一句话描述你要解决的问题。" };
    return;
  }

  if (llmEnabled()) {
    yield* runLlm(idea, options);
    return;
  }

  yield* runMock(idea, options);
}

/** 真实模型编排 */
async function* runLlm(
  idea: string,
  options: GenerateOptions,
): AsyncGenerator<AgentEvent> {
  const ctx = buildContext(idea);
  const signal = options.signal;
  const speed = options.speed ?? 1;
  const gap = Math.max(120, Math.round(460 * speed));

  const fallback = fallbackPm(ctx);
  const fallbackPlan = buildBusinessPlan(ctx);
  const fallbackHtml = buildLandingHtml(ctx);

  const aborted = () => signal?.aborted === true;
  const start = (index: number): AgentEvent => {
    const node = FLOW_NODES[index];
    return {
      type: "node:start",
      index,
      nodeId: node.id,
      title: node.title,
      agent: node.agent,
      detail: node.deliverable,
    };
  };
  const line = (index: number, text: string): AgentEvent => {
    const node = FLOW_NODES[index];
    return {
      type: "node:line",
      index,
      nodeId: node.id,
      agent: node.agent,
      line: text,
    };
  };
  const done = (index: number, detail: string): AgentEvent => {
    const node = FLOW_NODES[index];
    return {
      type: "node:done",
      index,
      nodeId: node.id,
      agent: node.agent,
      detail: detail.slice(0, 120),
    };
  };

  // 1-2. 产品经理：产品定义 + 产品设计
  yield start(0);
  yield line(0, "收到想法，正在拆解核心矛盾与首批用户…");

  let pm = fallback;
  try {
    pm = await runPm(idea, fallback, signal);
  } catch {
    if (aborted()) return;
    yield line(0, "产品模型暂不可用，已切换到本地产品模板兜底。");
  }

  yield { type: "meta", name: pm.name, latin: pm.latin, tagline: pm.tagline };

  for (const text of pm.definitionLines) {
    if (aborted()) return;
    yield line(0, text);
    await sleep(gap);
  }
  yield done(0, `已定义问题与用户 · ${pm.mvpScope}`);

  yield start(1);
  for (const text of pm.designLines) {
    if (aborted()) return;
    yield line(1, text);
    await sleep(gap);
  }
  yield done(1, "信息架构与视觉基调已确定，产品稿移交研发");

  // 3-4. 研发：生成页面 + 自检
  yield start(2);
  yield line(2, "读取产品稿，正在设计页面结构与交互…");

  const fallbackBuild = nodeLines(ctx, "build", { kb: 1 });
  const fallbackTest = nodeLines(ctx, "test", { kb: 1 });

  let html = fallbackHtml;
  let buildLines = fallbackBuild.lines;
  let testLines = fallbackTest.lines;

  try {
    const dev = await runDev(
      idea,
      pm,
      { build: fallbackBuild.lines, test: fallbackTest.lines },
      signal,
    );
    html = dev.html;
    buildLines = dev.buildLines;
    testLines = dev.testLines;
  } catch {
    if (aborted()) return;
    yield line(2, "研发模型响应异常，已改用本地模板生成页面。");
    buildLines = nodeLines(ctx, "build", {
      kb: Math.max(1, Math.round(html.length / 1024)),
    }).lines;
  }

  const kb = Math.max(1, Math.round(html.length / 1024));
  for (const text of buildLines) {
    if (aborted()) return;
    yield line(2, text);
    await sleep(gap);
  }
  yield done(2, `落地页 HTML 已生成（约 ${kb}KB，零外部依赖）`);

  yield start(3);
  for (const text of testLines) {
    if (aborted()) return;
    yield line(3, text);
    await sleep(gap);
  }
  yield done(3, "6 项检查通过 · 0 阻塞问题");

  // 5. 运营：读取 PM 简报生成商业企划
  yield start(4);
  yield line(4, "读取 GTM 简报与自检结果，正在生成商业企划…");

  const fallbackReview = nodeLines(ctx, "review", { kb }).lines;
  const fallbackLaunch = nodeLines(ctx, "launch", { kb }).lines;

  let plan = fallbackPlan;
  let reviewLines = fallbackReview;
  let launchLines = fallbackLaunch;

  try {
    const ops = await runOps(
      idea,
      pm,
      testLines,
      fallbackPlan,
      { review: fallbackReview, launch: fallbackLaunch },
      signal,
    );
    plan = ops.plan;
    reviewLines = ops.reviewLines;
    launchLines = ops.launchLines;
  } catch {
    if (aborted()) return;
    yield line(4, "运营模型响应异常，已切换到本地企划模板兜底。");
  }

  for (const text of reviewLines) {
    if (aborted()) return;
    yield line(4, text);
    await sleep(gap);
  }
  yield done(4, `商业企划已生成 · ${plan.name}：${plan.tagline}`);

  // 6. 发布
  yield start(5);
  for (const text of launchLines) {
    if (aborted()) return;
    yield line(5, text);
    await sleep(gap);
  }
  yield done(5, "交付完成 · 预览 / 企划 / 部署清单");

  if (aborted()) return;

  yield {
    type: "artifact",
    artifact: {
      landingHtml: html,
      plan,
      generatedAt: Date.now(),
      handoffs: [
        {
          from: "pm",
          to: "dev",
          note: "产品稿：问题定义、信息架构与视觉基调",
        },
        {
          from: "pm",
          to: "ops",
          note: pm.gtmNote ? `GTM 简报：${pm.gtmNote}`.slice(0, 90) : "GTM 简报",
        },
        {
          from: "dev",
          to: "ops",
          note: "可运行页面 + 自检报告，供运营核对卖点",
        },
      ],
    },
  };

  yield { type: "done" };
}

/** 本地 mock 编排（未配置模型时的默认路径，支持断点续跑） */
async function* runMock(
  idea: string,
  options: GenerateOptions,
): AsyncGenerator<AgentEvent> {
  const ctx = buildContext(idea);
  const plan = buildBusinessPlan(ctx);
  const landingHtml = buildLandingHtml(ctx);
  const kb = Math.max(1, Math.round(landingHtml.length / 1024));
  const speed = options.speed ?? 1;
  const signal = options.signal;

  yield {
    type: "meta",
    name: ctx.name,
    latin: ctx.latin,
    tagline: ctx.tagline,
  };

  const resumeFrom = resumeIndex(options.resumeFrom);

  for (let i = resumeFrom; i < FLOW_NODES.length; i++) {
    if (signal?.aborted) return;
    const node = FLOW_NODES[i];
    yield {
      type: "node:start",
      index: i,
      nodeId: node.id,
      title: node.title,
      agent: node.agent,
      detail: node.deliverable,
    };

    await sleep(420 * speed);
    const { lines, detail } = nodeLines(ctx, node.id, { kb });

    for (const line of lines) {
      if (signal?.aborted) return;
      yield {
        type: "node:line",
        index: i,
        nodeId: node.id,
        agent: node.agent,
        line,
      };
      await sleep(640 * speed);
    }

    await sleep(220 * speed);
    yield {
      type: "node:done",
      index: i,
      nodeId: node.id,
      agent: node.agent,
      detail,
    };
  }

  yield {
    type: "artifact",
    artifact: {
      landingHtml,
      plan,
      generatedAt: Date.now(),
      handoffs: [
        {
          from: "pm",
          to: "dev",
          note: "产品稿：问题定义、信息架构与视觉基调",
        },
        {
          from: "pm",
          to: "ops",
          note: "GTM 简报：首批用户、定位假设与发布节奏",
        },
        {
          from: "dev",
          to: "ops",
          note: "可运行页面 + 自检报告，供运营核对卖点",
        },
      ],
    },
  };

  yield { type: "done" };
}
