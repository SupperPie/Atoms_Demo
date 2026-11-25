"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, MapPin, Star, Video } from "lucide-react";

import type { MvpPatch } from "@/lib/types";
import {
  FaqList,
  isVisible,
  MvpButton,
  MvpFrame,
  ReviewsRow,
  StatsRow,
} from "@/components/mvp/shared";

const SITTERS = [
  {
    name: "林小姐",
    distance: "3.1 km",
    years: "养猫 2 年",
    price: 68,
    rating: "4.9",
    tags: ["可接猫", "居家办公", "有猫爬架"],
    bio: "家里有一只 3 岁的英短，性格温和，接受短期托付。",
    color: "#fbbf24",
  },
  {
    name: "陈先生",
    distance: "1.2 km",
    years: "养狗 4 年",
    price: 88,
    rating: "4.8",
    tags: ["有院子", "大型犬", "每日遛两次"],
    bio: "带院子的一楼，适合精力旺盛的狗，接受 7 天以上寄养。",
    color: "#fb7185",
  },
  {
    name: "阿紫",
    distance: "同小区",
    years: "养猫 5 年",
    price: 55,
    rating: "5.0",
    tags: ["同小区", "可接送", "全天陪伴"],
    bio: "就在隔壁楼，可以上门喂猫，也接受送养到我家。",
    color: "#a78bfa",
  },
];

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0;
  return Math.round((b - a) / 86400000);
}

