"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Calendar,
  ChartNoAxesColumn,
  Check,
  Clock,
  Copy,
  FileText,
  Hash,
  Heart,
  Layers,
  Map as MapIcon,
  Mic,
  Monitor,
  Package,
  RefreshCw,
  Route,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { AtomsOrb } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusinessPlan, Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  route: Route,
  layers: Layers,
  shield: Shield,
  target: Target,
  mic: Mic,
  chart: ChartNoAxesColumn,
  map: MapIcon,
  bell: Bell,
  calendar: Calendar,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
  search: Search,
  wallet: Wallet,
  clock: Clock,
  zap: Zap,
  package: Package,
};

function planToMarkdown(plan: BusinessPlan): string {
  const lines: string[] = [
    `# ${plan.name} ${plan.latin}`,
    "",
    `> ${plan.tagline}`,
    "",
    plan.summary,
    "",
    `## 问题\n${plan.problem}`,
    "",
    `## 承诺\n${plan.promise}`,
    "",
    "## 核心功能",
    ...plan.features.map((f, i) => `${i + 1}. ${f.title}：${f.desc}`),
    "",
    "## 定价",
    ...plan.pricing.map((t) => `- ${t.name} ${t.price}${t.unit}：${t.desc}（${t.perks.join("、")}）`),
    "",
    `## 目标用户\n${plan.targetUsers.join("、")}`,
    "",
    `## SEO 关键词\n${plan.seo.join("、")}`,
    "",
    "## 冷启动三步",
    ...plan.coldStart.map((s, i) => `${i + 1}. ${s.title}：${s.desc}`),
    "",
    `## 技术栈\n${plan.stack.join("、")}`,
  ];
  return lines.join("\n");
}

