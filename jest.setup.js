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

// Polyfill for ReadableStream (required by undici)
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web');
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

// Polyfill for MessageChannel/MessagePort (required by undici)
const { MessageChannel, MessagePort } = require('node:worker_threads');
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

// Import whatwg-fetch for Request/Response polyfills
require('whatwg-fetch');

// Import undici for better Request/Response support (Node.js native fetch)
const { fetch, Request, Response, Headers } = require('undici');

// Create a custom Response that includes the json() static method
class CustomResponse extends Response {
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
global.fetch = fetch;
