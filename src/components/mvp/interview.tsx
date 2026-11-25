"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Mic, Sparkles } from "lucide-react";

import type { MvpPatch } from "@/lib/types";
import {
  FaqList,
  isVisible,
  MvpButton,
  MvpFrame,
  ReviewsRow,
  StatsRow,
} from "@/components/mvp/shared";

const ROLES = [
  {
    key: "产品经理",
    questions: [
      "请介绍一个你从 0 到 1 推动的产品，你在其中做了哪些关键决策？",
      "当研发说这个版本做不完时，你如何取舍需求并说服相关方？",
      "你会如何衡量一个新上线的功能是否成功？",
    ],
  },
  {
    key: "前端工程师",
    questions: [
      "讲一个你优化过的性能问题，如何定位、如何验证效果？",
      "你会如何设计一个被多个团队复用的组件？",
      "线上出现白屏时，你的排查顺序是什么？",
    ],
  },
  {
    key: "数据分析",
    questions: [
      "如何判断一个指标异常是业务问题还是数据问题？",
      "如果让你设计一次用户流失分析，你会怎么做？",
      "你会如何向业务方解释一个复杂的分析结论？",
    ],
  },
];

function evaluate(answer: string, role: string) {
  const text = answer.trim();
  const len = text.length;
  let score = 46 + Math.min(40, Math.round(len / 5));
  const hasContext = /(因为|原因|背景|当时|目标)/.test(text);
  const hasData = /(数据|结果|提升|下降|%|倍|从\d)/.test(text);
  const hasOwner = /(我负责|我主导|我做了|我推动|我设计)/.test(text);

  if (hasContext) score += 4;
  if (hasData) score += 5;
  if (hasOwner) score += 3;
  score = Math.max(42, Math.min(96, score));

  const points: string[] = [];
  points.push(
    len < 40
      ? "回答偏短：补充当时的背景与你的具体动作，别只给结论。"
      : "长度合适：信息量够用，可以再提前半句给出结论。",
  );
  points.push(
    hasData
      ? "结果有数据支撑，面试官更容易记住你的贡献。"
      : "缺少可量化的结果，补一个前后对比数字会更有说服力。",
  );
  points.push(
    hasOwner
      ? "责任边界清楚，「我」的贡献表达到位。"
      : "多用「我」而不是「我们」，明确你个人的决策与产出。",
  );

  return {
    score,
    points,
    suggestion: `建议这样开头：「在 ${role} 的经历里，我负责……，通过……把这个指标从 A 做到 B。」然后补充一次失败或权衡。`,
  };
}

