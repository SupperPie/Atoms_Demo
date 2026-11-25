"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Check,
  Clock3,
  Database,
  Handshake,
  Home,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AGENTS, FLOW_NODES } from "@/lib/agents";
import { getProject, saveProject } from "@/lib/storage";
import type { AgentEvent, Project, ProjectNode } from "@/lib/types";
import { AtomsOrb } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentFlow } from "@/components/workspace/agent-flow";
import { OutputPanel } from "@/components/workspace/output-panel";
import { cn } from "@/lib/utils";

function emptyNodes(): ProjectNode[] {
  return FLOW_NODES.map((node) => ({
    id: node.id,
    title: node.title,
    agent: node.agent,
    status: "pending" as const,
    lines: [],
  }));
}

function normalize(project: Project): Project {
  return {
    ...project,
    nodes: FLOW_NODES.map((flow) => {
      const saved = project.nodes.find((n) => n.id === flow.id);
      return (
        saved ?? {
          id: flow.id,
          title: flow.title,
          agent: flow.agent,
          status: "pending" as const,
          lines: [],
        }
      );
    }),
  };
}

const AGENT_TONE: Record<string, string> = {
  pm: "text-violet-300",
  dev: "text-sky-300",
  ops: "text-teal-300",
};

export function Workspace({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<"loading" | "missing" | "ready">("loading");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<"flow" | "output">("flow");

  const projectRef = useRef<Project | null>(null);
  const runLock = useRef(false);
  const started = useRef(false);
  const alive = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  const commit = useCallback((updater: (current: Project) => Project) => {
    const current = projectRef.current;
    if (!current) return;
    const next = updater(current);
    projectRef.current = next;
    if (!alive.current) return;
    setProject(next);
    saveProject(next);
  }, []);

  const handleEvent = useCallback(
    (event: AgentEvent) => {
      switch (event.type) {
        case "meta":
          commit((current) => ({
            ...current,
            name: event.name ?? current.name,
            latin: event.latin ?? current.latin,
            tagline: event.tagline ?? current.tagline,
          }));
          break;
        case "node:start":
          commit((current) => ({
            ...current,
            status: "running",
            nodes: current.nodes.map((node, index) =>
              index === event.index
                ? { ...node, status: "active", lines: [], detail: undefined }
                : node,
            ),
          }));
          break;
        case "node:line":
          commit((current) => ({
            ...current,
            nodes: current.nodes.map((node, index) =>
              index === event.index && event.line
                ? { ...node, lines: [...node.lines, event.line] }
                : node,
            ),
          }));
          break;
        case "node:done":
          commit((current) => ({
            ...current,
            nodes: current.nodes.map((node, index) =>
              index === event.index
                ? { ...node, status: "done", detail: event.detail }
                : node,
            ),
          }));
          break;
        case "artifact":
          if (event.artifact) {
            commit((current) => ({
              ...current,
              status: "done",
              artifact: event.artifact,
              nodes: current.nodes.map((node) => ({ ...node, status: "done" })),
            }));
          }
          break;
        case "done":
          if (alive.current) setRunning(false);
          break;
        case "error":
          if (alive.current) {
            setError(event.message ?? "生成失败，请重试。");
            setRunning(false);
          }
          commit((current) => ({ ...current, status: "error" }));
          break;
      }
    },
    [commit],
  );

  const run = useCallback(
    async (from: number) => {
      if (runLock.current || !alive.current) return;
      const base = projectRef.current;
      if (!base) return;

      runLock.current = true;
      if (alive.current) {
        setRunning(true);
        setError(null);
      }
      commit((current) => ({
        ...current,
        status: "running",
        nodes: current.nodes.map((node, index) =>
          index >= from ? { ...node, status: "pending", lines: [], detail: undefined } : node,
        ),
      }));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: base.idea, resumeFrom: from }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";
          for (const chunk of chunks) {
            const dataLine = chunk
              .split("\n")
              .find((line) => line.startsWith("data:"));
            if (!dataLine) continue;
            const payload = dataLine.slice(5).trim();
            if (!payload) continue;
            try {
              handleEvent(JSON.parse(payload) as AgentEvent);
            } catch {
              // 忽略不完整事件帧
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (alive.current) {
          setError("流水线中断了，保留已完成节点，可从断点继续。");
          setRunning(false);
        }
        commit((current) => ({ ...current, status: "error" }));
      } finally {
        runLock.current = false;
        if (alive.current) setRunning(false);
      }
    },
    [commit, handleEvent],
  );

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      abortRef.current?.abort();
    };
  }, [id]);

  useEffect(() => {
    const found = getProject(id);
    if (!found) {
      setStatus("missing");
      return;
    }
    const normalized = normalize(found);
    projectRef.current = normalized;
    setProject(normalized);
    setStatus("ready");

    if (normalized.status !== "done" && !started.current) {
      started.current = true;
      const from = normalized.nodes.findIndex((node) => node.status !== "done");
      window.setTimeout(() => {
        void run(from < 0 ? 0 : from);
      }, 300);
    }
  }, [id, run]);

  const rerun = () => {
    if (running) return;
    setError(null);
    commit((current) => ({
      ...current,
      status: "running",
      artifact: undefined,
      nodes: emptyNodes(),
    }));
    started.current = true;
    void run(0);
  };

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3">
          <AtomsOrb size={64} />
          <p className="text-[12px] text-muted-foreground">正在恢复本地项目…</p>
        </div>
      </div>
    );
  }

  if (status === "missing" || !project) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="glass w-full max-w-sm rounded-2xl p-6 text-center">
          <AlertTriangle className="mx-auto size-6 text-amber-300/80" />
          <h1 className="mt-3 text-base font-medium">这个项目不在本地</h1>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
            演示数据保存在浏览器本地存储里，换设备或清理缓存后会丢失。
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/">
              <Home />
              回到首页新建
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const doneCount = project.nodes.filter((node) => node.status === "done").length;
  const activeIndex = project.nodes.findIndex((node) => node.status === "active");
  const activeNode = activeIndex >= 0 ? project.nodes[activeIndex] : null;
  const statusLabel =
    project.status === "done" ? "已交付" : project.status === "error" ? "已中断" : "生成中";

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 grid-veil" />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05060b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] w-full max-w-[1560px] items-center gap-3 px-4 lg:px-6">
          <Link
            href="/"
            className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
            aria-label="返回首页"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden items-center gap-2.5 border-l border-white/[0.08] pl-3 sm:flex">
            <AtomsOrb size={26} />
            <div className="leading-tight">
              <p className="text-[13px] font-medium tracking-tight">
                {project.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {project.latin}
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground/70">{project.tagline}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px]",
                project.status === "done" &&
                  "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
                project.status === "error" &&
                  "border-amber-400/25 bg-amber-500/10 text-amber-200",
                project.status === "running" &&
                  "border-violet-400/25 bg-violet-500/10 text-violet-200",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  running
                    ? "animate-pulse bg-violet-300"
                    : project.status === "done"
                      ? "bg-emerald-400"
                      : "bg-amber-400",
                )}
              />
              {statusLabel} {doneCount}/{FLOW_NODES.length}
            </span>
            <Button variant="secondary" size="sm" onClick={rerun} disabled={running}>
              <RotateCcw className={cn("size-3.5", running && "animate-spin")} />
              <span className="hidden sm:inline">重跑</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1560px] px-4 pb-8 pt-4 lg:px-6">
        <div className="mb-3 flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1 lg:hidden">
          {(
            [
              { key: "flow", label: "协作流", icon: Sparkles },
              { key: "output", label: "产出", icon: ShieldCheck },
            ] as const
          ).map((pane) => (
            <button
              key={pane.key}
              onClick={() => setMobilePane(pane.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11.5px] transition-colors",
                mobilePane === pane.key
                  ? "bg-gradient-to-r from-violet-600/80 to-indigo-500/80 text-white"
                  : "text-muted-foreground",
              )}
            >
              <pane.icon className="size-3.5" />
              {pane.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:grid-cols-[248px_minmax(0,1fr)_minmax(0,560px)]">
          {/* 左栏：项目上下文与交接 */}
          <aside className="hidden xl:block">
            <div className="glass sticky top-[76px] space-y-3 rounded-2xl p-4">
              <div>
                <p className="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  Project
                </p>
                <h2 className="mt-1.5 text-[17px] font-semibold tracking-tight">
                  {project.name}
                </h2>
                <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground">
                  {project.tagline}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/50">
                  想法原文
                </p>
                <p className="mt-1.5 max-h-[132px] overflow-y-auto text-[10.5px] leading-relaxed text-muted-foreground thin-scrollbar">
                  {project.idea}
                </p>
              </div>

              <div>
                <p className="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  Handoffs
                </p>
                <div className="mt-2 space-y-2">
                  {AGENTS.map((agent) => {
                    const nodes = project.nodes.filter((node) => node.agent === agent.id);
                    const isActive = nodes.some((node) => node.status === "active");
                    const isDone = nodes.length > 0 && nodes.every((node) => node.status === "done");
                    return (
                      <div key={agent.id} className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-1 grid size-4 shrink-0 place-items-center rounded-full border",
                            isDone
                              ? "border-transparent bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                              : isActive
                                ? "border-violet-400/50 bg-violet-500/10"
                                : "border-white/10 bg-white/[0.03]",
                          )}
                        >
                          {isDone ? (
                            <Check className="size-2.5" />
                          ) : isActive ? (
                            <Loader2 className="size-2.5 animate-spin text-violet-200" />
                          ) : (
                            <span className="size-1 rounded-full bg-white/30" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px]">
                            <span className={cn("font-medium", AGENT_TONE[agent.id])}>
                              {agent.title}
                            </span>
                            <span className="ml-1 text-[9.5px] text-muted-foreground/50">
                              {isDone ? "已交付" : isActive ? "执行中" : "待命"}
                            </span>
                          </p>
                          <p className="text-[9.5px] leading-relaxed text-muted-foreground/60">
                            {agent.focus}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {project.artifact && (
                <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <p className="flex items-center gap-1 text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">
                    <Handshake className="size-3" />
                    交接记录
                  </p>
                  {project.artifact.handoffs.map((handoff) => (
                    <p key={handoff.note} className="text-[9.5px] leading-relaxed text-muted-foreground/75">
                      {handoff.from.toUpperCase()} → {handoff.to.toUpperCase()} · {handoff.note}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-1.5 border-t border-white/[0.06] pt-2.5 text-[9.5px] leading-relaxed text-muted-foreground/60">
                <Database className="mt-0.5 size-3 shrink-0" />
                全过程写入浏览器本地存储，刷新后自动从断点续跑。
              </div>
            </div>
          </aside>

          {/* 中栏：协作流 */}
          <div className={cn("min-w-0 space-y-3", mobilePane === "output" && "hidden lg:block")}>
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-500/[0.08] p-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] text-amber-100">{error}</p>
                  <button
                    onClick={() => {
                      const from = project.nodes.findIndex((node) => node.status !== "done");
                      void run(from < 0 ? 0 : from);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-amber-200 underline-offset-2 hover:underline"
                  >
                    从断点继续
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            )}

            <AgentFlow project={project} running={running} />

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10.5px] text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3" />
                创建于{" "}
                {new Date(project.createdAt).toLocaleString("zh-CN", {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Badge className="border-white/10 bg-white/[0.04] px-1.5 py-0 text-[9px]">
                  mock
                </Badge>
                顺序编排 · 可替换真实 LLM
              </span>
            </div>

            {project.status === "done" && (
              <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-3 sm:flex-row sm:items-center">
                <p className="text-[11.5px] text-violet-100/90">
                  交付完成：可预览页面 + 商业企划已就绪，可继续在右侧查看。
                </p>
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => setMobilePane("output")}
                >
                  查看产出
                  <ArrowRight />
                </Button>
              </div>
            )}
          </div>

          {/* 右栏：产出 */}
          <div
            className={cn(
              "min-w-0",
              mobilePane === "flow" && "hidden lg:block",
            )}
          >
            <OutputPanel project={project} running={running} />
          </div>
        </div>
      </main>
    </div>
  );
}
