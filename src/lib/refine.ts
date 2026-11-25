import type { MvpAccent, MvpPatch } from "@/lib/types";

type Section = "stats" | "steps" | "faq" | "reviews";

const ACCENTS: { accent: MvpAccent; label: string; words: string[] }[] = [
  { accent: "cyan", label: "青蓝", words: ["青", "蓝", "科技蓝", "天蓝", "cyan"] },
  { accent: "emerald", label: "翠绿", words: ["绿", "环保", "自然", "emerald"] },
  { accent: "amber", label: "暖橙", words: ["橙", "暖", "黄", "阳光", "amber"] },
  { accent: "rose", label: "玫红", words: ["粉", "红", "玫", "浪漫", "rose"] },
  { accent: "violet", label: "紫罗兰", words: ["紫", "violet", "默认色"] },
];

const SECTION_WORDS: { section: Section; label: string; words: string[] }[] = [
  { section: "stats", label: "数据统计区", words: ["数据", "统计", "指标", "数字"] },
  { section: "steps", label: "使用步骤区", words: ["步骤", "流程", "怎么用", "使用方式"] },
  { section: "faq", label: "常见问题区", words: ["faq", "常见问题", "问答", "疑问"] },
  { section: "reviews", label: "用户评价区", words: ["评价", "口碑", "用户说", "证言", "好评"] },
];

function pickText(message: string, kind: "标题" | "按钮"): string | null {
  const patterns = [
    new RegExp(`(?:主)?${kind}(?:文案|文字)?\\s*(?:改成|改为|换成|设为|用)\\s*[「"“']?([^」"”'。,\\n]{2,32})`),
    new RegExp(`(?:把|将)(?:主)?${kind}\\s*[「"“']?([^」"”'。,\\n]{2,32})[」"”']?\\s*(?:改成|改为|换成)`),
  ];
  for (const re of patterns) {
    const matched = message.match(re);
    if (matched?.[1]) return matched[1].trim().replace(/[」"”']+$/, "");
  }
  return null;
}

function sectionState(patch: MvpPatch, section: Section): boolean {
  const base = section === "stats";
  if (patch.hide?.includes(section)) return false;
  if (patch.show?.includes(section)) return true;
  return base;
}

function setSection(patch: MvpPatch, section: Section, visible: boolean): MvpPatch {
  const hide = new Set(patch.hide ?? []);
  const show = new Set(patch.show ?? []);
  if (visible) {
    hide.delete(section);
    show.add(section);
  } else {
    show.delete(section);
    hide.add(section);
  }
  return { ...patch, hide: [...hide], show: [...show] };
}

export interface RefineResult {
  patch: MvpPatch;
  reply: string;
  changes: string[];
}

export function refine(rawMessage: string, current: MvpPatch = {}): RefineResult {
  const message = rawMessage.trim();
  let patch: MvpPatch = { ...current };
  const changes: string[] = [];

  if (!message) {
    return {
      patch,
      reply: "描述还没写呢。可以试试「换成青蓝色」「增加用户评价区」「整体更极简」这类具体指令。",
      changes: [],
    };
  }

  const accentHit = ACCENTS.find((a) => a.words.some((w) => message.includes(w)));
  if (accentHit && accentHit.accent !== patch.accent) {
    patch.accent = accentHit.accent;
    changes.push(`主色切换为${accentHit.label}`);
  }

  const headline = pickText(message, "标题");
  if (headline) {
    patch.headline = headline;
    changes.push(`主标题更新为「${headline}」`);
  }

  const cta = pickText(message, "按钮");
  if (cta) {
    patch.ctaLabel = cta;
    changes.push(`主按钮改为「${cta}」`);
  }

  const wantsCompact = /(极简|简约|简洁|精简|收敛|简单一点|不要太多)/.test(message);
  const wantsFull = /(丰富|详细|完整|加内容|更多内容|信息量)/.test(message);

  if (wantsCompact) {
    if (patch.density !== "compact") {
      patch.density = "compact";
      changes.push("切换为紧凑版式，隐藏次要区块");
    }
    patch = setSection(patch, "stats", false);
    patch = setSection(patch, "reviews", false);
    patch = setSection(patch, "faq", false);
  }

  if (wantsFull) {
    if (patch.density !== "full") {
      patch.density = "full";
      changes.push("切换为完整版式，展开全部区块");
    }
    patch = setSection(patch, "stats", true);
    patch = setSection(patch, "reviews", true);
    patch = setSection(patch, "faq", true);
    patch = setSection(patch, "steps", true);
  }

  for (const def of SECTION_WORDS) {
    const mentioned = def.words.some((w) => message.toLowerCase().includes(w));
    if (!mentioned) continue;
    const remove = /(去掉|删除|隐藏|不要|移除|删掉)/.test(message);
    const add = /(增加|添加|加上|加个|新增|展示|显示|补充)/.test(message);
    if (remove) {
      const before = sectionState(patch, def.section);
      patch = setSection(patch, def.section, false);
      if (before) changes.push(`隐藏${def.label}`);
    } else if (add) {
      const before = sectionState(patch, def.section);
      patch = setSection(patch, def.section, true);
      if (!before) changes.push(`新增${def.label}`);
    }
  }

  if (patch.headline && patch.headline.length > 30) {
    patch.headline = patch.headline.slice(0, 30);
  }

  if (changes.length === 0) {
    return {
      patch,
      reply:
        "这次没找到可以落地的改动。试试更具体的说法，比如「整体换成青蓝色」「主标题改成 30 秒找到顺路货」「增加用户评价区」。我会直接改在这版页面上。",
      changes: [],
    };
  }

  return {
    patch,
    reply: `研发 Agent 已完成二次加工：${changes.join("、")}。共 ${changes.length} 处变更，已应用到右侧预览并保存这一版。`,
    changes,
  };
}
