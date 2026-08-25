import { NextRequest } from 'next/server';

export function logRequest(req: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers.get('user-agent') || 'Unknown';

  console.log(`[${timestamp}] ${method} ${url} - UserAgent: ${userAgent}`);
}
