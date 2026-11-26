export interface LlmMessage {
  role: "system" | "user";
  content: string;
}

interface CompleteOptions {
  model?: string;
  signal?: AbortSignal;
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

/** 是否配置了真实模型；未配置时生成器走本地 mock 兜底。 */
export function llmEnabled(): boolean {
  return Boolean(process.env.LLM_API_KEY?.trim());
}

function resolveConfig(model?: string) {
  const baseUrl = (process.env.LLM_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const apiKey = process.env.LLM_API_KEY?.trim();
  if (!apiKey) throw new Error("未配置 LLM_API_KEY");
  return {
    endpoint: `${baseUrl}/chat/completions`,
    apiKey,
    model: model?.trim() || process.env.LLM_MODEL?.trim() || DEFAULT_MODEL,
  };
}

function errorText(status: number, body: string): string {
  const detail = body.replace(/\s+/g, " ").slice(0, 200);
  return `模型服务返回 ${status}${detail ? `：${detail}` : ""}`;
}

function post(
  endpoint: string,
  apiKey: string,
  payload: Record<string, unknown>,
  signal: AbortSignal,
): Promise<Response> {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal,
    cache: "no-store",
  });
}

/**
 * 调用 OpenAI 兼容的 chat completions 接口，返回纯文本内容。
 * 兼容 DeepSeek / 豆包 / 通义等任意 OpenAI 协议网关。
 */
export async function complete(
  messages: LlmMessage[],
  options: CompleteOptions = {},
): Promise<string> {
  const { endpoint, apiKey, model } = resolveConfig(options.model);
  const timeoutMs = options.timeoutMs ?? 120_000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort, { once: true });

  const payload: Record<string, unknown> = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 6000,
  };
  if (options.json) payload.response_format = { type: "json_object" };

  try {
    let response = await post(endpoint, apiKey, payload, controller.signal);

    // 部分网关不支持 response_format，退化为提示词约束 + 本地解析
    if (!response.ok && options.json) {
      const body = await response.text();
      if (/response_format|json_object|json mode/i.test(body)) {
        delete payload.response_format;
        response = await post(endpoint, apiKey, payload, controller.signal);
      } else {
        throw new Error(errorText(response.status, body));
      }
    }

    if (!response.ok) {
      throw new Error(errorText(response.status, await response.text()));
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("模型返回了空内容");
    return content;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onAbort);
  }
}
