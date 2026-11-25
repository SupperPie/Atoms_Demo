"use client";

import type { CSSProperties, ReactNode } from "react";

import type { MvpAccent, MvpPatch } from "@/lib/types";
import { cn } from "@/lib/utils";

export type MvpSection = "stats" | "steps" | "faq" | "reviews";

export const ACCENTS: Record<
  MvpAccent,
  { from: string; to: string; soft: string; text: string; ring: string }
> = {
  violet: {
    from: "#8b5cf6",
    to: "#6366f1",
    soft: "rgba(139,92,246,0.12)",
    text: "#c4b5fd",
    ring: "rgba(139,92,246,0.35)",
  },
  cyan: {
    from: "#22d3ee",
    to: "#3b82f6",
    soft: "rgba(34,211,238,0.12)",
    text: "#a5f3fc",
    ring: "rgba(34,211,238,0.35)",
  },
  emerald: {
    from: "#34d399",
    to: "#14b8a6",
    soft: "rgba(52,211,153,0.12)",
    text: "#a7f3d0",
    ring: "rgba(52,211,153,0.35)",
  },
  amber: {
    from: "#fbbf24",
    to: "#fb923c",
    soft: "rgba(251,191,36,0.12)",
    text: "#fde68a",
    ring: "rgba(251,191,36,0.35)",
  },
  rose: {
    from: "#fb7185",
    to: "#e879f9",
    soft: "rgba(251,113,133,0.12)",
    text: "#fecdd3",
    ring: "rgba(251,113,133,0.35)",
  },
};

export function accentOf(patch: MvpPatch) {
  return ACCENTS[patch.accent ?? "violet"];
}

export function styleVars(patch: MvpPatch): CSSProperties {
  const accent = accentOf(patch);
  return {
    ["--a" as string]: accent.from,
    ["--b" as string]: accent.to,
    ["--soft" as string]: accent.soft,
    ["--atext" as string]: accent.text,
    ["--ring" as string]: accent.ring,
  } as CSSProperties;
}

const DEFAULTS: Record<MvpSection, boolean> = {
  stats: true,
  steps: true,
  faq: false,
  reviews: false,
};

export function isVisible(patch: MvpPatch, section: MvpSection): boolean {
  if (patch.hide?.includes(section)) return false;
  if (patch.show?.includes(section)) return true;
  return DEFAULTS[section];
}

export function MvpButton({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[12.5px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "text-white shadow-[0_14px_36px_-18px_var(--b)] hover:brightness-110"
          : "border border-white/[0.12] bg-white/[0.04] text-white/80 hover:bg-white/[0.08]",
        className,
      )}
      style={
        variant === "primary"
          ? { backgroundImage: "linear-gradient(100deg, var(--a), var(--b))" }
          : undefined
      }
    >
      {children}
    </button>
  );
}

export function MvpFrame({
  patch,
  name,
  latin,
  nav,
  children,
}: {
  patch: MvpPatch;
  name: string;
  latin: string;
  nav: string[];
  children: ReactNode;
}) {
  return (
    <div
      style={styleVars(patch)}
      className="relative min-h-full bg-[#06070e] text-white/90"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(680px 320px at 20% -10%, var(--soft), transparent 70%), radial-gradient(520px 280px at 90% 0%, rgba(56,189,248,0.08), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 45% at 40% 8%, #000 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 45% at 40% 8%, #000 20%, transparent 100%)",
        }}
      />
      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#06070e]/75 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-[1080px] items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span
                className="size-6 rounded-lg"
                style={{ backgroundImage: "linear-gradient(140deg, var(--a), var(--b))" }}
              />
              <span className="text-[13.5px] font-semibold tracking-tight">{name}</span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-white/35">{latin}</span>
            </div>
            <nav className="hidden items-center gap-5 text-[11.5px] text-white/45 sm:flex">
              {nav.map((item) => (
                <span key={item} className="cursor-default transition-colors hover:text-white/80">
                  {item}
                </span>
              ))}
            </nav>
            <span
              className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] text-[var(--atext)]"
              style={{ background: "var(--soft)" }}
            >
              {name} · Demo
            </span>
          </div>
        </header>

        {children}

        <footer className="border-t border-white/[0.06] px-5 py-5">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-2 text-[10px] text-white/30">
            <span>
              {name} · {latin}
            </span>
            <span>此页面为 Atoms-Mini 生成的最小可用示例，数据仅存在于本地</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function StatsRow({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="mx-auto grid max-w-[1080px] grid-cols-3 gap-3 px-5 py-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3 text-center"
        >
          <p className="text-[19px] font-semibold tracking-tight text-white">{item.value}</p>
          <p className="mt-0.5 text-[10px] text-white/40">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function ReviewsRow({
  items,
}: {
  items: { name: string; role: string; text: string }[];
}) {
  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--atext)] opacity-70">Reviews</p>
      <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight">真实用户怎么说</h3>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
          >
            <p className="text-[11px] leading-relaxed text-white/70">“{item.text}”</p>
            <div className="mt-2.5 flex items-center gap-2">
              <span
                className="grid size-6 place-items-center rounded-full text-[9.5px] text-white"
                style={{ backgroundImage: "linear-gradient(140deg, var(--a), var(--b))" }}
              >
                {item.name.slice(0, 1)}
              </span>
              <div className="leading-tight">
                <p className="text-[10.5px] text-white/80">{item.name}</p>
                <p className="text-[9px] text-white/35">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-8">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--atext)] opacity-70">FAQ</p>
      <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight">你可能关心的问题</h3>
      <div className="mt-3 divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-white/[0.02]">
        {items.map((item) => (
          <details key={item.q} className="group px-3.5 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11.5px] text-white/80">
              {item.q}
              <span className="text-white/30 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/45">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] text-white/40">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-2 text-[11.5px] text-white/85 outline-none transition-colors placeholder:text-white/25 focus:border-[var(--ring)] focus:bg-white/[0.05]";
