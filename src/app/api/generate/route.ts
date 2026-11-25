import { generate } from "@/lib/generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let idea = "";
  let resumeFrom = 0;

  try {
    const body = (await req.json()) as { idea?: unknown; resumeFrom?: unknown };
    idea = typeof body.idea === "string" ? body.idea : "";
    resumeFrom =
      typeof body.resumeFrom === "number" && Number.isFinite(body.resumeFrom)
        ? Math.max(0, Math.floor(body.resumeFrom))
        : 0;
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (payload: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        controller.enqueue(encoder.encode(": connected\n\n"));
        for await (const event of generate(idea, { resumeFrom })) {
          if (req.signal.aborted) {
            closed = true;
            break;
          }
          send(event);
        }
      } catch {
        send({ type: "error", message: "生成过程中断，请重新运行这条流水线。" });
      } finally {
        if (!closed) {
          try {
            controller.close();
          } catch {
            // 客户端已提前断开
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
