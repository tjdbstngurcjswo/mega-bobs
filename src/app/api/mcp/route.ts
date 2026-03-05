import {WebStandardStreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

import createMcpServer from '@/mcp/server';

const handleRequest = async (req: Request) => {
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  return transport.handleRequest(req);
};

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
