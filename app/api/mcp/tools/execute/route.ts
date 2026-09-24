import { NextRequest, NextResponse } from "next/server";
import { mcpClientManager } from "@/lib/mcp/mcp-client";

export async function POST(req: NextRequest) {
  try {
    const { serverId, toolName, arguments: toolArgs = {} } = await req.json();

    if (!serverId || !toolName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: 'serverId' and 'toolName' are required.",
        },
        { status: 400 }
      );
    }

    const executionResult = await mcpClientManager.executeTool(serverId, toolName, toolArgs);

    return NextResponse.json({
      success: executionResult.success,
      result: executionResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute MCP tool",
      },
      { status: 500 }
    );
  }
}
