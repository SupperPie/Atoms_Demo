export interface ExampleCase {
  slug: string;
  name: string;
  latin: string;
  tagline: string;
  label: string;
  idea: string;
  tags: string[];
  accent: "indigo" | "rose" | "amber";
  editorHints: string[];
}

export const EXAMPLES: ExampleCase[] = [
  {
    slug: "cargo",
    name: "拼途",
    latin: "POOLROUTE",
    tagline: "空闲货车 × 待运货源，顺路撮合",
    label: "物流撮合",
    idea:
      "我想做一个可以拼货车的平台，在平台上可以发布我在哪里有闲置的货车车辆、有多少什么类型的货物需要从哪里运到哪里这样的对接信息。",
    tags: ["车源发布", "货源撮合", "顺路排序"],
    accent: "indigo",
    editorHints: ["把主色改成青蓝色", "按钮文案改成「立即找货」", "增加一个数据统计区"],
  },
  {
    slug: "interview",
    name: "面试雀",
    latin: "REHEARSE",
    tagline: "AI 模拟面试官，练完带走复盘",
    label: "AI 求职",
    idea:
      "我想做一个 AI 模拟面试的产品，用户选择目标岗位后，AI 像真实面试官一样连续追问，并在结束后给出打分和逐句改写建议。",
    tags: ["岗位题库", "实时追问", "复盘报告"],
    accent: "rose",
    editorHints: ["整体更极简一点", "标题改成「先练十遍，再去面试」", "增加用户评价区"],
  },
  {
    slug: "petcare",
    name: "邻家毛孩",
    latin: "PAWPAL",
    tagline: "社区邻里之间的宠物寄养",
    label: "社区服务",
    idea:
      "我想做一个社区宠物寄养平台，让出差的养宠人可以按距离找到邻居家帮忙照看猫狗，并且每天收到视频回传。",
    tags: ["邻里匹配", "视频回传", "预订确认"],
    accent: "amber",
    editorHints: ["换成暖橙色", "增加常见问题区", "按钮文案改成「预约寄养」"],
  },
];

export function getExample(slug: string): ExampleCase | undefined {
  return EXAMPLES.find((e) => e.slug === slug);
}
