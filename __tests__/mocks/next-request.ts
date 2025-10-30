/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';

// Test utility: createMockRequest
export const createMockRequest = (method: string, body?: any, url?: string): NextRequest => {
  return new NextRequest(url || 'http://localhost:3000/api/test', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

// Test utility: parseResponse
export const parseResponse = async (response: Response) => {
  return {
    status: response.status,
    body: await response.json(),
  };
};
