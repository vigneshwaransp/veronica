import { NextRequest, NextResponse } from "next/server";
import { agentRegistry } from "@/lib/agents/agent-registry";
import { AgentManager } from "@/lib/agents/agent-manager";

export async function GET() {
  try {
    const agents = agentRegistry.getAllDefinitions();
    return NextResponse.json({
      success: true,
      agentsCount: agents.length,
      agents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list agents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId = "general", objective, maxRetries = 3, timeoutMs = 60000 } = body;

    if (!objective || typeof objective !== "string") {
      return NextResponse.json(
        { success: false, error: "Objective is required." },
        { status: 400 }
      );
    }

    const taskResult = await AgentManager.runAutonomousTask(agentId, objective, {
      maxRetries: Number(maxRetries) || 3,
      timeoutMs: Number(timeoutMs) || 60000,
    });

    return NextResponse.json({
      success: taskResult.state === "COMPLETED",
      result: taskResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to run autonomous agent task" },
      { status: 500 }
    );
  }
}
