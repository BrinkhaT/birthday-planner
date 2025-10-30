import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Next.js 16 Proxy for HTTP Basic Authentication
 *
 * This proxy runs before page rendering and API route execution.
 * When BasicAuth is enabled, it validates credentials for all protected routes.
 * When disabled, it has zero performance overhead (early return).
 *
 * Note: Next.js 16 uses proxy.ts instead of the deprecated middleware.ts
 * Proxy files always run on Node.js runtime (no runtime config needed)
 */

export function proxy(request: NextRequest) {
  // Check if BasicAuth is enabled
  const authEnabled = process.env.ENABLE_BASICAUTH === 'true';

  // Early return when BasicAuth is disabled - zero overhead
  if (!authEnabled) {
    return NextResponse.next();
  }

  // Extract Authorization header
  const authHeader = request.headers.get('authorization');

  // Validate credentials
  const isValid = validateBasicAuth(authHeader);

  if (!isValid) {
    // Return 401 Unauthorized with German WWW-Authenticate header
    return new NextResponse('Authentifizierung erforderlich', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Geburtstagplaner", charset="UTF-8"',
      },
    });
  }

  // Credentials valid - allow request to proceed
  return NextResponse.next();
}

/**
 * Validate HTTP Basic Authentication credentials
 */
function validateBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    // Extract and decode Base64 credentials
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const expectedUsername = process.env.BASICAUTH_USERNAME || '';
    const expectedPassword = process.env.BASICAUTH_PASSWORD || '';

    // Check if credentials exist
    if (!username || !password || !expectedUsername || !expectedPassword) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    const usernameBuffer = Buffer.from(username);
    const expectedUsernameBuffer = Buffer.from(expectedUsername);
    const passwordBuffer = Buffer.from(password);
    const expectedPasswordBuffer = Buffer.from(expectedPassword);

    // Check lengths first
    if (usernameBuffer.length !== expectedUsernameBuffer.length ||
        passwordBuffer.length !== expectedPasswordBuffer.length) {
      return false;
    }

    const usernameMatch = timingSafeEqual(usernameBuffer, expectedUsernameBuffer);
    const passwordMatch = timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

    return usernameMatch && passwordMatch;
  } catch (error) {
    return false;
  }
}

/**
 * Proxy configuration
 * Protect all pages and API routes
 */
export const config = {
  matcher: [
    '/',
    '/api/:path*',
  ],
};
