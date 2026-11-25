export type AgentId = "pm" | "dev" | "ops";

export interface AgentMeta {
  id: AgentId;
  name: string;
  title: string;
  focus: string;
  accent: string;
}

export interface FlowNode {
  id: string;
  title: string;
  agent: AgentId;
  deliverable: string;
  brief: string;
}

export interface ProjectNode {
  id: string;
  title: string;
  agent: AgentId;
  status: "pending" | "active" | "done";
  lines: string[];
  detail?: string;
}

export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export interface PricingTier {
  name: string;
  price: string;
  unit: string;
  desc: string;
  perks: string[];
  featured?: boolean;
}

export interface Step {
  title: string;
  desc: string;
}

export interface BusinessPlan {
  name: string;
  latin: string;
  tagline: string;
  summary: string;
  problem: string;
  promise: string;
  features: Feature[];
  pricing: PricingTier[];
  targetUsers: string[];
  seo: string[];
  coldStart: Step[];
  stack: string[];
  mvpScope: string;
}

export interface Artifact {
  landingHtml: string;
  plan: BusinessPlan;
  generatedAt: number;
  handoffs: { from: AgentId; to: AgentId; note: string }[];
}

export type ProjectStatus = "running" | "done" | "error";

export interface Project {
  id: string;
  idea: string;
  name: string;
  latin: string;
  tagline: string;
  createdAt: number;
  updatedAt: number;
  status: ProjectStatus;
  nodes: ProjectNode[];
  artifact?: Artifact;
}

export interface AgentEvent {
  type:
    | "meta"
    | "node:start"
    | "node:line"
    | "node:done"
    | "artifact"
    | "done"
    | "error";
  index?: number;
  nodeId?: string;
  title?: string;
  agent?: AgentId;
  line?: string;
  detail?: string;
  name?: string;
  latin?: string;
  tagline?: string;
  artifact?: Artifact;
  message?: string;
}

export type MvpAccent = "violet" | "cyan" | "emerald" | "amber" | "rose";

export interface MvpPatch {
  accent?: MvpAccent;
  headline?: string;
  ctaLabel?: string;
  density?: "compact" | "full";
  banner?: string;
  hide?: ("stats" | "steps" | "faq" | "reviews")[];
  show?: ("stats" | "steps" | "faq" | "reviews")[];
}

export interface MvpDraft {
  slug: string;
  patch: MvpPatch;
  log: { id: string; prompt: string; reply: string; changes: string[]; at: number }[];
  updatedAt: number;
}
