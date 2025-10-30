/* eslint-disable @typescript-eslint/no-require-imports */
// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATA_DIR = '/tmp/test-data';

// Polyfill for structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Polyfill for Next.js Web APIs (Request, Response, Headers, etc.)
// Required for testing Next.js API routes
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Import whatwg-fetch for Request/Response polyfills
require('whatwg-fetch');

// Import node-fetch for better Request/Response support
const nodeFetch = require('node-fetch');
const { Request, Headers } = nodeFetch;

// Create a custom Response that includes the json() static method
class CustomResponse extends nodeFetch.Response {
  static json(data, init) {
    const body = JSON.stringify(data);
    return new CustomResponse(body, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
}

global.Request = Request;
global.Response = CustomResponse;
global.Headers = Headers;
global.fetch = nodeFetch.default;
