"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { AGENT_MAP, FLOW_NODES } from "@/lib/agents";
import type { Project, ProjectNode } from "@/lib/types";
import { cn } from "@/lib/utils";

const AGENT_TONE: Record<string, string> = {
  pm: "bg-violet-500/12 text-violet-200 border-violet-400/25",
  dev: "bg-sky-500/12 text-sky-200 border-sky-400/25",
  ops: "bg-teal-500/12 text-teal-200 border-teal-400/25",
};

function TypedLine({
  text,
  instant,
  tone,
}: {
  text: string;
  instant: boolean;
  tone: "active" | "done";
}) {
  const [count, setCount] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return;
    }
    let i = 0;
    setCount(0);
    const timer = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [text, instant]);

  return (
    <p
      className={cn(
        "text-[12px] leading-[1.75]",
        tone === "done" ? "text-muted-foreground" : "text-foreground/85",
      )}
    >
      {text.slice(0, count)}
      {count < text.length && <span className="caret" />}
    </p>
  );
}

function NodeRow({
  node,
  index,
  isLast,
  running,
}: {
  node: ProjectNode;
  index: number;
  isLast: boolean;
  running: boolean;
}) {
  const agent = AGENT_MAP[node.agent];
  const active = node.status === "active";
  const done = node.status === "done";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div ref={ref} className="relative">
      {!isLast && (
        <span
          className={cn(
            "absolute left-[17px] top-[36px] h-[calc(100%-32px)] w-px",
            done
              ? "bg-gradient-to-b from-violet-400/70 via-indigo-400/40 to-sky-400/30"
              : "bg-white/[0.08]",
          )}
        />
      )}
      <div className="flex gap-3.5">
        <div className="relative z-10 shrink-0 pt-0.5">
          <div
            className={cn(
              "relative grid size-[35px] place-items-center rounded-full border text-[11px] font-medium transition-all duration-300",
              done &&
                "border-transparent bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_0_24px_-4px_rgba(139,92,246,.75)]",
              active &&
                "border-violet-400/50 bg-violet-500/10 text-violet-200",
              !done && !active && "border-white/10 bg-white/[0.03] text-muted-foreground/60",
            )}
          >
            {active && (
              <span className="absolute inset-0 animate-pulse-ring rounded-full border border-violet-400/60" />
            )}
            {done ? (
              <Check className="size-[15px]" strokeWidth={2.6} />
            ) : active ? (
              <Loader2 className="size-[15px] animate-spin" />
            ) : (
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "min-w-0 flex-1 rounded-xl border p-3 transition-all duration-300",
            active &&
              "border-violet-400/30 bg-gradient-to-br from-violet-500/[0.1] to-transparent shadow-[0_16px_50px_-40px_rgba(139,92,246,.9)]",
            done && "border-white/[0.06] bg-white/[0.02]",
            !active && !done && "border-transparent",
          )}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3
              className={cn(
                "text-[13px] font-medium tracking-tight",
                !done && !active && "text-muted-foreground/70",
              )}
            >
              {node.title}
            </h3>
            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9.5px] tracking-wide",
                AGENT_TONE[node.agent],
                !done && !active && "opacity-60",
              )}
            >
              {agent.title} · {agent.name}
            </span>
            {active && (
              <span className="flex items-center gap-1 text-[9.5px] text-violet-300">
                <span className="size-1.5 animate-pulse rounded-full bg-violet-300" />
                进行中
              </span>
            )}
            {done && (
              <span className="text-[9.5px] text-emerald-300/80">
                {index + 1}/{FLOW_NODES.length} 已交付
              </span>
            )}
            {!active && !done && (
              <span className="text-[9.5px] text-muted-foreground/40">等待上一个交付物</span>
            )}
          </div>

          <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground/60">
            {node.status === "pending" ? FLOW_NODES[index]?.brief : node.status === "active" ? FLOW_NODES[index]?.brief : "交付物已归档"}
          </p>

          {(active || done) && (
            <div className="mt-2.5 space-y-1.5 border-t border-white/[0.05] pt-2.5">
              {node.lines.map((line, i) => (
                <TypedLine
                  key={`${node.id}-${i}-${line.slice(0, 8)}`}
                  text={line}
                  instant={done || !running}
                  tone={done ? "done" : "active"}
                />
              ))}
              {active && node.lines.length === 0 && (
                <p className="text-[11px] text-muted-foreground/50">正在读取交接物…</p>
              )}
            </div>
          )}

          {done && node.detail && (
            <div className="mt-2 flex items-start gap-1.5 text-[10.5px] text-emerald-300/75">
              <Check className="mt-0.5 size-3 shrink-0" />
              <span>{node.detail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgentFlow({ project, running }: { project: Project; running: boolean }) {
  const nodes: ProjectNode[] = project.nodes.length
    ? project.nodes
    : FLOW_NODES.map((n) => ({
        id: n.id,
        title: n.title,
        agent: n.agent,
        status: "pending" as const,
        lines: [],
      }));

  const doneCount = nodes.filter((n) => n.status === "done").length;
  const progress = Math.round((doneCount / FLOW_NODES.length) * 100);

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0a0912]/70 p-4 backdrop-blur-xl sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-1.5 rounded-full",
              running ? "animate-pulse bg-violet-400" : project.status === "done" ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
          <h2 className="text-[13px] font-medium tracking-tight">智能体协作流</h2>
          <span className="text-[10.5px] text-muted-foreground/60">
            Product → Build → Launch
          </span>
        </div>
        <span className="text-[10.5px] tabular-nums text-muted-foreground/70">
          {doneCount} / {FLOW_NODES.length} 节点
        </span>
      </div>

      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400 transition-all duration-500"
          style={{ width: `${Math.max(progress, running ? 4 : 0)}%` }}
        />
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Idea
        </p>
        <p className="mt-1.5 line-clamp-3 text-[11.5px] leading-relaxed text-muted-foreground">
          {project.idea}
        </p>
      </div>

      <div className="mt-4 space-y-2.5">
        {nodes.map((node, index) => (
          <NodeRow
            key={node.id}
            node={node}
            index={index}
            isLast={index === nodes.length - 1}
            running={running}
          />
        ))}
      </div>
    </section>
  );
}
