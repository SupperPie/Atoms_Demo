import { refine } from "@/lib/refine";
import type { MvpPatch } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  let message = "";
  let patch: MvpPatch = {};

  try {
    const body = (await req.json()) as { message?: unknown; patch?: unknown };
    message = typeof body.message === "string" ? body.message : "";
    patch = body.patch && typeof body.patch === "object" ? (body.patch as MvpPatch) : {};
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  // 模拟研发 Agent 读取指令并改写页面的耗时
  await sleep(900 + Math.round(Math.random() * 600));

  const result = refine(message, patch);
  return Response.json({
    ...result,
    agent: "dev",
    at: Date.now(),
  });
}
