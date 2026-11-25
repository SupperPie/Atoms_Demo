"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Plus, Truck } from "lucide-react";

import type { MvpPatch } from "@/lib/types";
import { getMvpState, saveMvpState } from "@/lib/storage";
import {
  FaqList,
  Field,
  inputClass,
  isVisible,
  MvpButton,
  MvpFrame,
  ReviewsRow,
  StatsRow,
} from "@/components/mvp/shared";

type Kind = "车源" | "货源";

interface RouteItem {
  id: number;
  from: string;
  to: string;
  weight: string;
  kind: Kind;
  time: string;
  match: number;
  isNew?: boolean;
}

const SEED: RouteItem[] = [
  { id: 1, from: "广州", to: "深圳", weight: "4.2 吨", kind: "车源", time: "今天 15:00", match: 92 },
  { id: 2, from: "佛山", to: "东莞", weight: "8 吨", kind: "货源", time: "明天 09:00", match: 87 },
  { id: 3, from: "深圳", to: "惠州", weight: "2 吨 · 冷链", kind: "车源", time: "今天 18:00", match: 81 },
  { id: 4, from: "中山", to: "广州", weight: "1.5 吨", kind: "货源", time: "明天 11:00", match: 76 },
];

const STEPS = [
  { title: "发布线路", desc: "填起点、终点与吨位，30 秒完成。" },
  { title: "顺路撮合", desc: "系统按顺路度排序，先看最值得接的单。" },
  { title: "确认成交", desc: "线上确认价格与时间，线下履约后互评。" },
];

