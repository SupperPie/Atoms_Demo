import type { MvpDraft, Project } from "@/lib/types";

const PROJECT_KEY = "atoms-mini:projects:v1";
const MVP_KEY = "atoms-mini:mvp:v1";
const MVP_STATE_KEY = "atoms-mini:mvp-state:v1";
const LIMIT = 24;

function canUse(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJSON<T>(key: string, fallback: T): T {
  if (!canUse()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!canUse()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 存储配额已满时静默失败，演示不中断
  }
}

export function newId(prefix = "p"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function getProjects(): Project[] {
  const list = readJSON<Project[]>(PROJECT_KEY, []);
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProject(id: string): Project | null {
  return getProjects().find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): Project {
  const list = getProjects().filter((p) => p.id !== project.id);
  const next = [{ ...project, updatedAt: Date.now() }, ...list].slice(0, LIMIT);
  writeJSON(PROJECT_KEY, next);
  return next[0];
}

export function removeProject(id: string) {
  const next = getProjects().filter((p) => p.id !== id);
  writeJSON(PROJECT_KEY, next);
}

export function createProject(idea: string, seed: { name: string; latin: string; tagline: string }): Project {
  const now = Date.now();
  return {
    id: newId(),
    idea: idea.trim(),
    name: seed.name,
    latin: seed.latin,
    tagline: seed.tagline,
    createdAt: now,
    updatedAt: now,
    status: "running",
    nodes: [],
  };
}

export function getDraft(slug: string): MvpDraft | null {
  const map = readJSON<Record<string, MvpDraft>>(MVP_KEY, {});
  return map[slug] ?? null;
}

export function saveDraft(draft: MvpDraft): MvpDraft {
  const map = readJSON<Record<string, MvpDraft>>(MVP_KEY, {});
  map[draft.slug] = { ...draft, updatedAt: Date.now() };
  writeJSON(MVP_KEY, map);
  return draft;
}

export function getMvpState<T>(slug: string): T | null {
  const map = readJSON<Record<string, T>>(MVP_STATE_KEY, {});
  return map[slug] ?? null;
}

export function saveMvpState<T>(slug: string, value: T) {
  const map = readJSON<Record<string, T>>(MVP_STATE_KEY, {});
  map[slug] = value;
  writeJSON(MVP_STATE_KEY, map);
}
