"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  History,
  Loader2,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";

import { buildContext } from "@/lib/agents";
import type { ExampleCase } from "@/lib/examples";
import { createProject, getDraft, saveDraft, saveProject } from "@/lib/storage";
import type { MvpDraft, MvpPatch } from "@/lib/types";
import { AtomsOrb } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CargoMvp } from "@/components/mvp/cargo";
import { InterviewMvp } from "@/components/mvp/interview";
import { PetcareMvp } from "@/components/mvp/petcare";
import { cn } from "@/lib/utils";

const TEMPLATES: Record<string, React.ComponentType<{ patch: MvpPatch }>> = {
  cargo: CargoMvp,
  interview: InterviewMvp,
  petcare: PetcareMvp,
};

export function MvpStudio({ example }: { example: ExampleCase }) {
  const router = useRouter();
  const [patch, setPatch] = useState<MvpPatch>({});
  const [log, setLog] = useState<MvpDraft["log"]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [launching, setLaunching] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const draft = getDraft(example.slug);
    if (draft) {
      setPatch(draft.patch ?? {});
      setLog(draft.log ?? []);
    }
    setMounted(true);
  }, [example.slug]);

  const Template = TEMPLATES[example.slug] ?? CargoMvp;

  const apply = async (raw?: string) => {
    const content = (raw ?? message).trim();
    if (!content || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: example.slug, message: content, patch }),
      });
      if (!response.ok) throw new Error("bad response");
      const data = (await response.json()) as {
        patch: MvpPatch;
        reply: string;
        changes: string[];
        at?: number;
      };
      const entry = {
        id: `${Date.now()}`,
        prompt: content,
        reply: data.reply,
        changes: data.changes ?? [],
        at: data.at ?? Date.now(),
      };
      const nextPatch = data.patch ?? patch;
      const nextLog = [entry, ...log].slice(0, 8);
      setPatch(nextPatch);
      setLog(nextLog);
      saveDraft({
        slug: example.slug,
        patch: nextPatch,
        log: nextLog,
        updatedAt: Date.now(),
      });
      setMessage("");
      previewRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("研发 Agent 暂时没有响应，请再试一次。");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setPatch({});
    setLog([]);
    setMessage("");
    saveDraft({ slug: example.slug, patch: {}, log: [], updatedAt: Date.now() });
  };

  const launchCompany = () => {
    if (launching) return;
    const ctx = buildContext(example.idea);
    const project = createProject(example.idea, {
      name: ctx.name,
      latin: ctx.latin,
      tagline: ctx.tagline,
    });
    saveProject(project);
    setLaunching(true);
    router.push(`/build/${project.id}`);
  };

  const latest = log[0];

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0 grid-veil" />

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05060b]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1560px] items-center gap-3 px-4 lg:px-6">
          <Link
            href="/"
            className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
            aria-label="返回首页"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-center gap-2.5 border-l border-white/[0.08] pl-3">
            <AtomsOrb size={26} />
            <div className="leading-tight">
              <p className="text-[13px] font-medium tracking-tight">
                {example.name}
                <span className="ml-1.5 text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {example.latin}
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground/70">已生成的 MVP · 可继续二次加工</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="hidden border-white/10 bg-white/[0.04] text-[10px] text-muted-foreground sm:inline-flex">
              {example.label}
            </Badge>
            <Button size="sm" onClick={launchCompany} disabled={launching} className="gap-1.5">
              {launching ? <Loader2 className="animate-spin" /> : <Sparkles />}
              <span className="hidden sm:inline">{launching ? "正在启动" : "用它启动 AI 公司"}</span>
              <span className="sm:hidden">启动</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1560px] px-4 pb-10 pt-4 lg:px-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_404px]">
          <section className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#0a0912]/70 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-2 pb-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
                <span className="size-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <div className="mx-auto hidden items-center gap-1.5 rounded-md border border-white/[0.06] bg-black/30 px-3 py-1 text-[10px] text-muted-foreground/60 sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-400/80" />
                atoms-mini.app / {example.slug}
              </div>
              <span className="ml-auto flex items-center gap-1 text-[9.5px] text-muted-foreground/50 sm:ml-0">
                <ArrowUpRight className="size-3" />
                可交互示例
              </span>
            </div>

            <div
              ref={previewRef}
              className="h-[64vh] overflow-y-auto rounded-xl border border-white/[0.07] bg-[#06070e] thin-scrollbar lg:h-[calc(100vh-158px)]"
            >
              <Template patch={patch} />
            </div>
          </section>

          <aside className="min-w-0">
            <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#0a0912]/80 backdrop-blur-xl lg:sticky lg:top-[76px] lg:max-h-[calc(100vh-92px)]">
              <div className="border-b border-white/[0.06] p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Wand2 className="size-3.5 text-violet-300" />
                    <h2 className="text-[13px] font-medium tracking-tight">二次加工</h2>
                  </div>
                  <span className="flex items-center gap-1 rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-0.5 text-[9.5px] text-violet-200">
                    <span className={cn("size-1.5 rounded-full bg-violet-300", busy && "animate-pulse")} />
                    Nova · 研发
                  </span>
                </div>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted-foreground">
                  把当前页面当作模版，用一句话描述想改什么，智能体会直接改在这版页面上。
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3.5 thin-scrollbar">
                <div className="flex flex-wrap gap-1.5">
                  {example.editorHints.map((hint) => (
                    <button
                      key={hint}
                      onClick={() => {
                        setMessage(hint);
                        textareaRef.current?.focus();
                      }}
                      className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[10px] text-muted-foreground transition-colors hover:border-violet-400/30 hover:text-foreground"
                    >
                      {hint}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                        event.preventDefault();
                        void apply();
                      }
                    }}
                    rows={3}
                    placeholder="例如：换成青蓝色主色，主标题改成「顺路就能把货带走」，再加一个用户评价区。"
                    className="w-full resize-none bg-transparent px-2 py-1.5 text-[11.5px] leading-relaxed text-foreground/85 outline-none placeholder:text-muted-foreground/50"
                  />
                  <div className="flex items-center justify-between gap-2 px-1 pb-0.5">
                    <span className="text-[9px] text-muted-foreground/50">⌘ + ↵ 应用</span>
                    <Button size="sm" onClick={() => void apply()} disabled={busy || !message.trim()}>
                      {busy ? <Loader2 className="animate-spin" /> : <Wand2 />}
                      {busy ? "改写中" : "应用修改"}
                    </Button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg border border-rose-400/20 bg-rose-500/[0.08] px-2.5 py-2 text-[10.5px] text-rose-200">
                    {error}
                  </p>
                )}

                {busy && (
                  <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-2.5">
                    <p className="flex items-center gap-1.5 text-[10.5px] text-violet-200">
                      <Sparkles className="size-3 animate-pulse" />
                      正在读取指令并重写页面…
                    </p>
                    <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                    </div>
                  </div>
                )}

                {latest && !busy && (
                  <div className="animate-fade-up rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                        Agent Reply
                      </span>
                      <span className="text-[9px] text-muted-foreground/40">
                        {new Date(latest.at).toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 rounded-md bg-black/25 px-2 py-1 text-[10px] text-muted-foreground/70">
                      “{latest.prompt}”
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-foreground/80">{latest.reply}</p>
                    {latest.changes.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {latest.changes.map((change) => (
                          <p
                            key={change}
                            className="flex items-start gap-1.5 text-[10px] text-emerald-300/80"
                          >
                            <Check className="mt-0.5 size-3 shrink-0" />
                            {change}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!latest && !busy && (
                  <div className="rounded-xl border border-dashed border-white/[0.09] px-3 py-4 text-center">
                    <Wand2 className="mx-auto size-4 text-muted-foreground/50" />
                    <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted-foreground/70">
                      试一试「整体更极简」「换成暖橙色」
                      <br />
                      「增加常见问题区」
                    </p>
                  </div>
                )}

                {log.length > 1 && (
                  <div>
                    <div className="mb-1.5 flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                      <History className="size-3" />
                      历史版本 {log.length}
                    </div>
                    <div className="space-y-1">
                      {log.slice(1).map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-lg border border-white/[0.05] bg-white/[0.015] px-2.5 py-1.5"
                        >
                          <p className="line-clamp-1 text-[10px] text-muted-foreground/70">
                            {entry.prompt}
                          </p>
                          <p className="mt-0.5 line-clamp-1 text-[9.5px] text-muted-foreground/40">
                            {entry.reply}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] p-3">
                <span className="flex items-center gap-1.5 text-[9.5px] text-muted-foreground/55">
                  <Check className="size-3 text-emerald-400/70" />
                  {mounted ? "编辑记录已保存到本地" : "读取本地记录…"}
                </span>
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[9.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="size-2.5" />
                  恢复初始
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/50">
                下一步
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted-foreground/75">
                满意这一版后，可以让三个智能体基于这个想法完整跑一遍：产品定义、实现、商业企划。
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2 w-full gap-1.5"
                onClick={launchCompany}
                disabled={launching}
              >
                启动完整流水线
                <ArrowRight />
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