export function PetcareMvp({ patch }: { patch: MvpPatch }) {
  const [selected, setSelected] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pet, setPet] = useState<"猫" | "狗">("猫");
  const [booked, setBooked] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const sitter = SITTERS[selected];
  const days = useMemo(() => daysBetween(start, end), [start, end]);
  const compact = patch.density === "compact";

  const confirm = () => {
    if (!days) {
      setFlash("请选择寄养的开始与结束日期。");
      return;
    }
    setBooked(true);
    setFlash(null);
  };

  return (
    <MvpFrame
      patch={patch}
      name="邻家毛孩"
      latin="PAWPAL"
      nav={["找寄养", "成为寄养家庭", "我的预订"]}
    >
      <section className="mx-auto max-w-[1080px] px-5 pb-5 pt-9">
        <div className="max-w-[640px]">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[var(--atext)]"
            style={{ background: "var(--soft)" }}
          >
            <MapPin className="size-3" />
            同小区 · 3 公里内匹配
          </span>
          <h1
            className={`mt-3 font-semibold tracking-[-0.03em] text-white ${compact ? "text-[26px] leading-[1.2]" : "text-[31px] leading-[1.15] sm:text-[37px]"}`}
          >
            {patch.headline ?? (
              <>
                出差时，让隔壁的养宠人
                <br className="hidden sm:block" />
                <span
                  style={{
                    backgroundImage: "linear-gradient(100deg, var(--a), var(--b))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  帮你照看毛孩子
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-[430px] text-[12px] leading-relaxed text-white/45">
            按距离与养宠经验匹配邻居家庭，每天视频回传、打卡记录，平台提供责任险与双向评价。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <MvpButton onClick={() => setFlash("往下滑，挑一个你信任的邻居。")}>
              {patch.ctaLabel ?? "找附近的寄养家庭"}
              <ArrowRight className="size-3.5" />
            </MvpButton>
            <MvpButton variant="ghost" onClick={() => setFlash("成为寄养家庭的申请入口已打开（演示）。")}>
              成为寄养家庭
            </MvpButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 pb-5">
        <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="text-[12.5px] font-medium text-white/85">附近的寄养家庭</h2>
              <span className="text-[9.5px] text-white/30">按距离与评分排序</span>
            </div>
            {SITTERS.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelected(index);
                  setBooked(false);
                }}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  selected === index
                    ? "border-[var(--ring)] bg-white/[0.05]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-medium text-white"
                    style={{
                      backgroundImage: `linear-gradient(140deg, ${item.color}, rgba(255,255,255,0.15))`,
                    }}
                  >
                    {item.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] font-medium text-white/90">{item.name}</span>
                      <span className="text-[9.5px] text-white/35">{item.years}</span>
                      <span className="ml-auto flex items-center gap-0.5 text-[10px] text-amber-300/80">
                        <Star className="size-2.5 fill-current" />
                        {item.rating}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/40">{item.bio}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-[9.5px] text-white/35">
                        {item.distance} · ¥{item.price}/天
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            {booked ? (
              <div className="animate-fade-up">
                <span className="grid size-9 place-items-center rounded-full bg-emerald-500/15">
                  <Check className="size-4 text-emerald-300" />
                </span>
                <h3 className="mt-2.5 text-[13.5px] font-medium text-white/90">
                  已向 {sitter.name} 发送预订请求
                </h3>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/45">
                  {pet === "猫" ? "猫咪" : "狗狗"} · {start} 至 {end} · 共 {days} 天 · 预计 ¥
                  {days * sitter.price}
                </p>
                <div className="mt-3 space-y-1.5 rounded-lg border border-white/[0.07] bg-black/20 p-2.5">
                  {[
                    "对方确认后才会生成订单",
                    "寄养期间每天收到一次视频回传",
                    "平台责任险已默认开启",
                  ].map((text) => (
                    <p key={text} className="flex items-start gap-1.5 text-[10px] text-white/45">
                      <Check className="mt-0.5 size-2.5 shrink-0 text-[var(--atext)]" />
                      {text}
                    </p>
                  ))}
                </div>
                <MvpButton
                  variant="ghost"
                  className="mt-3 h-8 px-3 py-0 text-[10.5px]"
                  onClick={() => {
                    setBooked(false);
                    setFlash("可以换一个家庭或日期再试。");
                  }}
                >
                  再订一次
                </MvpButton>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-medium text-white/85">预订 {sitter.name}</h3>
                  <span className="text-[10px] text-white/35">¥{sitter.price} / 天</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-[9.5px] text-white/35">开始日期</span>
                    <input
                      type="date"
                      value={start}
                      onChange={(event) => setStart(event.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2 py-1.5 text-[10.5px] text-white/80 outline-none focus:border-[var(--ring)]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[9.5px] text-white/35">结束日期</span>
                    <input
                      type="date"
                      value={end}
                      onChange={(event) => setEnd(event.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2 py-1.5 text-[10.5px] text-white/80 outline-none focus:border-[var(--ring)]"
                    />
                  </label>
                </div>

                <div className="mt-2.5 flex items-center gap-1">
                  {(["猫", "狗"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setPet(item)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                        pet === item
                          ? "border-transparent text-white"
                          : "border-white/10 bg-white/[0.02] text-white/40"
                      }`}
                      style={
                        pet === item
                          ? { backgroundImage: "linear-gradient(100deg, var(--a), var(--b))" }
                          : undefined
                      }
                    >
                      {item === "猫" ? "猫咪" : "狗狗"}
                    </button>
                  ))}
                  <span className="ml-auto text-[9.5px] text-white/30">
                    {days ? `${days} 天 · ¥${days * sitter.price}` : "选择日期查看总价"}
                  </span>
                </div>

                <MvpButton onClick={confirm} className="mt-3 w-full">
                  预约寄养
                </MvpButton>
                {flash && (
                  <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-white/60">
                    {flash}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1 text-[9px] text-white/30">
                  <Video className="size-2.5" />
                  每日视频回传 · 双向评价 · 平台责任险
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {isVisible(patch, "stats") && (
        <StatsRow
          items={[
            { value: "8 分钟", label: "平均响应时间" },
            { value: "61%", label: "复购托付率" },
            { value: "100%", label: "每日视频回传" },
          ]}
        />
      )}

      {isVisible(patch, "steps") && !compact && (
        <section className="mx-auto max-w-[1080px] px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "填宠物档案", desc: "品种、性格、忌口与用药，一次填完长期复用。" },
              { title: "选一个邻居", desc: "看距离、评价与家庭环境，直接发预订。" },
              { title: "每天收到回传", desc: "视频打卡与健康记录，回家还有小结。" },
            ].map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
              >
                <span className="text-[9.5px] tabular-nums text-[var(--atext)] opacity-70">0{index + 1}</span>
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
            { name: "周周", role: "养猫 · 3 岁英短", text: "每天都能看到猫在邻居家吃饭的视频，出差安心多了。" },
            { name: "Momo", role: "养狗 · 柯基", text: "同小区的一对夫妻帮忙带的，回来狗都不想走了。" },
            { name: "张先生", role: "寄养家庭", text: "平台把排期和结算都做好了，接单很省心。" },
          ]}
        />
      )}

      {isVisible(patch, "faq") && (
        <FaqList
          items={[
            { q: "寄养家庭如何审核？", a: "需要实名认证与养宠经验证明，首次接单前会进行一次线上访谈。" },
            { q: "宠物生病了怎么办？", a: "寄养家庭需第一时间联系主人，平台提供 24 小时客服与责任险协助。" },
            { q: "可以只寄养两天吗？", a: "可以，1 天起订，但部分家庭会设置最短 2 天的门槛，页面上会标注。" },
          ]}
        />
      )}
    </MvpFrame>
  );
}
