import { McpServerDefinition } from "./mcp-types";

export const BUILT_IN_MCP_SERVERS: McpServerDefinition[] = [
  {
    id: "google-gemini-mcp",
    name: "Google Gemini Core MCP Server",
    vendor: "Google",
    version: "2.4.0",
    transport: "http-jsonrpc",
    endpointUrl: "https://generativelanguage.googleapis.com/v1beta/mcp",
    status: "connected",
    latencyMs: 14,
    description: "Official Google Gemini Model Context Protocol Server providing documentation grounding, Knowledge Graph entity lookup, and Multimodal Vision reasoning.",
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
      logging: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "google_search_docs",
        description: "Search upstream Google Developer, Gemini SDK, and API documentation for code patterns, syntax, and migration guides.",
        category: "search",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query (e.g. 'structured outputs gemini 2.0', 'function calling sdk')",
            },
            scope: {
              type: "string",
              description: "Target documentation scope: 'sdk', 'api-reference', or 'guide'",
              enum: ["sdk", "api-reference", "guide"],
              default: "sdk",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "google_knowledge_graph",
        description: "Query Google Knowledge Graph entity embeddings, disambiguation IDs, and semantic relationships.",
        category: "search",
        inputSchema: {
          type: "object",
          properties: {
            entity: {
              type: "string",
              description: "Entity name or concept (e.g. 'Quantum Computing', 'Transformers Architecture')",
            },
            limit: {
              type: "number",
              description: "Maximum number of relationship triples to extract",
              default: 5,
            },
          },
          required: ["entity"],
        },
      },
      {
        name: "google_multimodal_analyzer",
        description: "Decompose diagrams, UI wireframes, or screenshots into structured architectural descriptions and code.",
        category: "vision",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Analytical prompt describing the vision task",
            },
            imageUrl: {
              type: "string",
              description: "URL or base64 data string of the image to analyze",
            },
          },
          required: ["prompt"],
        },
      },
    ],
    resources: [
      {
        uri: "gemini://models/catalog",
        name: "Google Gemini Models Catalog",
        description: "Real-time list of available Gemini 3.5, 3.6, and 3.8 Flash checkpoints with context window quotas.",
        mimeType: "application/json",
      },
      {
        uri: "gemini://safety/standards",
        name: "Harm & Constitutional Safety Guidelines",
        description: "RLHF constitutional thresholds and filter categories.",
        mimeType: "text/markdown",
      },
    ],
  },
  {
    id: "chatgpt-openai-mcp",
    name: "ChatGPT & OpenAI MCP Bridge",
    vendor: "OpenAI",
    version: "1.9.2",
    transport: "sse",
    endpointUrl: "https://api.openai.com/v1/mcp",
    status: "connected",
    latencyMs: 22,
    description: "OpenAI Model Context Protocol bridge with Code Interpreter simulation, o1/o3-mini reasoning traces, and JSON Schema Function Calling.",
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
      logging: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "openai_code_interpreter",
        description: "Execute Python / TypeScript algorithms in an isolated sandboxed sandbox and inspect stdout, stderr, and variables.",
        category: "code",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Executable Python / TypeScript snippet to evaluate",
            },
            language: {
              type: "string",
              description: "Execution environment runtime",
              enum: ["python", "typescript"],
              default: "python",
            },
          },
          required: ["code"],
        },
      },
      {
        name: "openai_reasoning_scratchpad",
        description: "Generate deep chain-of-thought o1/o3 style reasoning traces with explicit verification steps and self-correction tokens.",
        category: "reasoning",
        inputSchema: {
          type: "object",
          properties: {
            problem: {
              type: "string",
              description: "Complex mathematical, algorithmic, or architectural problem to deliberate",
            },
            rigorLevel: {
              type: "string",
              description: "Reasoning depth: 'standard', 'deep', or 'extreme'",
              enum: ["standard", "deep", "extreme"],
              default: "deep",
            },
          },
          required: ["problem"],
        },
      },
      {
        name: "openai_function_bridge",
        description: "Strict JSON Schema parser and function calling validator with zero hallucinatory arguments.",
        category: "code",
        inputSchema: {
          type: "object",
          properties: {
            functionName: {
              type: "string",
              description: "Target tool or function identifier",
            },
            argumentsPayload: {
              type: "string",
              description: "JSON stringified arguments to validate",
            },
          },
          required: ["functionName", "argumentsPayload"],
        },
      },
    ],
  },
  {
    id: "github-mcp",
    name: "GitHub Official MCP Server",
    vendor: "GitHub",
    version: "3.1.0",
    transport: "http-jsonrpc",
    endpointUrl: "https://api.github.com/mcp",
    status: "connected",
    latencyMs: 18,
    description: "Direct GitHub API MCP bridge for live repository analysis, pull request synthesis, commit diffing, and issue triage.",
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
      logging: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "github_repo_inspect",
        description: "Fetch real-time live repository metadata, stars, default branch, license, and issue counts directly from GitHub.",
        category: "git",
        inputSchema: {
          type: "object",
          properties: {
            repository: {
              type: "string",
              description: "GitHub owner/repo slug (e.g. 'vigneshwaransp/veronica')",
            },
          },
          required: ["repository"],
        },
      },
      {
        name: "github_commit_history",
        description: "Retrieve recent commit hashes, authors, and messages from a GitHub repository's main branch.",
        category: "git",
        inputSchema: {
          type: "object",
          properties: {
            repository: {
              type: "string",
              description: "GitHub owner/repo slug",
            },
            limit: {
              type: "number",
              description: "Number of recent commits to fetch (1-20)",
              default: 5,
            },
          },
          required: ["repository"],
        },
      },
      {
        name: "github_pr_synthesize",
        description: "Synthesize pull request changes into a high-density architectural changelog and automated release notes.",
        category: "git",
        inputSchema: {
          type: "object",
          properties: {
            repository: {
              type: "string",
              description: "GitHub owner/repo slug",
            },
            branch: {
              type: "string",
              description: "Feature branch name",
              default: "main",
            },
          },
          required: ["repository"],
        },
      },
    ],
  },
  {
    id: "filesystem-memory-mcp",
    name: "Filesystem & Cognitive Memory MCP Server",
    vendor: "System",
    version: "2.0.1",
    transport: "in-memory",
    status: "connected",
    latencyMs: 2,
    description: "Local high-speed memory and filesystem MCP server with semantic memory lookup, document indexing, and cache verification.",
    capabilities: {
      tools: true,
      resources: true,
      prompts: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "fs_read_workspace_file",
        description: "Inspect workspace files safely with line range filtering and syntax validation.",
        category: "filesystem",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "Relative or absolute file path to inspect",
            },
            maxLines: {
              type: "number",
              description: "Maximum lines to read",
              default: 100,
            },
          },
          required: ["filePath"],
        },
      },
      {
        name: "memory_semantic_lookup",
        description: "Query Veronica's associative memory bank for user preferences, historical patterns, and persona vectors.",
        category: "rag",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Concept or fact to retrieve from long-term memory",
            },
            topK: {
              type: "number",
              description: "Number of top matching memories",
              default: 3,
            },
          },
          required: ["query"],
        },
      },
    ],
  },
  {
    id: "web-search-mcp",
    name: "Live Web & DOM Search MCP Server",
    vendor: "Web",
    version: "1.4.0",
    transport: "http-jsonrpc",
    status: "connected",
    latencyMs: 45,
    description: "Real-time web browsing, clean DOM extraction, and search engine SERP aggregator without JavaScript clutter.",
    capabilities: {
      tools: true,
      resources: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "web_extract_dom",
        description: "Scrape and parse any public URL into clean, markdown-ready plain text without script tags or boilerplate.",
        category: "search",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The target website URL (e.g. 'https://news.ycombinator.com')",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "web_search_query",
        description: "Execute a real-time web search for recent news, academic papers, and technical announcements.",
        category: "search",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query string",
            },
          },
          required: ["query"],
        },
      },
    ],
  },
  {
    id: "speed-rag-mcp",
    name: "Speed-RAG Sub-Millisecond Vector MCP Server",
    vendor: "Community",
    version: "3.0.0",
    transport: "in-memory",
    status: "connected",
    latencyMs: 1,
    description: "Sub-millisecond vector similarity search engine running on 128-dimensional HNSW vector graphs with cosine metric.",
    capabilities: {
      tools: true,
      resources: true,
    },
    lastPingTimestamp: "Just now",
    tools: [
      {
        name: "speed_rag_vector_query",
        description: "Perform sub-millisecond HNSW vector query across indexed codebase symbols and documentation embeddings.",
        category: "rag",
        inputSchema: {
          type: "object",
          properties: {
            queryVectorText: {
              type: "string",
              description: "Natural language query to embed and match against the HNSW index",
            },
            threshold: {
              type: "number",
              description: "Cosine similarity threshold (0.0 to 1.0)",
              default: 0.75,
            },
          },
          required: ["queryVectorText"],
        },
      },
    ],
  },
];
