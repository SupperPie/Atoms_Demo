"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Layers,
  Loader2,
  MessagesSquare,
  Sparkles,
  Trash2,
  Workflow,
} from "lucide-react";

import { AGENTS, buildContext, FLOW_NODES } from "@/lib/agents";
import { EXAMPLES } from "@/lib/examples";
import { createProject, getProjects, removeProject, saveProject } from "@/lib/storage";
import type { Project } from "@/lib/types";
import { AtomsOrb } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "我想做一个可以拼货车的平台，在平台上可以发布我在哪里有闲置的货车车辆、有多少什么类型的货物需要从哪里运到哪里这样的对接信息。";

const AGENT_DOT: Record<string, string> = {
  pm: "from-violet-400 to-fuchsia-400",
  dev: "from-sky-400 to-indigo-400",
  ops: "from-teal-300 to-emerald-400",
};

const EXAMPLE_ACCENT: Record<string, string> = {
  indigo: "from-indigo-500/80 via-violet-500/50 to-cyan-400/70",
  rose: "from-rose-500/80 via-fuchsia-500/50 to-violet-400/70",
  amber: "from-amber-400/80 via-orange-500/50 to-rose-400/70",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} 小时前`;
  return `${Math.floor(hour / 24)} 天前`;
}

export function HomeView() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);
  const [starting, setStarting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setProjects(getProjects());
    setMounted(true);
  }, []);

  const start = useCallback(() => {
    const text = idea.trim();
    if (text.length < 6 || starting) return;
    const ctx = buildContext(text);
    const project = createProject(text, {
      name: ctx.name,
      latin: ctx.latin,
      tagline: ctx.tagline,
    });
    saveProject(project);
    setStarting(true);
    router.push(`/build/${project.id}`);
  }, [idea, router, starting]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      start();
    }
  };

  const openExample = (slug: string) => {
    router.push(`/mvp/${slug}`);
  };

  const deleteProject = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeProject(id);
    setProjects(getProjects());
  };

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 z-0 grid-veil" />

      <main className="relative z-10 mx-auto w-full max-w-[1460px] px-5 pb-20 pt-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_286px]">
          {/* 左栏：智能体矩阵 */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                  Agent Matrix
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-300/80">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  在线
                </span>
              </div>

              <div className="mt-4 space-y-1">
                {AGENTS.map((agent, index) => (
                  <div key={agent.id} className="relative">
                    {index < AGENTS.length - 1 && (
                      <span className="absolute left-[15px] top-[34px] h-[26px] w-px bg-gradient-to-b from-white/20 to-transparent" />
                    )}
                    <div className="group flex gap-3 rounded-xl px-1.5 py-2 transition-colors hover:bg-white/[0.04]">
                      <span className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <span
                          className={cn(
                            "size-2 rounded-full bg-gradient-to-br shadow-[0_0_10px_rgba(139,92,246,.7)]",
                            AGENT_DOT[agent.id],
                          )}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium">{agent.title}</span>
                          <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                            {agent.name}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                          {agent.focus}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-200">
                  <Workflow className="size-3.5" />
                  顺序编排 Sequential
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  PM 定义产品与 GTM → Dev 实现并自检 → Ops 读取交接物完成企划。每一步都有交付物。
                </p>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[10.5px] text-muted-foreground/80">
                <Layers className="size-3" />
                {FLOW_NODES.length} 个过程节点 · 数据写入本地存储
              </div>
            </div>
          </aside>

          {/* 中栏：输入区 */}
          <section className="min-w-0">
            <div className="flex flex-col items-center text-center">
              <div className="animate-float">
                <AtomsOrb size={88} />
              </div>
              <h1 className="mt-6 text-balance text-[30px] font-semibold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[46px]">
                <span className="text-gradient">一句话，跑出一支</span>
                <br className="sm:hidden" />
                <span className="text-gradient-violet"> AI 软件公司</span>
              </h1>
              <p className="mt-3 max-w-[520px] text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                输入一个创业想法，产品经理、研发、运营三个智能体顺次协作，
                交付一个可预览的落地页与一份商业企划。
              </p>
            </div>

            <div className="relative mt-7 rounded-3xl border border-violet-400/20 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-[1px] shadow-[0_30px_90px_-60px_rgba(124,58,237,0.9)]">
              <div className="rounded-[calc(1.5rem-1px)] bg-[#0b0a14]/85 p-4 backdrop-blur-xl sm:p-5">
                <div className="flex items-center justify-between px-1 pb-2.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground/80">
                    <Sparkles className="size-3 text-violet-300" />
                    Your idea
                  </div>
                  <span className="text-[10.5px] tabular-nums text-muted-foreground/70">
                    {idea.length} / 300
                  </span>
                </div>

                <Textarea
                  ref={textareaRef}
                  value={idea}
                  onChange={(event) => setIdea(event.target.value.slice(0, 300))}
                  onKeyDown={onKeyDown}
                  rows={5}
                  placeholder={PLACEHOLDER}
                  className="min-h-[136px] resize-none rounded-xl border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-[14px] leading-[1.75] placeholder:text-muted-foreground/55 focus-visible:border-violet-400/40 focus-visible:ring-violet-500/15"
                />

                <div className="mt-3 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-sans text-[10px]">
                      ⌘
                    </kbd>
                    <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-sans text-[10px]">
                      ↵
                    </kbd>
                    开始 · Mock 智能体，约 15 秒完成交付
                  </p>
                  <Button
                    size="lg"
                    onClick={start}
                    disabled={idea.trim().length < 6 || starting}
                    className="group w-full sm:w-auto"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        正在召集智能体
                      </>
                    ) : (
                      <>
                        Start
                        <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-9">
              <div className="flex items-end justify-between px-0.5">
                <div>
                  <h2 className="text-sm font-medium tracking-tight">或者，先玩一个示例</h2>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    三个已生成的最小可用页面，点开即可操作，右侧还能继续改。
                  </p>
                </div>
                <span className="hidden text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/60 sm:block">
                  3 MVP
                </span>
              </div>

              <div className="mt-3.5 grid gap-3 md:grid-cols-3">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.slug}
                    onClick={() => openExample(example.slug)}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-40px_rgba(124,58,237,0.8)]"
                  >
                    <span
                      className={cn(
                        "absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-70",
                        EXAMPLE_ACCENT[example.accent],
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <Badge className="border-white/10 bg-white/[0.04] text-[10px]">
                        {example.label}
                      </Badge>
                      <ArrowRight className="size-3.5 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="text-[15px] font-semibold tracking-tight">
                        {example.name}
                      </span>
                      <span className="text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/60">
                        {example.latin}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                      {example.tagline}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {example.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 移动端最近项目 */}
            {mounted && projects.length > 0 && (
              <div className="mt-8 xl:hidden">
                <ProjectList
                  projects={projects.slice(0, 4)}
                  onDelete={deleteProject}
                  compact
                />
              </div>
            )}
          </section>

          {/* 右栏：最近项目 */}
          <aside className="hidden xl:block xl:sticky xl:top-24">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                  Recent
                </span>
                <span className="text-[10.5px] text-muted-foreground/70">
                  {mounted ? `${projects.length} 个项目` : "—"}
                </span>
              </div>
              <div className="mt-3">
                {!mounted ? (
                  <div className="space-y-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-white/[0.04]"
                      />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center">
                    <MessagesSquare className="mx-auto size-4 text-muted-foreground/60" />
                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                      还没有项目
                      <br />
                      写下第一个想法试试
                    </p>
                  </div>
                ) : (
                  <ProjectList
                    projects={projects.slice(0, 5)}
                    onDelete={deleteProject}
                  />
                )}
              </div>
              <div className="mt-3 flex items-start gap-1.5 border-t border-white/[0.06] pt-3 text-[10.5px] leading-relaxed text-muted-foreground/70">
                <Check className="mt-0.5 size-3 shrink-0 text-emerald-400/70" />
                生成记录与页面编辑都保存在本地，刷新不会丢。
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ProjectList({
  projects,
  onDelete,
  compact = false,
}: {
  projects: Project[];
  onDelete: (id: string, event: React.MouseEvent) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {projects.map((project) => {
        const done = project.nodes.filter((n) => n.status === "done").length;
        return (
          <a
            key={project.id}
            href={`/build/${project.id}`}
            className="group relative block rounded-xl border border-transparent px-2.5 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[12.5px] font-medium">
                {project.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60">
                  {project.latin}
                </span>
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground/60">
                {timeAgo(project.updatedAt)}
              </span>
            </div>
            <p
              className={cn(
                "mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground/80",
                compact && "line-clamp-1",
              )}
            >
              {project.idea}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all"
                  style={{ width: `${(done / FLOW_NODES.length) * 100}%` }}
                />
              </div>
              <span className="text-[9.5px] tabular-nums text-muted-foreground/60">
                {done}/{FLOW_NODES.length}
              </span>
            </div>
            <button
              onClick={(event) => onDelete(project.id, event)}
              className="absolute right-1.5 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-md bg-[#120f1f] text-muted-foreground/60 hover:text-rose-300 group-hover:flex"
              aria-label="删除项目"
            >
              <Trash2 className="size-3" />
            </button>
          </a>
        );
      })}
    </div>
  );
}
