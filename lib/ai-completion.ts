/**
 * Resilient Multi-Provider AI Completion Engine
 * Cascades across Mistral AI and Google Gemini with automatic token exhaustion / rate-limit failover.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "";

export interface AiChatMessage {
  role: "system" | "user" | "assistant";
  content: string | any;
}

export interface AiCompletionOptions {
  systemPrompt?: string;
  messages?: AiChatMessage[];
  userPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  attachedImage?: {
    dataUrl?: string;
    mimeType?: string;
  };
}

export interface AiCompletionResult {
  text: string;
  modelUsed: string;
  provider: "mistral" | "gemini" | "heuristic";
  latencyMs: number;
}

const MISTRAL_MODELS = [
  "open-mistral-nemo",
  "codestral-latest",
  "open-mistral-7b",
  "mistral-small-latest"
];

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
];

/**
 * Call Mistral AI API
 */
async function callMistral(
  model: string,
  systemPrompt: string,
  messages: AiChatMessage[],
  userPrompt: string,
  attachedImage: AiCompletionOptions["attachedImage"],
  temperature: number,
  maxTokens: number
): Promise<string | null> {
  if (!MISTRAL_API_KEY) return null;

  try {
    const formattedMessages: any[] = [];
    if (systemPrompt) {
      formattedMessages.push({ role: "system", content: systemPrompt });
    }

    if (messages && messages.length > 0) {
      messages.forEach((m) => {
        if (m.role === "system") {
          if (!systemPrompt) formattedMessages.push({ role: "system", content: m.content });
        } else {
          formattedMessages.push({ role: m.role, content: m.content });
        }
      });
    } else if (userPrompt) {
      if (attachedImage?.dataUrl) {
        formattedMessages.push({
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: attachedImage.dataUrl }
          ]
        });
      } else {
        formattedMessages.push({ role: "user", content: userPrompt });
      }
    }

    const modelToCall = attachedImage?.dataUrl ? "pixtral-12b-2409" : model;

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelToCall,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    } else {
      console.warn(`Mistral model ${model} returned HTTP ${res.status}, switching to next fallback...`);
      return null;
    }
  } catch (err: any) {
    console.warn(`Mistral model ${model} error: ${err.message}`);
    return null;
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(
  model: string,
  systemPrompt: string,
  messages: AiChatMessage[],
  userPrompt: string,
  attachedImage: AiCompletionOptions["attachedImage"],
  temperature: number,
  maxTokens: number
): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const contents: any[] = [];

    if (messages && messages.length > 0) {
      messages.forEach((m) => {
        if (m.role === "user") {
          const parts: any[] = [];
          if (typeof m.content === "string") {
            parts.push({ text: m.content });
          } else if (Array.isArray(m.content)) {
            m.content.forEach((c) => {
              if (c.type === "text") parts.push({ text: c.text });
              else if (c.type === "image_url" && c.image_url) {
                const base64Match = c.image_url.match(/^data:([^;]+);base64,(.+)$/);
                if (base64Match) {
                  parts.push({
                    inline_data: {
                      mime_type: base64Match[1],
                      data: base64Match[2]
                    }
                  });
                }
              }
            });
          }
          if (parts.length > 0) contents.push({ role: "user", parts });
        } else if (m.role === "assistant") {
          contents.push({ role: "model", parts: [{ text: String(m.content) }] });
        }
      });
    } else if (userPrompt) {
      const parts: any[] = [{ text: userPrompt }];

      if (attachedImage?.dataUrl) {
        const base64Match = attachedImage.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (base64Match) {
          parts.push({
            inline_data: {
              mime_type: base64Match[1] || attachedImage.mimeType || "image/png",
              data: base64Match[2]
            }
          });
        }
      }

      contents.push({ role: "user", parts });
    }

    const payload: any = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } else {
      console.warn(`Gemini model ${model} returned HTTP ${res.status}, switching to next fallback...`);
      return null;
    }
  } catch (err: any) {
    console.warn(`Gemini model ${model} error: ${err.message}`);
    return null;
  }
}

/**
 * Execute completion with automatic token-exhaustion failover
 */
export async function generateAiCompletion(options: AiCompletionOptions): Promise<AiCompletionResult> {
  const startTime = Date.now();
  const systemPrompt = options.systemPrompt || "";
  const messages = options.messages || [];
  const userPrompt = options.userPrompt || "";
  const temperature = options.temperature ?? 0.4;
  const maxTokens = options.maxTokens ?? 1800;
  const attachedImage = options.attachedImage;

  // 1. Try Mistral cascade
  for (const model of MISTRAL_MODELS) {
    const mistralText = await callMistral(
      model,
      systemPrompt,
      messages,
      userPrompt,
      attachedImage,
      temperature,
      maxTokens
    );
    if (mistralText) {
      return {
        text: mistralText,
        modelUsed: model,
        provider: "mistral",
        latencyMs: Date.now() - startTime,
      };
    }
  }

  // 2. Token / Quota exhausted on Mistral -> Failover to Google Gemini cascade
  console.log("Mistral models exhausted or rate-limited. Failover to Google Gemini...");
  for (const model of GEMINI_MODELS) {
    const geminiText = await callGemini(
      model,
      systemPrompt,
      messages,
      userPrompt,
      attachedImage,
      temperature,
      maxTokens
    );
    if (geminiText) {
      return {
        text: geminiText,
        modelUsed: model,
        provider: "gemini",
        latencyMs: Date.now() - startTime,
      };
    }
  }

  // 3. Fallback heuristic if external network fails
  return {
    text: "",
    modelUsed: "heuristic-engine",
    provider: "heuristic",
    latencyMs: Date.now() - startTime,
  };
}
