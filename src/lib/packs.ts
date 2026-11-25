import type { Feature, PricingTier, Step } from "@/lib/types";

export interface Pack {
  key: string;
  label: string;
  name: string;
  latin: string;
  tagline: string;
  heroLead: string;
  heroAccent: string;
  subline: string;
  cta: string;
  secondaryCta: string;
  problem: string;
  promise: string;
  features: Feature[];
  steps: Step[];
  metrics: { value: string; label: string }[];
  pricing: PricingTier[];
  seo: string[];
  targetUsers: string[];
  coldStart: Step[];
  stack: string[];
  mvpScope: string;
  palette: { from: string; to: string; glow: string };
  previewTitle: string;
  previewRows: { label: string; meta: string; tag: string }[];
}

export const PACKS: Record<string, Pack> = {
  logistics: {
    key: "logistics",
    label: "物流 · 车货匹配",
    name: "拼途",
    latin: "POOLROUTE",
    tagline: "让每一段空驶，都顺路带上货。",
    heroLead: "把一辆空车，",
    heroAccent: "变成一趟顺路的订单",
    subline:
      "同时发布车源与货源，按线路、时间窗和载重智能撮合，让司机少空跑、货主少等待。",
    cta: "免费发布线路",
    secondaryCta: "看看今天有哪些顺路货",
    problem: "车找货、货找车同时发生，空驶和等货却没人撮合。",
    promise: "用顺路匹配替代漫无目的的等货，把空驶里程变成真实收入。",
    features: [
      {
        title: "顺路智能撮合",
        desc: "同城 / 跨城线路自动匹配，按时间窗、载重与顺路度排序，先看最值得接的那一单。",
        icon: "route",
      },
      {
        title: "车源货源双发布",
        desc: "司机与货主共用 30 秒表单，填写起点终点、吨位与可装时间，信息一次到位。",
        icon: "layers",
      },
      {
        title: "履约与信用保障",
        desc: "实名认证、运输保险与节点签收，每一单都有记录，纠纷有据可查。",
        icon: "shield",
      },
    ],
    steps: [
      { title: "发布线路", desc: "填起点、终点、车型或货型，30 秒完成。" },
      { title: "顺路撮合", desc: "系统把匹配度最高的车与货排到最前。" },
      { title: "确认成交", desc: "线上确认价格与时间，线下履约后可互评。" },
    ],
    metrics: [
      { value: "-32%", label: "平均空驶率" },
      { value: "9 分钟", label: "平均撮合时长" },
      { value: "12,400+", label: "已履约线路" },
    ],
    pricing: [
      {
        name: "自由版",
        price: "¥0",
        unit: "/ 永久",
        desc: "先跑通一条线路",
        perks: ["每月发布 3 条线路", "基础撮合排序", "站内消息通知"],
      },
      {
        name: "专业版",
        price: "¥199",
        unit: "/ 月",
        desc: "司机与中小货主的主力选择",
        perks: ["无限发布线路", "优先撮合与置顶", "履约保险与电子回单", "线路数据看板"],
        featured: true,
      },
      {
        name: "车队版",
        price: "¥699",
        unit: "/ 月",
        desc: "多车多人的调度协同",
        perks: ["10 个子账号", "车队调度面板", "批量导入与对接 API", "专属客户成功"],
      },
    ],
    seo: ["拼货车平台", "空闲货车找货", "同城货运拼单"],
    targetUsers: ["中小货主与电商卖家", "个体货车司机", "区域物流与车队调度"],
    coldStart: [
      { title: "只做一条线路", desc: "选广深这类高频短途线，先把单条线路的匹配密度做起来。" },
      { title: "前 100 单免费", desc: "为首批司机免费发布并补贴油卡，确保发布即有人接。" },
      { title: "把成交晒出来", desc: "在司机群与货运短视频里传播真实成交截图，形成口碑循环。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "地图路径服务（占位）", "短信通知（占位）"],
    mvpScope: "单页发布与撮合列表",
    palette: { from: "#6366f1", to: "#22d3ee", glow: "rgba(56,189,248,0.22)" },
    previewTitle: "今天的顺路线路",
    previewRows: [
      { label: "广州 → 深圳", meta: "4.2 吨 · 今天 15:00", tag: "92% 顺路" },
      { label: "佛山 → 东莞", meta: "8 吨 · 明天 09:00", tag: "87% 顺路" },
      { label: "深圳 → 惠州", meta: "2 吨 · 冷链 · 今天 18:00", tag: "81% 顺路" },
    ],
  },

  career: {
    key: "career",
    label: "求职 · AI 陪练",
    name: "面试雀",
    latin: "REHEARSE",
    tagline: "把每一次面试，练成一场可复盘的关卡。",
    heroLead: "在被面试之前，",
    heroAccent: "先和 AI 练十遍",
    subline:
      "选择目标岗位，AI 生成真实面试题并追问，实时打分、逐句反馈，练完带走一份复盘报告。",
    cta: "免费模拟一次",
    secondaryCta: "看一份复盘报告样例",
    problem: "面试能力只能靠真实机会来练，而真实机会往往只有一次。",
    promise: "把不可控的面试变成可重复的练习，让表达在开口前就已经被校准。",
    features: [
      {
        title: "岗位定向出题",
        desc: "按岗位 JD 生成行为面与专业面题目，从自我介绍到压力追问都能练。",
        icon: "target",
      },
      {
        title: "实时追问与评分",
        desc: "AI 面试官按你的回答继续深挖，从结构、证据与表达三个维度打分。",
        icon: "mic",
      },
      {
        title: "逐句复盘报告",
        desc: "标出冗余表达与缺失证据，给出可直接替换的更好说法。",
        icon: "chart",
      },
    ],
    steps: [
      { title: "选择岗位", desc: "粘贴 JD，30 秒生成专属题库。" },
      { title: "开口作答", desc: "语音或文字作答，AI 像真面试官一样追问。" },
      { title: "领取复盘", desc: "拿到分数、问题清单与改写建议。" },
    ],
    metrics: [
      { value: "+23%", label: "二面通过率提升" },
      { value: "1,800+", label: "真实岗位题库" },
      { value: "5 分钟", label: "出复盘报告" },
    ],
    pricing: [
      {
        name: "体验版",
        price: "¥0",
        unit: "/ 首场",
        desc: "先感受一次完整面试",
        perks: ["1 次完整模拟", "基础评分报告", "岗位题库预览"],
      },
      {
        name: "月度版",
        price: "¥39",
        unit: "/ 月",
        desc: "正在密集投递的求职者",
        perks: ["每周 8 场模拟", "逐句改写建议", "高频题专项训练", "复盘报告导出"],
        featured: true,
      },
      {
        name: "上岸包",
        price: "¥199",
        unit: "/ 一次性",
        desc: "关键岗位冲刺",
        perks: ["不限次模拟", "6 次真人陪练", "简历与自我介绍精修", "内推社群"],
      },
    ],
    seo: ["AI 模拟面试", "面试陪练 工具", "应届生 面试复盘"],
    targetUsers: ["应届生与转行求职者", "互联网 / 金融求职者", "高校就业指导中心"],
    coldStart: [
      { title: "先服务一个求职季", desc: "锁定秋招前的应届生群体，做一个可传播的免费模拟入口。" },
      { title: "用复盘卡做传播", desc: "生成可分享的复盘卡，天然带岗位与分数，适合晒到社交平台。" },
      { title: "和就业中心合作", desc: "以班级为单位提供批量账号，换取真实题库与口碑。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "语音识别（占位）", "LLM 评分（占位）"],
    mvpScope: "选题 → 作答 → 评分卡",
    palette: { from: "#8b5cf6", to: "#ec4899", glow: "rgba(236,72,153,0.2)" },
    previewTitle: "你的模拟面试",
    previewRows: [
      { label: "请介绍一下你最近的项目", meta: "行为面 · 高频", tag: "建议 90s" },
      { label: "为什么离开上一家公司", meta: "动机面 · 易失分", tag: "需练习" },
      { label: "如何评估需求优先级", meta: "专业面 · 产品", tag: "已掌握" },
    ],
  },

  eldercare: {
    key: "eldercare",
    label: "养老 · 陪诊服务",
    name: "陪安",
    latin: "CAREVA",
    tagline: "让父母看病这件事，有人陪、有记录。",
    heroLead: "子女不在身边时，",
    heroAccent: "也有人陪父母好好看一次病",
    subline:
      "按距离与科室经验匹配陪诊师，从接送、挂号、取报告到用药提醒全程陪同，家属远程同步进度。",
    cta: "预约一次陪诊",
    secondaryCta: "看看本周可约时段",
    problem: "老人看病流程复杂，子女异地无法陪同，医嘱与报告常常传不到位。",
    promise: "把一次看病变成可预约、可陪同、可回看的服务，让远方的子女也能安心。",
    features: [
      {
        title: "陪诊师匹配",
        desc: "按医院、科室与距离匹配有相关经验的陪诊师，可看真实评价与接单量。",
        icon: "map",
      },
      {
        title: "全流程留痕",
        desc: "挂号、就诊、检查、取药逐项打卡，关键节点上传照片与单据。",
        icon: "layers",
      },
      {
        title: "家属实时同步",
        desc: "进度与医嘱摘要同步到子女手机，重要提醒不漏接。",
        icon: "bell",
      },
    ],
    steps: [
      { title: "选医院与时间", desc: "填就诊医院、科室与期望时段。" },
      { title: "匹配陪诊师", desc: "看经验、评价与距离，确认后锁定。" },
      { title: "收到全程记录", desc: "就诊进度实时同步，结束生成小结。" },
    ],
    metrics: [
      { value: "4.9 分", label: "平均服务评分" },
      { value: "2,300+", label: "已完成陪诊" },
      { value: "100%", label: "流程节点留痕" },
    ],
    pricing: [
      {
        name: "单次陪诊",
        price: "¥199",
        unit: "/ 次",
        desc: "4 小时以内的常规门诊",
        perks: ["接送与挂号协助", "全程陪同就诊", "医嘱与用药摘要", "服务险"],
      },
      {
        name: "安心包",
        price: "¥599",
        unit: "/ 3 次",
        desc: "复诊与检查较多的家庭",
        perks: ["3 次陪诊额度", "固定陪诊师优先", "报告整理归档", "子女端实时同步"],
        featured: true,
      },
      {
        name: "机构版",
        price: "定制",
        unit: "",
        desc: "社区养老与保险机构",
        perks: ["批量预约与排班", "服务数据看板", "对接社区工单", "专属服务经理"],
      },
    ],
    seo: ["老人陪诊服务", "上门陪诊预约", "医院陪诊平台"],
    targetUsers: ["异地工作的子女", "独居与空巢老人家庭", "社区养老服务机构"],
    coldStart: [
      { title: "先锁定一家医院", desc: "选当地就诊量最大的三甲医院，把陪诊师供给做密。" },
      { title: "与社区养老站合作", desc: "借社区渠道触达老人家庭，用真实服务建立信任。" },
      { title: "让子女远程下单", desc: "把下单入口做成子女可远程操作的页面，天然跨城传播。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "实名认证（占位）", "短信通知（占位）"],
    mvpScope: "选医院 → 匹配陪诊师 → 预约确认",
    palette: { from: "#34d399", to: "#38bdf8", glow: "rgba(52,211,153,0.18)" },
    previewTitle: "本周可预约",
    previewRows: [
      { label: "市一医院 · 心内科", meta: "周三 09:00 · 陪诊师 王姐", tag: "可预约" },
      { label: "中山医院 · 骨科复诊", meta: "周四 14:00 · 陪诊师 李叔", tag: "剩 1 位" },
      { label: "社区医院 · 常规体检", meta: "周五 08:30 · 陪诊师 小陈", tag: "可预约" },
    ],
  },

  pet: {
    key: "pet",
    label: "社区 · 宠物寄养",
    name: "邻家毛孩",
    latin: "PAWPAL",
    tagline: "出差时，让隔壁的养宠人帮你照看毛孩子。",
    heroLead: "不必送去陌生寄养店，",
    heroAccent: "邻居家也能安心托付",
    subline:
      "基于社区距离与养宠经验匹配寄养家庭，每天视频回传、打卡记录，双向评价让托付更放心。",
    cta: "找附近的寄养家庭",
    secondaryCta: "成为寄养家庭",
    problem: "寄养店笼位紧张又陌生，熟人托付却不好意思开口。",
    promise: "用邻里信任和透明记录，把寄养从交易变成一次安心的照看。",
    features: [
      {
        title: "邻里距离匹配",
        desc: "优先推荐同小区 3 公里内、有同体型宠物的家庭，接送只要十分钟。",
        icon: "map",
      },
      {
        title: "每日视频回传",
        desc: "吃饭、遛弯、睡觉定时打卡，主人随时能看到今天的真实状态。",
        icon: "bell",
      },
      {
        title: "双向评价与保障",
        desc: "寄养双方实名认证，平台提供责任险与异常处理流程。",
        icon: "shield",
      },
    ],
    steps: [
      { title: "填宠物档案", desc: "品种、性格、忌口与用药，一次填完长期复用。" },
      { title: "选一个邻居", desc: "看距离、评价与家庭环境，直接发预订。" },
      { title: "每天收到回传", desc: "视频打卡与健康记录，回家还给一份小结。" },
    ],
    metrics: [
      { value: "8 分钟", label: "平均响应时间" },
      { value: "61%", label: "复购托付率" },
      { value: "100%", label: "每日视频回传" },
    ],
    pricing: [
      {
        name: "找寄养",
        price: "¥0",
        unit: "/ 平台费",
        desc: "只按寄养家庭报价支付",
        perks: ["浏览附近家庭", "平台担保交易", "基础责任险"],
      },
      {
        name: "安心包",
        price: "¥19",
        unit: "/ 次",
        desc: "第一次托付的额外保障",
        perks: ["升级责任险额度", "每日视频精选", "24 小时客服响应"],
        featured: true,
      },
      {
        name: "寄养主会员",
        price: "¥29",
        unit: "/ 月",
        desc: "长期开放家庭的邻里",
        perks: ["优先展示", "排期日历", "收入结算看板"],
      },
    ],
    seo: ["社区宠物寄养", "附近宠物代养", "上门喂猫 平台"],
    targetUsers: ["一二线城市养宠家庭", "经常出差的年轻上班族", "有经验的社区养宠人"],
    coldStart: [
      { title: "从一个大社区开始", desc: "选一个养宠密度高的小区，做到 20 个家庭互助即可自转。" },
      { title: "先做免费互助", desc: "前期不收平台费，用真实回传视频建立信任。" },
      { title: "让寄养主带新", desc: "寄养主每邀请一位邻居，获得一次服务费减免。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "对象存储（占位）", "实名认证（占位）"],
    mvpScope: "匹配列表 + 预订确认",
    palette: { from: "#f59e0b", to: "#fb7185", glow: "rgba(251,113,133,0.2)" },
    previewTitle: "附近的寄养家庭",
    previewRows: [
      { label: "林小姐 · 3 公里", meta: "养猫 2 年 · 可接 5 天", tag: "4.9 分" },
      { label: "陈先生 · 1.2 公里", meta: "有院子 · 可接大型犬", tag: "4.8 分" },
      { label: "阿紫 · 同小区", meta: "居家办公 · 全天陪伴", tag: "5.0 分" },
    ],
  },

  food: {
    key: "food",
    label: "本地生活 · 小店订阅",
    name: "街角",
    latin: "CORNER",
    tagline: "把常去的那家小店，装进一份每周订阅。",
    heroLead: "一杯咖啡的距离，",
    heroAccent: "重新认识你的街区",
    subline:
      "精选步行可达的独立小店，按周订阅自提或配送，用固定预算换来每天的小惊喜。",
    cta: "订阅我的街区",
    secondaryCta: "先看看这周的组合",
    problem: "好小店缺稳定客流，附近的人却每天在连锁店排队。",
    promise: "用订阅把偶发的到店变成稳定的复购，让街区生意被看见。",
    features: [
      {
        title: "街区精选",
        desc: "只收录步行 10 分钟内的独立小店，每周由主理人更新组合。",
        icon: "map",
      },
      {
        title: "按周订阅",
        desc: "一杯咖啡、一份早餐或一次甜品，随时暂停，不用买券囤卡。",
        icon: "calendar",
      },
      {
        title: "主理人故事",
        desc: "每份订阅附一张手写卡，讲清楚这周是谁、用什么、为什么这样做。",
        icon: "heart",
      },
    ],
    steps: [
      { title: "选一条街", desc: "定位或输入常活动的街区。" },
      { title: "挑一份订阅", desc: "咖啡、早餐或甜品，按周起订。" },
      { title: "每天去自提", desc: "到店扫码，主理人已经为你准备好。" },
    ],
    metrics: [
      { value: "3.4 倍", label: "小店周复购提升" },
      { value: "10 分钟", label: "限定步行范围" },
      { value: "42 家", label: "首批签约小店" },
    ],
    pricing: [
      {
        name: "尝鲜周卡",
        price: "¥39",
        unit: "/ 周",
        desc: "先试一条街",
        perks: ["5 杯咖啡或 3 份早餐", "随时暂停", "到店自提"],
      },
      {
        name: "街区月卡",
        price: "¥129",
        unit: "/ 月",
        desc: "把常去变成日常",
        perks: ["20 次自提权益", "每周主理人组合", "会员日限定单品", "可转赠 3 次"],
        featured: true,
      },
      {
        name: "小店合作",
        price: "¥299",
        unit: "/ 月",
        desc: "给独立主理人",
        perks: ["订阅商品上架", "客流与复购看板", "主理人故事位", "结算 T+7"],
      },
    ],
    seo: ["街区咖啡订阅", "附近独立咖啡馆", "本地小店 月卡"],
    targetUsers: ["街区周边的上班族", "独立咖啡与烘焙主理人", "社区商业运营方"],
    coldStart: [
      { title: "一条街先跑通", desc: "选一条咖啡密度高的街，签约 5 家店做联名周卡。" },
      { title: "让主理人自己卖", desc: "给每家店专属二维码，卖出的订阅按比例分成。" },
      { title: "每周做一次线下", desc: "周五在街口办一次快闪试饮，把线上订阅带回线下。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "微信支付（占位）", "核销码（占位）"],
    mvpScope: "街区列表 + 订阅选择",
    palette: { from: "#f59e0b", to: "#84cc16", glow: "rgba(132,204,22,0.18)" },
    previewTitle: "本周的街区组合",
    previewRows: [
      { label: "山丘咖啡 · 手冲", meta: "步行 4 分钟 · 周一至周五", tag: "本周上新" },
      { label: "麦田面包 · 可颂", meta: "步行 7 分钟 · 每日 8 点出炉", tag: "还剩 12 份" },
      { label: "小院甜品 · 巴斯克", meta: "步行 9 分钟 · 周三限定", tag: "会员专享" },
    ],
  },

  edu: {
    key: "edu",
    label: "教育 · 微学习",
    name: "知径",
    latin: "PATHLY",
    tagline: "每天 20 分钟，把想学的东西学成。",
    heroLead: "不用等有大块时间，",
    heroAccent: "20 分钟也能学会一件事",
    subline:
      "把一个大目标拆成每日微课与练习，配一位学习搭子互相打卡，学完就有一份可展示的成果。",
    cta: "生成我的学习路径",
    secondaryCta: "看一条路径样例",
    problem: "想学的东西很多，能坚持下来的路径却没人帮你拆。",
    promise: "把模糊的「我想学」变成每天可完成的 20 分钟，并留下可展示的成果。",
    features: [
      {
        title: "目标拆解",
        desc: "输入目标与可投入时间，自动拆成 4 周、每天 20 分钟的路径。",
        icon: "target",
      },
      {
        title: "微课与练习",
        desc: "每个知识点配一段讲解和一次即时练习，学完马上验证。",
        icon: "layers",
      },
      {
        title: "学习搭子",
        desc: "匹配同目标的学习伙伴，打卡互为提醒，掉队会被温和拉回。",
        icon: "users",
      },
    ],
    steps: [
      { title: "说出目标", desc: "想学会什么、每周能投入多久。" },
      { title: "拿到路径", desc: "每天一课一练，进度可视化。" },
      { title: "交付成果", desc: "四周后产出一个可展示的作品。" },
    ],
    metrics: [
      { value: "68%", label: "四周完课率" },
      { value: "20 分钟", label: "单日学习时长" },
      { value: "4 周", label: "一条路径周期" },
    ],
    pricing: [
      {
        name: "体验路径",
        price: "¥0",
        unit: "/ 首条",
        desc: "先学完一条试试",
        perks: ["一条 7 天路径", "每日练习", "进度记录"],
      },
      {
        name: "月度学习",
        price: "¥59",
        unit: "/ 月",
        desc: "持续学习的人",
        perks: ["不限路径", "学习搭子匹配", "成果点评", "完课证书"],
        featured: true,
      },
      {
        name: "团队共学",
        price: "¥299",
        unit: "/ 月",
        desc: "小团队一起学",
        perks: ["10 个席位", "共学看板", "定制路径", "结营报告"],
      },
    ],
    seo: ["碎片时间学习", "学习路径规划", "AI 学习搭子"],
    targetUsers: ["想转行的职场人", "在校大学生", "做内部培训的团队负责人"],
    coldStart: [
      { title: "只做一条路径", desc: "选一个高需求目标，如「四周入门数据分析」，做到口碑级完课率。" },
      { title: "用成果换传播", desc: "每个学员结营都有可展示作品，作品页自带分享。" },
      { title: "搭子成对拉新", desc: "邀请一位搭子，双方各得一条新路径。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "内容 CMS（占位）", "提醒推送（占位）"],
    mvpScope: "目标 → 路径 → 每日打卡",
    palette: { from: "#0ea5e9", to: "#8b5cf6", glow: "rgba(14,165,233,0.2)" },
    previewTitle: "你的四周路径",
    previewRows: [
      { label: "第 1 周 · 建立地图", meta: "5 课 · 已学 3 课", tag: "进行中" },
      { label: "第 2 周 · 动手做", meta: "4 课 · 1 个项目", tag: "待解锁" },
      { label: "第 3 周 · 查漏补缺", meta: "3 课 · 1 次测验", tag: "待解锁" },
    ],
  },

  ai: {
    key: "ai",
    label: "效率工具 · 工作流",
    name: "织流",
    latin: "WEAVEFLOW",
    tagline: "把散落在聊天里的工作，收进一条自动流。",
    heroLead: "一句话描述你的活儿，",
    heroAccent: "剩下的交给自动流",
    subline:
      "用自然语言创建可运行的自动化流程，连接消息、表格与文档，每一步都能追溯、可回滚。",
    cta: "创建第一条自动流",
    secondaryCta: "看看别人怎么用",
    problem: "团队的工作散落在聊天、表格和文档里，重复搬运消耗了真正的时间。",
    promise: "让重复工作自动跑，人只处理需要判断的那一步。",
    features: [
      {
        title: "一句话建流程",
        desc: "描述「每天把群里的日报汇总到表格」，自动生成可运行的步骤。",
        icon: "sparkles",
      },
      {
        title: "多源连接",
        desc: "消息、邮件、表格、文档与 Webhook 统一接入，无需写代码。",
        icon: "layers",
      },
      {
        title: "可审计运行",
        desc: "每次执行都有日志与重跑入口，异常自动通知到负责人。",
        icon: "shield",
      },
    ],
    steps: [
      { title: "描述流程", desc: "用一句话说清触发条件和想要的结果。" },
      { title: "确认步骤", desc: "系统生成步骤，你只调整需要判断的节点。" },
      { title: "自动运行", desc: "按计划执行，异常通知，日志可查。" },
    ],
    metrics: [
      { value: "6.5 小时", label: "人均每周节省" },
      { value: "0 代码", label: "创建门槛" },
      { value: "99.2%", label: "运行成功率" },
    ],
    pricing: [
      {
        name: "个人版",
        price: "¥0",
        unit: "/ 月",
        desc: "先自动化三件事",
        perks: ["3 条自动流", "每月 500 次执行", "基础连接器"],
      },
      {
        name: "团队版",
        price: "¥99",
        unit: "/ 人 / 月",
        desc: "让团队一起省时间",
        perks: ["不限自动流", "每月 2 万次执行", "全部连接器", "运行看板与告警"],
        featured: true,
      },
      {
        name: "企业版",
        price: "定制",
        unit: "",
        desc: "有合规与集成要求的团队",
        perks: ["私有部署", "SSO 与审计", "专属连接器", "SLA 支持"],
      },
    ],
    seo: ["工作流自动化工具", "一句话 搭建 流程", "团队效率 自动化"],
    targetUsers: ["5-50 人的创业团队", "运营与行政岗", "需要合规审计的中大型公司"],
    coldStart: [
      { title: "做三个高频模板", desc: "日报汇总、线索分配、周报生成，先让用户十分钟内见到效果。" },
      { title: "在社群做挑战", desc: "发起「一句话自动化」挑战，用真实截图传播。" },
      { title: "从团队内扩散", desc: "一个人用起来后邀请同组人，按席位自然扩容。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "任务队列（占位）", "第三方连接器（占位）"],
    mvpScope: "一句话 → 步骤确认 → 运行日志",
    palette: { from: "#8b5cf6", to: "#2dd4bf", glow: "rgba(45,212,191,0.18)" },
    previewTitle: "正在运行的自动流",
    previewRows: [
      { label: "群消息 → 每日摘要", meta: "每天 19:00 · 飞书群", tag: "运行中" },
      { label: "表单线索 → 分配销售", meta: "实时触发 · 表格", tag: "运行中" },
      { label: "周报 → 文档归档", meta: "每周五 18:00", tag: "待运行" },
    ],
  },

  commerce: {
    key: "commerce",
    label: "电商 · 二手交易",
    name: "换物所",
    latin: "SWAPLAB",
    tagline: "让闲置流动起来，用交换代替购买。",
    heroLead: "不一定要买新的，",
    heroAccent: "你的闲置正好是别人的需要",
    subline:
      "按品类与距离匹配可交换的闲置，支持差价补款与信用评价，让家里的东西重新流动。",
    cta: "发布一件闲置",
    secondaryCta: "先逛逛附近的物品",
    problem: "闲置卖不掉、扔掉可惜，二手交易又要反复砍价与扯皮。",
    promise: "用交换加差价的方式，让闲置以最低摩擦换到真正需要的人手里。",
    features: [
      {
        title: "闲置智能匹配",
        desc: "按品类、成色和距离推荐可换对象，直接看到双方差价。",
        icon: "search",
      },
      {
        title: "差价与担保",
        desc: "平台托管差价与物流，确认收货后自动结算，减少扯皮。",
        icon: "wallet",
      },
      {
        title: "信用与成色档案",
        desc: "每件物品有固定拍摄位与成色标签，评价沉淀成可查档案。",
        icon: "shield",
      },
    ],
    steps: [
      { title: "发布闲置", desc: "拍三张照片，选品类与成色。" },
      { title: "找到互换", desc: "系统推荐可换物品与差价方案。" },
      { title: "收货评价", desc: "确认收货后互评，信用累积。" },
    ],
    metrics: [
      { value: "37%", label: "平均成交周期缩短" },
      { value: "2.3 万", label: "已完成互换" },
      { value: "¥0", label: "发布成本" },
    ],
    pricing: [
      {
        name: "自由换",
        price: "¥0",
        unit: "/ 发布",
        desc: "个人闲置互换",
        perks: ["无限发布", "基础匹配", "平台担保交易"],
      },
      {
        name: "优选会员",
        price: "¥19",
        unit: "/ 月",
        desc: "闲置较多的活跃用户",
        perks: ["优先推荐", "上门取件 2 次", "成色拍摄指导", "专属客服"],
        featured: true,
      },
      {
        name: "商家寄售",
        price: "¥99",
        unit: "/ 月",
        desc: "二手商家与买手店",
        perks: ["批量上架", "寄售结算", "数据看板", "流量位"],
      },
    ],
    seo: ["闲置交换平台", "附近二手互换", "以物换物 App"],
    targetUsers: ["租房与搬家的年轻人", "母婴与数码闲置卖家", "社区二手买手店"],
    coldStart: [
      { title: "从一个品类切入", desc: "先做闲置数码或母婴，成交流转最快、信任成本最低。" },
      { title: "社区自提点", desc: "和便利店合作做自提与验机点，解决信任问题。" },
      { title: "晒置换前后", desc: "鼓励用户发布置换前后对比，用真实故事带新。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "支付托管（占位）", "物流接口（占位）"],
    mvpScope: "发布 → 匹配 → 互换确认",
    palette: { from: "#22c55e", to: "#6366f1", glow: "rgba(34,197,94,0.18)" },
    previewTitle: "附近可换的闲置",
    previewRows: [
      { label: "iPad Air 5 · 95 新", meta: "1.4 公里 · 想换相机", tag: "可补差价" },
      { label: "婴儿推车 · 9 新", meta: "2.1 公里 · 想换餐椅", tag: "同城自提" },
      { label: "公路车 · 85 新", meta: "3.6 公里 · 想换滑板", tag: "需验车" },
    ],
  },

  social: {
    key: "social",
    label: "社交 · 同频活动",
    name: "同频",
    latin: "RESONATE",
    tagline: "按兴趣和距离，找到今晚就能见面的人。",
    heroLead: "不用等一场大会，",
    heroAccent: "今晚就能和同频的人见面",
    subline:
      "基于兴趣标签与 3 公里范围，帮你组一场 6 人以内的小活动，聊得来再继续。",
    cta: "找今晚的活动",
    secondaryCta: "发起一场小聚",
    problem: "城市里人很多，真正能聊到一起的场合却很少。",
    promise: "用兴趣和距离做筛选，把泛泛的社交换成有内容的小规模见面。",
    features: [
      {
        title: "兴趣 × 距离匹配",
        desc: "同时看兴趣标签与步行距离，优先推荐真的能见到的人。",
        icon: "map",
      },
      {
        title: "6 人小规模",
        desc: "限制单场人数，人人有发言时间，避免变成大型尬聊。",
        icon: "users",
      },
      {
        title: "活动后轻连接",
        desc: "活动结束才解锁联系方式，双方都愿意才继续聊。",
        icon: "heart",
      },
    ],
    steps: [
      { title: "选兴趣", desc: "选 3 个想一起做的事。" },
      { title: "加入小聚", desc: "看时间地点与已报名的人。" },
      { title: "见面再连接", desc: "活动后双向同意才交换联系方式。" },
    ],
    metrics: [
      { value: "6 人", label: "单场上限" },
      { value: "3 公里", label: "推荐范围" },
      { value: "74%", label: "活动后二次见面率" },
    ],
    pricing: [
      {
        name: "参与",
        price: "¥0",
        unit: "/ 基础",
        desc: "先参加一次",
        perks: ["浏览附近活动", "报名 2 场 / 月", "活动后连接"],
      },
      {
        name: "组织者",
        price: "¥49",
        unit: "/ 月",
        desc: "想持续发起的人",
        perks: ["不限发起场次", "报名管理", "活动模板", "优先推荐位"],
        featured: true,
      },
      {
        name: "空间合作",
        price: "定制",
        unit: "",
        desc: "咖啡馆与共享空间",
        perks: ["场地露出", "活动排期", "到场数据", "联合品牌"],
      },
    ],
    seo: ["同城兴趣小聚", "附近活动 找人", "6 人小局 社交"],
    targetUsers: ["刚搬到新城市的年轻人", "兴趣社群组织者", "独立咖啡馆与共享空间"],
    coldStart: [
      { title: "先做一种兴趣", desc: "锁定「城市徒步」或「桌游」，把一类活动的供给做密。" },
      { title: "培养 20 个组织者", desc: "给组织者免费场地与工具，让他们持续开场。" },
      { title: "用活动照片传播", desc: "每场活动产出可分享的合影页，报名入口就在页面里。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "地图定位（占位）", "消息通知（占位）"],
    mvpScope: "兴趣选择 → 活动列表 → 报名",
    palette: { from: "#ec4899", to: "#8b5cf6", glow: "rgba(236,72,153,0.2)" },
    previewTitle: "附近的今晚",
    previewRows: [
      { label: "城市夜走 · 滨江线", meta: "今天 19:30 · 1.8 公里", tag: "剩 2 位" },
      { label: "桌游 · 轻策专场", meta: "今天 20:00 · 900 米", tag: "剩 3 位" },
      { label: "胶片摄影散步", meta: "明天 16:00 · 2.4 公里", tag: "报名中" },
    ],
  },

  health: {
    key: "health",
    label: "健康 · 轻健身",
    name: "轻练",
    latin: "LITEFIT",
    tagline: "10 分钟也能练，把坚持变成一件轻的事。",
    heroLead: "不必等有整块时间，",
    heroAccent: "10 分钟也算一次训练",
    subline:
      "根据今天的体力和场地生成 10 分钟训练，配合呼吸与恢复提醒，让运动不再靠意志力。",
    cta: "生成今天的一练",
    secondaryCta: "看看 10 分钟能练什么",
    problem: "健身计划普遍按小时设计，而多数人每天只剩下零碎的十分钟。",
    promise: "把训练压缩到真实可执行的长度，用可持续替代高强度。",
    features: [
      {
        title: "今日体力评估",
        desc: "用 3 个问题判断状态，自动调整强度与动作。",
        icon: "heart",
      },
      {
        title: "10 分钟训练",
        desc: "无需器械、居家可做，跟练即可，动作细节有提示。",
        icon: "clock",
      },
      {
        title: "恢复与提醒",
        desc: "根据睡眠与训练记录提醒休息，避免过度训练。",
        icon: "bell",
      },
    ],
    steps: [
      { title: "评估状态", desc: "回答 3 个问题，30 秒完成。" },
      { title: "跟练 10 分钟", desc: "按节奏跟练，动作有实时提示。" },
      { title: "记录恢复", desc: "自动记录并给出明日建议。" },
    ],
    metrics: [
      { value: "10 分钟", label: "单次训练时长" },
      { value: "72%", label: "7 日留存" },
      { value: "31 天", label: "平均连续打卡" },
    ],
    pricing: [
      {
        name: "体验",
        price: "¥0",
        unit: "/ 永久",
        desc: "先练一周",
        perks: ["每日 1 次训练", "基础动作库", "恢复提醒"],
      },
      {
        name: "月度",
        price: "¥29",
        unit: "/ 月",
        desc: "想稳定练下去",
        perks: ["不限训练", "个性化计划", "体态评估", "离线跟练"],
        featured: true,
      },
      {
        name: "陪伴计划",
        price: "¥199",
        unit: "/ 月",
        desc: "需要人来盯一下",
        perks: ["教练周复盘", "饮食建议", "社群打卡", "1 对 1 调整"],
      },
    ],
    seo: ["10 分钟居家训练", "碎片时间健身", "轻量健身 App"],
    targetUsers: ["久坐的上班族", "产后恢复人群", "刚开始运动的初学者"],
    coldStart: [
      { title: "只做 10 分钟", desc: "用一个极短训练建立「今天也练了」的正反馈。" },
      { title: "7 天挑战", desc: "做可分享的连续打卡卡片，让坚持被看见。" },
      { title: "和公司福利合作", desc: "以团队健康 package 切入企业，降低获客成本。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "动作视频 CDN（占位）", "健康数据接入（占位）"],
    mvpScope: "状态评估 → 今日训练 → 打卡",
    palette: { from: "#14b8a6", to: "#8b5cf6", glow: "rgba(20,184,166,0.18)" },
    previewTitle: "今天的训练",
    previewRows: [
      { label: "肩颈放松 · 8 分钟", meta: "无器械 · 低强度", tag: "适合今天" },
      { label: "核心激活 · 10 分钟", meta: "瑜伽垫 · 中强度", tag: "推荐" },
      { label: "睡前拉伸 · 6 分钟", meta: "无器械 · 低强度", tag: "睡前" },
    ],
  },

  generic: {
    key: "generic",
    label: "通用 · 新想法",
    name: "起点",
    latin: "ORIGIN",
    tagline: "从一个想法，到一次真实的上线。",
    heroLead: "先做出第一版，",
    heroAccent: "再让它自己生长",
    subline:
      "把想法收敛成一个可点击的最小版本，先验证真实需求，再逐步补齐能力。",
    cta: "加入首批体验",
    secondaryCta: "查看产品说明",
    problem: "想法停留在描述里，没人能真正点开试一试。",
    promise: "用最小可用的产品把假设变成可验证的体验。",
    features: [
      {
        title: "一分钟上手",
        desc: "打开就能完成第一个动作，不需要教程与配置。",
        icon: "zap",
      },
      {
        title: "围绕真实任务",
        desc: "每个功能都对应一个具体任务，不做无用的装饰。",
        icon: "target",
      },
      {
        title: "数据可见",
        desc: "关键动作都有记录，方便快速判断是否值得继续。",
        icon: "chart",
      },
    ],
    steps: [
      { title: "描述需求", desc: "用一句话说清你要解决的问题。" },
      { title: "完成第一个动作", desc: "在页面上直接操作，立即得到反馈。" },
      { title: "留下反馈", desc: "告诉我们哪一步最有用，继续迭代。" },
    ],
    metrics: [
      { value: "3 分钟", label: "完成首次体验" },
      { value: "1 页", label: "最小闭环" },
      { value: "0 成本", label: "开始试用" },
    ],
    pricing: [
      {
        name: "体验版",
        price: "¥0",
        unit: "/ 永久",
        desc: "先跑通一次",
        perks: ["核心功能体验", "基础数据记录", "社区支持"],
      },
      {
        name: "进阶版",
        price: "¥49",
        unit: "/ 月",
        desc: "持续使用的个人",
        perks: ["不限使用次数", "高级能力", "数据导出", "优先支持"],
        featured: true,
      },
      {
        name: "团队版",
        price: "¥199",
        unit: "/ 月",
        desc: "一起用的小团队",
        perks: ["10 个席位", "协作空间", "管理后台", "专属顾问"],
      },
    ],
    seo: ["新想法 快速验证", "最小可用产品 工具", "创业 MVP 模板"],
    targetUsers: ["早期创业者", "产品与运营从业者", "独立开发者"],
    coldStart: [
      { title: "先找 10 个真实用户", desc: "一对一交付，观察他们在哪一步卡住。" },
      { title: "公开构建过程", desc: "把每天的迭代发出来，让关注者跟着一起长。" },
      { title: "用一个场景做样板", desc: "把一个成功案例讲透，比讲十个功能更有说服力。" },
    ],
    stack: ["Next.js", "Tailwind CSS", "Mock 数据层", "可替换 LLM 接口"],
    mvpScope: "单页可点击闭环",
    palette: { from: "#8b5cf6", to: "#3b82f6", glow: "rgba(139,92,246,0.2)" },
    previewTitle: "你的第一版",
    previewRows: [
      { label: "创建第一个任务", meta: "约 1 分钟", tag: "开始" },
      { label: "查看实时反馈", meta: "自动生成", tag: "演示" },
      { label: "邀请同伴体验", meta: "分享链接", tag: "推荐" },
    ],
  },
};

const RULES: { key: keyof typeof PACKS; words: string[] }[] = [
  { key: "logistics", words: ["货车", "货运", "物流", "运输", "司机", "车源", "货源", "拼货", "干线", "同城配送", "冷链"] },
  { key: "career", words: ["简历", "面试", "求职", "招聘", "岗位", "应届", "转行", "职业"] },
  {
    key: "eldercare",
    words: ["老人", "养老", "陪诊", "长者", "适老", "护理", "居家照护", "看病", "陪护", "上门服务"],
  },
  { key: "pet", words: ["宠物", "猫", "狗", "寄养", "毛孩", "铲屎", "遛狗", "喂猫"] },
  { key: "food", words: ["咖啡", "餐饮", "餐厅", "烘焙", "面包", "小店", "外卖", "奶茶", "街角"] },
  { key: "edu", words: ["学习", "课程", "教育", "培训", "知识", "备考", "上课", "教学"] },
  { key: "health", words: ["健身", "健康", "运动", "减脂", "瑜伽", "跑步", "康复", "睡眠"] },
  { key: "commerce", words: ["电商", "二手", "闲置", "买卖", "商品", "交易", "换物", "店铺"] },
  { key: "social", words: ["社交", "社区", "活动", "交友", "同城", "小聚", "兴趣", "约"] },
  { key: "ai", words: ["AI", "ai", "智能", "自动化", "效率", "工具", "SaaS", "工作流", "助手", "模型"] },
];

export function classify(idea: string): Pack {
  const text = idea.toLowerCase();
  let best: { key: keyof typeof PACKS; score: number } | null = null;
  for (const rule of RULES) {
    let score = 0;
    for (const w of rule.words) {
      if (text.includes(w.toLowerCase())) score += w.length > 1 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { key: rule.key, score };
    }
  }
  return PACKS[best?.key ?? "generic"];
}

export function shortIdea(idea: string, max = 46): string {
  const clean = idea.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}
