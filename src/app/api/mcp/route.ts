import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

import createMcpServer from '@/mcp/server';

/**
 * @route POST /api/mcp
 * @route DELETE /api/mcp
 * @description MCP Streamable HTTP 엔드포인트 — stateless (세션 없음)
 */
const handleRequest = async (req: Request) => {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  return transport.handleRequest(req);
};

export const POST = handleRequest;
export const DELETE = handleRequest;