export function InterviewMvp({ patch }: { patch: MvpPatch }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ReturnType<typeof evaluate> | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const role = ROLES[roleIndex];
  const question = role.questions[questionIndex];
  const compact = patch.density === "compact";

  const scoreStyle = useMemo(() => {
    const score = result?.score ?? 0;
    return {
      background: `conic-gradient(var(--a) 0 ${score}%, rgba(255,255,255,0.07) ${score}% 100%)`,
    };
  }, [result]);

  const submit = () => {
    if (answer.trim().length < 8) {
      setFlash("至少写两句，AI 面试官才能给出有效反馈。");
      return;
    }
    setResult(evaluate(answer, role.key));
    setFlash(null);
  };

  const nextQuestion = () => {
    setQuestionIndex((index) => (index + 1) % role.questions.length);
    setAnswer("");
    setResult(null);
  };

  return (
    <MvpFrame
      patch={patch}
      name="面试雀"
      latin="REHEARSE"
      nav={["模拟面试", "题库", "复盘"]}
    >
      <section className="mx-auto max-w-[1080px] px-5 pb-5 pt-9">
        <div className="max-w-[640px]">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[var(--atext)]"
            style={{ background: "var(--soft)" }}
          >
            <Sparkles className="size-3" />
            AI 面试官 · 实时追问与评分
          </span>
          <h1
            className={`mt-3 font-semibold tracking-[-0.03em] text-white ${compact ? "text-[26px] leading-[1.2]" : "text-[32px] leading-[1.14] sm:text-[38px]"}`}
          >
            {patch.headline ?? (
              <>
                先练十遍，{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(100deg, var(--a), var(--b))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  再去面试
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-[440px] text-[12px] leading-relaxed text-white/45">
            选一个岗位，AI 会像真实面试官一样连续追问，结束时给出分数、逐句反馈和一句可直接替换的表达。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <MvpButton onClick={() => setFlash("已进入模拟：选岗位 → 作答 → 领取复盘。")}>
              {patch.ctaLabel ?? "免费模拟一次"}
              <ArrowRight className="size-3.5" />
            </MvpButton>
            <MvpButton variant="ghost" onClick={() => setFlash("复盘报告样例已打开（演示）。")}>
              看复盘样例
            </MvpButton>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-5 pb-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {ROLES.map((item, index) => (
            <button
              key={item.key}
              onClick={() => {
                setRoleIndex(index);
                setQuestionIndex(0);
                setAnswer("");
                setResult(null);
              }}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                roleIndex === index
                  ? "border-transparent text-white"
                  : "border-white/10 bg-white/[0.02] text-white/45 hover:text-white/70"
              }`}
              style={
                roleIndex === index
                  ? { backgroundImage: "linear-gradient(100deg, var(--a), var(--b))" }
                  : undefined
              }
            >
              {item.key}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-white/30">
            第 {questionIndex + 1} / {role.questions.length} 题
          </span>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.12fr_.88fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="grid size-6 place-items-center rounded-full" style={{ background: "var(--soft)" }}>
                <Mic className="size-3 text-[var(--atext)]" />
              </span>
              AI 面试官 · {role.key}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">{question}</p>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={5}
              placeholder="像真的面试一样回答。建议：背景一句 → 你做了什么 → 结果与数字。"
              className="mt-3 w-full resize-none rounded-xl border border-white/[0.1] bg-black/25 px-3 py-2.5 text-[11.5px] leading-relaxed text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-[var(--ring)]"
            />
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="text-[9.5px] text-white/25">{answer.length} 字</span>
              <div className="flex gap-1.5">
                {result && (
                  <MvpButton variant="ghost" onClick={nextQuestion} className="h-8 px-2.5 py-0 text-[10.5px]">
                    下一题
                  </MvpButton>
                )}
                <MvpButton onClick={submit} className="h-8 px-3 py-0 text-[10.5px]">
                  提交回答
                </MvpButton>
              </div>
            </div>
            {flash && (
              <p className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-white/60">
                {flash}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            {result ? (
              <div className="animate-fade-up">
                <div className="flex items-center gap-3">
                  <div className="relative grid size-[74px] place-items-center rounded-full" style={scoreStyle}>
                    <div className="grid size-[62px] place-items-center rounded-full bg-[#0a0b14]">
                      <div className="text-center leading-none">
                        <p className="text-[19px] font-semibold text-white">{result.score}</p>
                        <p className="mt-1 text-[8px] text-white/35">综合分</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white/85">本场反馈已生成</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/40">
                      结构、证据、表达三个维度已完成评估
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {result.points.map((point) => (
                    <div key={point} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 size-3 shrink-0 text-[var(--atext)]" />
                      <p className="text-[10.5px] leading-relaxed text-white/55">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-white/[0.07] bg-black/20 p-2.5">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/30">改写建议</p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-white/55">
                    {result.suggestion}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[190px] flex-col items-center justify-center text-center">
                <span className="grid size-10 place-items-center rounded-full" style={{ background: "var(--soft)" }}>
                  <Sparkles className="size-4 text-[var(--atext)]" />
                </span>
                <p className="mt-2.5 text-[11.5px] text-white/60">提交回答后，这里会出现</p>
                <p className="mt-1 text-[10px] text-white/30">分数 · 三条反馈 · 一句改写建议</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {isVisible(patch, "stats") && (
        <StatsRow
          items={[
            { value: "+23%", label: "二面通过率提升" },
            { value: "1,800+", label: "真实岗位题库" },
            { value: "5 分钟", label: "生成复盘报告" },
          ]}
        />
      )}

      {isVisible(patch, "steps") && !compact && (
        <section className="mx-auto max-w-[1080px] px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "选择岗位", desc: "粘贴 JD，30 秒生成专属题库。" },
              { title: "开口作答", desc: "语音或文字作答，AI 连续追问。" },
              { title: "领取复盘", desc: "分数、问题清单与改写建议。" },
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
            { name: "小林", role: "应届生 · 产品", text: "练了三场，真实面试时被追问也没那么慌了。" },
            { name: "Eric", role: "转行 · 数据分析", text: "复盘指出的「缺少数字」正是我每次都挂的原因。" },
            { name: "Zoe", role: "前端 3 年", text: "比自己对着镜子练有用多了，追问很真实。" },
          ]}
        />
      )}

      {isVisible(patch, "faq") && (
        <FaqList
          items={[
            { q: "题目是真实岗位的吗？", a: "题库来自公开招聘 JD 的抽象归纳，并按岗位与级别做了分层。" },
            { q: "评分可靠吗？", a: "评分用于练习参考，重点看逐句反馈与改写建议，而不是分数本身。" },
            { q: "可以练几次？", a: "免费版可完整体验 1 场，月度版每周 8 场，上岸包不限次。" },
          ]}
        />
      )}
    </MvpFrame>
  );
}
