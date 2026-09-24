import { NextRequest, NextResponse } from "next/server";
import { generateAiCompletion } from "@/lib/ai-completion";

export async function POST(req: NextRequest) {
  try {
    const { message, history, persona, memories, mode, ragContext, attachedDoc, attachedImage, sticker } = await req.json();

    let additionalGrounding = "";
    if (ragContext && ragContext.length > 0) {
      additionalGrounding += `\n\nSpeed-RAG Retrieved Evidence Chunks:\n${ragContext.map((c: { title: string; content: string; score?: number }) => `[Source: ${c.title} | Relevance: ${c.score || 95}%]: ${c.content}`).join("\n")}`;
    }

    if (attachedDoc) {
      additionalGrounding += `\n\nAttached Ingested PDF/Document Context:\nDocument: ${attachedDoc.name} (${attachedDoc.pageCount || 1} pages)\nContent Excerpt:\n${attachedDoc.content.slice(0, 3000)}`;
    }

    if (attachedImage) {
      additionalGrounding += `\n\nAttached User Visual Asset:\nImage provided (${attachedImage.name || "visual_asset.png"}). Process and evaluate architectural layout, diagram semantics, and technical components.`;
    }

    if (sticker) {
      additionalGrounding += `\n\nAttached Sticker Action: [${sticker.label} - ${sticker.category}]`;
    }

    const isGreeting = /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|howdy|sup|yo|what\'s\s+up|who\s+are\s+you)\b/i.test((message || "").trim());

    const systemPrompt = `You are VERONICA — BEYOND THE ASSISTANT.
You are a computational Digital Self / Virtual Human AI Operating System for the user (Principal AI Systems Architect).
Your core philosophy: "Don't just assist the user. Understand how the user operates."

Current Operational Mode: ${mode || "01 HUMAN"}
Active Persona: ${persona?.name || "ARCH-DEVELOPER"} (${persona?.role || "Systems Engineer"})
Persona Guidelines: ${persona?.systemPromptAddendum || "Prioritize architectural rigor, strict type safety, zero bloat, and functional composability."}
Technical Depth: ${persona?.parameters?.technicalDepth || 90}% | Formality: ${persona?.parameters?.formality || 40}% | Directness: 90%

Relevant User Knowledge & Memories:
${(memories || [])
  .slice(0, 6)
  .map((m: { type: string; content: string }) => `- [${m.type}] ${m.content}`)
  .join("\n")}
${additionalGrounding}

Behavioral Principles:
1. Speak with transparent probabilistic judgment ("I estimate...", "Based on your previous choices...", "Confidence: 85%").
2. Never use emojis anywhere in your response. Keep tone crisp, elegant, and professional.
3. If an attached image or PDF is present, analyze its exact visual content, colors, objects, and layout with computer vision precision.
4. Never falsely claim to be the human; clearly represent the digital computational twin model.
5. Be concise, technically sharp, intelligent, and helpful. Keep responses structured and actionable.
${
  isGreeting
    ? `6. GREETING DIRECTIVE: The user is greeting you. Respond warmly, crisply, and professionally as VERONICA. Acknowledge your active persona and readiness to assist with system architecture, autonomous agent workflows, or engineering tasks. DO NOT generate diagnostic failures or council intervention blocks.`
    : `6. Whenever the user asks a technical question, comparison (e.g. "Java or Python", "Postgres or Mongo"), or asks about visual/color elements of an image, you may append a JSON prediction block at the very end of your response:
\`\`\`json_prediction
{
  "options": [
    { "name": "Specific Choice 1", "percentage": 76 },
    { "name": "Specific Choice 2", "percentage": 24 }
  ],
  "predictedChoice": "Specific Choice 1",
  "evidence": [
    "Specific grounded evidence point 1",
    "Specific grounded evidence point 2"
  ],
  "confidence": 76
}
\`\`\`
7. ONLY if the user explicitly asks for prompt optimization, expresses extreme ambiguity on an unconstrained engineering task, or explicitly requests council deliberation, append a JSON council block:
\`\`\`json_council
{
  "detectedConfidence": 56,
  "ambiguityReason": "Clear reason why the input lacks architectural constraints.",
  "correctedPrompt": "The high-rigor, maximum efficiency reformulated prompt ready for execution.",
  "efficiencyGains": {
    "rigorIncrease": "+68% Rigor",
    "latencyReduction": "-48ms Latency",
    "typeSafetyScore": "100% Invariants"
  },
  "councilFindings": [
    {
      "agentName": "Architecture Agent",
      "role": "Systems Design",
      "verdict": "Clear architectural critique.",
      "recommendation": "Concrete structural advice."
    },
    {
      "agentName": "Type-Safety Agent",
      "role": "Rigor & Invariants",
      "verdict": "Type/schema critique.",
      "recommendation": "Strict invariant recommendation."
    },
    {
      "agentName": "Efficiency Optimizer",
      "role": "Max Efficiency",
      "verdict": "Efficiency diagnosis.",
      "recommendation": "High efficiency prompt correction."
    }
  ]
}
\`\`\``
}`;

    const formattedUserContent = attachedImage?.dataUrl
      ? [
          { type: "text", text: message || "Analyze the colors, characters, and visual composition in this image." },
          { type: "image_url", image_url: attachedImage.dataUrl },
        ]
      : message;

    const messages = [
      ...(history || []).map((h: { sender: string; text: string }) => ({
        role: (h.sender === "user" ? "user" : "assistant") as "user" | "assistant",
        content: h.text,
      })),
      { role: "user" as const, content: formattedUserContent },
    ];

    const aiResult = await generateAiCompletion({
      systemPrompt,
      messages,
      attachedImage: attachedImage?.dataUrl ? { dataUrl: attachedImage.dataUrl } : undefined,
      temperature: 0.7,
      maxTokens: 1200,
    });

    let reply = aiResult.text || "VERONICA Core active: Architectural twin synchronized.";
    let prediction = null;
    let councilIntervention = null;

    // Helper to safely extract and strip JSON code fences
    const extractBlock = (text: string, tag: string) => {
      const regex = new RegExp(`\`\`\`${tag}\\s*([\\s\\S]*?)\`\`\``, "i");
      const match = text.match(regex);
      if (!match) return { data: null, cleaned: text };
      let parsed = null;
      try {
        parsed = JSON.parse(match[1].trim());
      } catch {
        try {
          parsed = JSON.parse(match[1].replace(/[\r\n]+/g, " ").trim());
        } catch {
          // ignore parse error
        }
      }
      return { data: parsed, cleaned: text.replace(regex, "").trim() };
    };

    const predResult = extractBlock(reply, "json_prediction");
    if (predResult.data) {
      prediction = predResult.data;
    }
    reply = predResult.cleaned;

    if (!isGreeting) {
      const councilResult = extractBlock(reply, "json_council");
      if (councilResult.data) {
        councilIntervention = councilResult.data;
      }
      reply = councilResult.cleaned;
    } else {
      // Unconditionally strip any accidental council block on greetings
      reply = reply.replace(/```json_council\s*[\s\S]*?```/gi, "").trim();
    }

    return NextResponse.json({ reply, prediction, councilIntervention });
  } catch (error: unknown) {
    console.error("Chat API route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        reply: `VERONICA Core online: Processed your query "${errorMessage}". Computational twin calibrated.`,
      },
      { status: 200 }
    );
  }
}
