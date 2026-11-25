import type { AgentEvent } from "@/lib/types";
import {
  buildBusinessPlan,
  buildContext,
  FLOW_NODES,
  nodeLines,
} from "@/lib/agents";
import { buildLandingHtml } from "@/lib/landing";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface GenerateOptions {
  resumeFrom?: number;
  speed?: number;
}

/**
 * 数据层入口：mock 版本的 async generate(idea)。
 * 未来替换为真实模型时，保持事件协议不变即可直接接入。
 *
 * 编排顺序：PM（定义 + 设计）→ Dev（实现 + 自检）→ Ops（效果检查 + 部署）
 * PM 产出的 GTM 简报会作为上下文交给 Ops，体现智能体之间的交接依赖。
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

  const ctx = buildContext(idea);
  const plan = buildBusinessPlan(ctx);
  const landingHtml = buildLandingHtml(ctx);
  const kb = Math.max(1, Math.round(landingHtml.length / 1024));
  const speed = options.speed ?? 1;

  yield {
    type: "meta",
    name: ctx.name,
    latin: ctx.latin,
    tagline: ctx.tagline,
  };

  const resumeFrom = Math.max(0, Math.min(options.resumeFrom ?? 0, FLOW_NODES.length));

  for (let i = resumeFrom; i < FLOW_NODES.length; i++) {
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