export function OutputPanel({
  project,
  running,
}: {
  project: Project;
  running: boolean;
}) {
  const [tab, setTab] = useState<"preview" | "plan">("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const artifact = project.artifact;
  const plan = artifact?.plan;

  const activeIndex = project.nodes.findIndex((n) => n.status === "active");
  const activeNode = activeIndex >= 0 ? project.nodes[activeIndex] : null;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyPlan = async () => {
    if (!plan) return;
    try {
      await navigator.clipboard.writeText(planToMarkdown(plan));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const openStandalone = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.landingHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-white/[0.07] bg-[#0a0912]/70 backdrop-blur-xl lg:sticky lg:top-[76px] lg:h-[calc(100vh-96px)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] p-3">
        <Tabs value={tab} onValueChange={(value) => setTab(value as "preview" | "plan")}>
          <TabsList className="h-9">
            <TabsTrigger value="preview" className="gap-1.5">
              <Monitor className="size-3.5" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="plan" className="gap-1.5">
              <FileText className="size-3.5" />
              Business Plan
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1.5">
          {tab === "preview" && (
            <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={cn(
                  "grid size-7 place-items-center rounded-md transition-colors",
                  device === "desktop" ? "bg-white/10 text-foreground" : "text-muted-foreground/60 hover:text-foreground",
                )}
                aria-label="桌面预览"
              >
                <Monitor className="size-3.5" />
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={cn(
                  "grid size-7 place-items-center rounded-md transition-colors",
                  device === "mobile" ? "bg-white/10 text-foreground" : "text-muted-foreground/60 hover:text-foreground",
                )}
                aria-label="移动预览"
              >
                <Smartphone className="size-3.5" />
              </button>
            </div>
          )}
          {tab === "preview" ? (
            <>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                disabled={!artifact}
                className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                aria-label="重新加载预览"
              >
                <RefreshCw className="size-3.5" />
              </button>
              <button
                onClick={openStandalone}
                disabled={!artifact}
                className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                aria-label="新标签页打开"
              >
                <ArrowUpRight className="size-3.5" />
              </button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={copyPlan} disabled={!plan}>
              {copied ? <Check className="text-emerald-300" /> : <Copy />}
              {copied ? "已复制" : "复制企划"}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "preview" | "plan")}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsContent value="preview" className="mt-0 flex min-h-0 flex-1 flex-col p-3">
          <div className="relative flex min-h-[420px] flex-1 items-stretch justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#f6f6fb]">
            {artifact ? (
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  device === "mobile" ? "w-full max-w-[390px] py-2" : "w-full",
                )}
              >
                <iframe
                  key={`${reloadKey}-${device}`}
                  title="生成的产品落地页预览"
                  srcDoc={artifact.landingHtml}
                  sandbox="allow-scripts allow-forms allow-popups"
                  className="h-full min-h-[420px] w-full border-0 bg-white"
                />
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0a0912] px-6 text-center">
                <AtomsOrb size={56} className={running ? "animate-pulse" : ""} />
                <p className="text-[12.5px] text-foreground/80">
                  {running
                    ? `${activeNode ? activeNode.title : "研发智能体"}正在进行…`
                    : "预览将在这里出现"}
                </p>
                <div className="relative h-1 w-44 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="absolute inset-y-0 w-1/3 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                </div>
                <p className="text-[10.5px] text-muted-foreground/70">
                  {running ? "页面写好即刻渲染，无需刷新" : "点右上角重跑可重新生成"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-0.5 text-[10.5px] text-muted-foreground/70">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <Check className="size-3 text-emerald-400/80" />
                自包含 HTML
              </span>
              <span className="flex items-center gap-1">
                <Check className="size-3 text-emerald-400/80" />
                移动端断点
              </span>
              <span className="flex items-center gap-1">
                <Check className="size-3 text-emerald-400/80" />
                无外部依赖
              </span>
            </div>
            <span className="tabular-nums">
              {artifact ? `${Math.round(artifact.landingHtml.length / 1024)} KB · ${new Date(artifact.generatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}` : "—"}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4 thin-scrollbar">
          {plan ? (
            <PlanView plan={plan} />
          ) : (
            <div className="space-y-2.5">
              <div className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
              <div className="h-32 animate-pulse rounded-xl bg-white/[0.03]" />
              <div className="h-24 animate-pulse rounded-xl bg-white/[0.03]" />
              <p className="pt-2 text-center text-[11px] text-muted-foreground/60">
                运营智能体会在第 5 个节点交付商业企划
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

function PlanView({ plan }: { plan: BusinessPlan }) {
  return (
    <div className="space-y-5 pb-2">
      <div className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.09] to-transparent p-4">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] uppercase tracking-[0.22em] text-violet-200/70">
            Business Plan
          </span>
          <Badge className="border-violet-400/20 bg-violet-500/10 text-[9.5px] text-violet-200">
            AI 生成
          </Badge>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <h2 className="text-[22px] font-semibold tracking-tight">{plan.name}</h2>
          <span className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {plan.latin}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-violet-100/90">{plan.tagline}</p>
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">{plan.summary}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-2.5">
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">问题</p>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground/80">{plan.problem}</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-black/20 p-2.5">
            <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/60">承诺</p>
            <p className="mt-1 text-[11px] leading-relaxed text-foreground/80">{plan.promise}</p>
          </div>
        </div>
      </div>

      <PlanSection title="核心功能" hint="3 FEATURES">
        <div className="space-y-2">
          {plan.features.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? Sparkles;
            return (
              <div
                key={feature.title}
                className="flex gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5"
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-violet-200">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium">
                    <span className="mr-1.5 text-[9.5px] tabular-nums text-muted-foreground/50">
                      0{index + 1}
                    </span>
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PlanSection>

      <PlanSection title="定价" hint="PRICING">
        <div className="grid gap-2 sm:grid-cols-3">
          {plan.pricing.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-xl border p-2.5",
                tier.featured
                  ? "border-violet-400/30 bg-violet-500/[0.08]"
                  : "border-white/[0.06] bg-white/[0.02]",
              )}
            >
              {tier.featured && (
                <span className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-1.5 py-0.5 text-[8.5px] text-white">
                  推荐
                </span>
              )}
              <p className="text-[11px] font-medium">{tier.name}</p>
              <p className="mt-1 flex items-baseline gap-0.5">
                <span className="text-[17px] font-semibold tracking-tight">{tier.price}</span>
                <span className="text-[9px] text-muted-foreground/60">{tier.unit}</span>
              </p>
              <ul className="mt-2 space-y-1">
                {tier.perks.slice(0, 3).map((perk) => (
                  <li key={perk} className="flex items-start gap-1 text-[9.5px] leading-relaxed text-muted-foreground">
                    <span className="mt-1 size-1 shrink-0 rounded-full bg-violet-400/70" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PlanSection>

      <PlanSection title="目标用户" hint="WHO">
        <div className="flex flex-wrap gap-1.5">
          {plan.targetUsers.map((user) => (
            <span
              key={user}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-foreground/80"
            >
              <Users className="size-3 text-muted-foreground" />
              {user}
            </span>
          ))}
        </div>
      </PlanSection>

      <PlanSection title="SEO 关键词" hint="SEO">
        <div className="flex flex-wrap gap-1.5">
          {plan.seo.map((keyword, index) => (
            <span
              key={keyword}
              className="inline-flex items-center gap-1 rounded-lg border border-sky-400/20 bg-sky-500/[0.08] px-2.5 py-1.5 text-[11px] text-sky-100"
            >
              <Hash className="size-3 opacity-60" />
              {keyword}
              <span className="ml-0.5 text-[9px] text-sky-200/50">0{index + 1}</span>
            </span>
          ))}
        </div>
      </PlanSection>

      <PlanSection title="冷启动三步" hint="COLD START">
        <div className="space-y-2">
          {plan.coldStart.map((step, index) => (
            <div key={step.title} className="flex gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-[9.5px] tabular-nums text-violet-200">
                {index + 1}
              </span>
              <div>
                <p className="text-[11.5px] font-medium">{step.title}</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PlanSection>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
        <span className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground/50">
          Stack
        </span>
        {plan.stack.map((item) => (
          <span
            key={item}
            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9.5px] text-muted-foreground/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlanSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[11.5px] font-medium tracking-tight">{title}</h3>
        <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground/40">
          {hint}
        </span>
      </div>
      {children}
    </div>
  );
}
