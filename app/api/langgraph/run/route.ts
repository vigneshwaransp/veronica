import { NextRequest, NextResponse } from "next/server";
import { langGraphRuntime } from "@/lib/langgraph/state-graph";

export async function GET() {
  try {
    const topologies = langGraphRuntime.getTopologies();
    return NextResponse.json({
      success: true,
      topologies,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load LangGraph topologies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      graphId = "supervisor_worker_critic",
      objective,
      maxLoops = 2,
      senderName = "Vigneshwaran S P",
    } = body;

    if (!objective || typeof objective !== "string") {
      return NextResponse.json(
        { success: false, error: "Objective prompt is required." },
        { status: 400 }
      );
    }

    const result = await langGraphRuntime.runGraph(graphId, objective, {
      maxLoops: Number(maxLoops) || 2,
      senderName,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to run LangGraph state graph" },
      { status: 500 }
    );
  }
}
