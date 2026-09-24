import { NextRequest, NextResponse } from "next/server";
import { mcpClientManager } from "@/lib/mcp/mcp-client";

export async function GET() {
  try {
    const servers = mcpClientManager.listServers();
    const totalTools = servers.reduce((acc, s) => acc + s.tools.length, 0);
    return NextResponse.json({
      success: true,
      serversCount: servers.length,
      totalTools,
      protocolVersion: "2024-11-05 (MCP v1.0)",
      servers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list MCP servers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, serverId, customServer } = body;

    if (action === "ping" && serverId) {
      const pingResult = await mcpClientManager.pingServer(serverId);
      return NextResponse.json({
        success: pingResult.success,
        serverId,
        latencyMs: pingResult.latencyMs,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "register" && customServer) {
      mcpClientManager.registerCustomServer(customServer);
      return NextResponse.json({
        success: true,
        message: `Registered custom MCP Server '${customServer.name}' successfully.`,
        server: customServer,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Supported actions: 'ping', 'register'" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process MCP request" },
      { status: 500 }
    );
  }
}