export function CargoMvp({ patch }: { patch: MvpPatch }) {
  const [items, setItems] = useState<RouteItem[]>(SEED);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"全部" | Kind>("全部");
  const [kind, setKind] = useState<Kind>("车源");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [weight, setWeight] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const saved = getMvpState<{ items: RouteItem[] }>("cargo");
    if (saved?.items?.length) setItems(saved.items);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveMvpState("cargo", { items });
  }, [items, hydrated]);

  const filtered = useMemo(
    () => (filter === "全部" ? items : items.filter((item) => item.kind === filter)),
    [items, filter],
  );

  const publish = () => {
    if (!from.trim() || !to.trim()) {
      setFlash("起点和终点都要填一下。");
      return;
    }
    const match = 74 + ((from.length + to.length + weight.length) % 22);
    setItems((prev) => [
      {
        id: Date.now(),
        from: from.trim(),
        to: to.trim(),
        weight: weight.trim() || "待确认",
        kind,
        time: "刚刚",
        match,
        isNew: true,
      },
      ...prev,
    ]);
    setFlash(`已发布${kind}：${from.trim()} → ${to.trim()}，正在寻找顺路匹配。`);
    setFrom("");
    setTo("");
    setWeight("");
    setSelected(null);
  };

  const compact = patch.density === "compact";

  return (
    <MvpFrame patch={patch} name="拼途" latin="POOLROUTE" nav={["线路大厅", "发布", "我的"]}>
      <section className="mx-auto grid max-w-[1080px] gap-6 px-5 pb-6 pt-9 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
        <div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[var(--atext)]"
            style={{ background: "var(--soft)" }}
          >
            <span className="size-1 rounded-full" style={{ background: "var(--b)" }} />
            内测 · 华南试运行
          </span>
          <h1
            className={`mt-3 font-semibold tracking-[-0.03em] text-white ${compact ? "text-[26px] leading-[1.2]" : "text-[32px] leading-[1.15] sm:text-[38px]"}`}
          >
            {patch.headline ?? (
              <>
                让每一段空驶，
                <span
                  className="block sm:inline"
                  style={{
                    backgroundImage: "linear-gradient(100deg, var(--a), var(--b))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  都有货可装
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-[420px] text-[12px] leading-relaxed text-white/45">
            发布闲置货车与待运货源，按线路、时间窗和载重自动撮合。司机少空跑，货主少等待。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <MvpButton onClick={() => setFlash("已打开发布面板，填写起终点即可发布。")}>
              {patch.ctaLabel ?? "免费发布线路"}
              <ArrowRight className="size-3.5" />
            </MvpButton>
            <MvpButton variant="ghost" onClick={() => setFlash("今天的顺路线路已按匹配度排序。")}>
              查看顺路货
            </MvpButton>
          </div>
          <p className="mt-3 text-[10px] text-white/30">
            今日新增 126 条线路 · 平均撮合 9 分钟
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-[10.5px] text-white/50">今日顺路线路</span>
            <span className="flex items-center gap-1 text-[9.5px] text-emerald-300/80">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              实时更新
            </span>
          </div>
          <div className="space-y-1">
            {SEED.slice(0, 3).map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-md"
                  style={{ background: "var(--soft)", color: "var(--atext)" }}
                >
                  <Truck className="size-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-white/80">
                    {row.from} → {row.to}
                  </p>
                  <p className="text-[9.5px] text-white/35">
                    {row.weight} · {row.time}
                  </p>
                </div>
                <span
                  className="rounded-full border border-white/10 px-1.5 py-0.5 text-[9px]"
                  style={{ color: "var(--atext)" }}
                >
                  {row.match}% 顺路
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 pb-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Truck className="size-3.5 text-[var(--atext)]" />
              <h2 className="text-[13px] font-medium">线路广场</h2>
              <span className="text-[9.5px] text-white/30">{filtered.length} 条</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/20 p-0.5">
              {(["全部", "车源", "货源"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`rounded-md px-2 py-1 text-[10px] transition-colors ${
                    filter === tab ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-2 rounded-xl border border-white/[0.06] bg-black/20 p-2.5 sm:grid-cols-[auto_1fr_1fr_.8fr_auto] sm:items-end">
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
              {(["车源", "货源"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-md px-2 py-1.5 text-[10px] transition-colors ${
                    kind === k ? "bg-white/10 text-white" : "text-white/40"
                  }`}
                >
                  我有{k === "车源" ? "车" : "货"}
                </button>
              ))}
            </div>
            <Field label="起点">
              <input
                className={inputClass}
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="如 广州"
              />
            </Field>
            <Field label="终点">
              <input
                className={inputClass}
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="如 深圳"
              />
            </Field>
            <Field label="吨位 / 车型">
              <input
                className={inputClass}
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="4.2 吨"
              />
            </Field>
            <MvpButton onClick={publish} className="h-[34px] px-3 py-0">
              <Plus className="size-3.5" />
              发布
            </MvpButton>
          </div>

          {flash && (
            <div className="mt-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[10.5px] text-white/70">
              {flash}
            </div>
          )}

          <div className="mt-2.5 space-y-1.5">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(selected === item.id ? null : item.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  selected === item.id
                    ? "border-[var(--ring)] bg-white/[0.05]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[9px]"
                    style={{
                      background: item.kind === "车源" ? "var(--soft)" : "rgba(56,189,248,.12)",
                      color: item.kind === "车源" ? "var(--atext)" : "#bae6fd",
                    }}
                  >
                    {item.kind}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px] text-white/85">
                    <MapPin className="size-3 text-white/30" />
                    {item.from}
                    <ArrowRight className="size-2.5 text-white/25" />
                    {item.to}
                  </span>
                  {item.isNew && (
                    <span className="rounded bg-emerald-500/15 px-1 py-0.5 text-[8.5px] text-emerald-300">
                      NEW
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-white/35">{item.weight}</span>
                  <span className="text-[10px] text-white/25">{item.time}</span>
                  <span
                    className="w-[70px] text-right text-[10.5px] tabular-nums"
                    style={{ color: "var(--atext)" }}
                  >
                    {item.match}% 顺路
                  </span>
                </div>
                {selected === item.id && (
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
                    <p className="text-[10px] text-white/40">
                      预计 {item.kind === "车源" ? "2 小时内可装车" : "当天可发运"} · 已实名认证
                    </p>
                    <MvpButton
                      onClick={() => setFlash(`已向 ${item.from} 的车主发送对接请求（演示）。`)}
                      className="h-7 px-2.5 py-0 text-[10.5px]"
                    >
                      联系对方
                    </MvpButton>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {isVisible(patch, "stats") && (
        <StatsRow
          items={[
            { value: "9 分钟", label: "平均撮合时长" },
            { value: "-32%", label: "平均空驶率" },
            { value: "12,400+", label: "已履约线路" },
          ]}
        />
      )}

      {isVisible(patch, "steps") && !compact && (
        <section className="mx-auto max-w-[1080px] px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <span className="text-[9.5px] tabular-nums text-[var(--atext)] opacity-70">
                  0{index + 1}
                </span>
                <p className="mt-1 text-[12px] font-medium text-white/85">{step.title}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/40">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {isVisible(patch, "reviews") && (
        <ReviewsRow
          items={[
            { name: "老李", role: "个体司机 · 广州", text: "以前空车回来只能等，现在出发前就能先接一单顺路的。" },
            { name: "陈老板", role: "电商卖家 · 深圳", text: "临时补一批货，二十分钟就找到能当天走的车。" },
            { name: "阿锋", role: "车队调度 · 佛山", text: "线路和吨位写清楚之后，扯皮的电话少了一大半。" },
          ]}
        />
      )}

      {isVisible(patch, "faq") && (
        <FaqList
          items={[
            { q: "发布线路要收费吗？", a: "发布永久免费，只在成交后按订单收取服务费，内测期全部免佣。" },
            { q: "如何保证货物安全？", a: "双方实名认证，订单默认带运输险，签收节点需要上传凭证。" },
            { q: "可以只接同城单吗？", a: "可以，在发布时选择同城即可，系统会优先推荐 50 公里内的顺路单。" },
          ]}
        />
      )}
    </MvpFrame>
  );
}
