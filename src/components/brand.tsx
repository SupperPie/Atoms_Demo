import { cn } from "@/lib/utils";

export function AtomsOrb({
  size = 88,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, rgba(167,139,250,.6), transparent 68%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-full animate-spin-slow opacity-90"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #8b5cf6 16%, transparent 36%, #38bdf8 58%, transparent 80%, #8b5cf6 100%)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 1.6px), #000 calc(100% - 1.2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 1.6px), #000 calc(100% - 1.2px))",
        }}
      />
      <div
        className="absolute inset-[13%] rounded-full animate-spin-reverse opacity-70"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderTopColor: "rgba(196,181,253,0.7)",
        }}
      />
      <div
        className="absolute inset-[24%] rounded-full"
        style={{
          background:
            "linear-gradient(150deg, rgba(255,255,255,0.28), rgba(139,92,246,0.22) 46%, rgba(56,189,248,0.16))",
          boxShadow:
            "inset 0 1px 14px rgba(255,255,255,0.3), inset 0 -8px 20px rgba(30,27,75,0.7), 0 18px 44px -18px rgba(124,58,237,0.95)",
        }}
      >
        <div
          className="absolute left-[26%] top-[20%] h-[18%] w-[30%] rounded-full blur-[2px]"
          style={{ background: "rgba(255,255,255,0.55)" }}
        />
      </div>
      {[
        { inset: "2%", duration: "16s", delay: "0s", color: "#c4b5fd" },
        { inset: "9%", duration: "22s", delay: "-6s", color: "#93c5fd" },
        { inset: "16%", duration: "28s", delay: "-14s", color: "#7dd3fc" },
      ].map((orbit, i) => (
        <div
          key={i}
          className="absolute animate-spin-slow"
          style={{
            inset: orbit.inset,
            animationDuration: orbit.duration,
            animationDelay: orbit.delay,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        >
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: size > 60 ? 5 : 3,
              height: size > 60 ? 5 : 3,
              background: orbit.color,
              boxShadow: `0 0 10px ${orbit.color}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <AtomsOrb size={compact ? 28 : 34} />
      <div className="leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={cn("font-semibold tracking-tight", compact ? "text-[15px]" : "text-[17px]")}>
            Atoms<span className="text-gradient-violet">-Mini</span>
          </span>
          {!compact && (
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
              Agent Studio
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
