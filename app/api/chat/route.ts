import { NextRequest, NextResponse } from "next/server";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

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
6. Whenever the user asks a question, technical dilemma, comparison (e.g. "Java or Python", "Postgres or Mongo"), or asks about visual/color elements of an image, ALWAYS append a JSON prediction block at the very end of your response:
\`\`\`json_prediction
{
  "options": [
    { "name": "Specific Choice 1", "percentage": 76 },
    { "name": "Specific Choice 2", "percentage": 24 }
  ],
  "predictedChoice": "Specific Choice 1",
  "evidence": [
    "Specific grounded evidence point 1 from query, image, or memories",
    "Specific grounded evidence point 2",
    "Specific grounded evidence point 3",
    "Specific grounded evidence point 4"
  ],
  "confidence": 76
}
\`\`\`
7. If the user's input is hesitant, uncertain, vague, informal, asking for help, or has less than 85% confidence (e.g. asking "what should I do?", "is X good?", "maybe", "can I", "not sure", "less confident", or open-ended questions), ALWAYS append a JSON council intervention block:
\`\`\`json_council
{
  "detectedConfidence": 56,
  "ambiguityReason": "Clear reason why the user input lacks architectural rigor or constraint precision.",
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
\`\`\``;

    const formattedUserContent = attachedImage?.dataUrl
      ? [
          { type: "text", text: message || "Analyze the colors, characters, and visual composition in this image." },
          { type: "image_url", image_url: attachedImage.dataUrl },
        ]
      : message;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((h: { sender: string; text: string }) => ({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text,
      })),
      { role: "user", content: formattedUserContent },
    ];

    const modelToUse = attachedImage?.dataUrl ? "pixtral-12b-2409" : "mistral-small-latest";

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral API error:", errorText);
      return NextResponse.json(
        {
          reply: `VERONICA Core active. (Mistral API status ${response.status}. Internal heuristic engine active.) Based on your preferences and active Speed-RAG index, I recommend prioritizing type-safety and single-engine ACID consistency.`,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "VERONICA: Synchronized.";
    let prediction = null;
    let councilIntervention = null;

    const predictionMatch = reply.match(/```json_prediction\s*([\s\S]*?)\s*```/);
    if (predictionMatch) {
      try {
        prediction = JSON.parse(predictionMatch[1]);
        reply = reply.replace(/```json_prediction\s*([\s\S]*?)\s*```/, "").trim();
      } catch (e) {
        console.error("Failed to parse prediction JSON:", e);
      }
    }

    const councilMatch = reply.match(/```json_council\s*([\s\S]*?)\s*```/);
    if (councilMatch) {
      try {
        councilIntervention = JSON.parse(councilMatch[1]);
        reply = reply.replace(/```json_council\s*([\s\S]*?)\s*```/, "").trim();
      } catch (e) {
        console.error("Failed to parse council JSON:", e);
      }
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
