import { timingSafeEqual } from 'crypto';

/**
 * Authentication configuration interface
 */
export interface AuthConfig {
  enabled: boolean;
  username: string;
  password: string;
}

/**
 * Get authentication configuration from environment variables
 */
export function getAuthConfig(): AuthConfig {
  return {
    enabled: process.env.ENABLE_BASICAUTH === 'true',
    username: process.env.BASICAUTH_USERNAME || '',
    password: process.env.BASICAUTH_PASSWORD || '',
  };
}

/**
 * Validate HTTP Basic Authentication credentials
 *
 * @param authHeader - The Authorization header value (e.g., "Basic base64string")
 * @returns true if credentials are valid, false otherwise
 */
export function validateBasicAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    // Extract and decode Base64 credentials
    const base64Credentials = authHeader.slice(6); // Remove "Basic " prefix
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    const config = getAuthConfig();
    const expectedUsername = config.username;
    const expectedPassword = config.password;

    // Check if credentials exist
    if (!username || !password || !expectedUsername || !expectedPassword) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    // Note: timingSafeEqual requires buffers of the same length
    const usernameBuffer = Buffer.from(username);
    const expectedUsernameBuffer = Buffer.from(expectedUsername);
    const passwordBuffer = Buffer.from(password);
    const expectedPasswordBuffer = Buffer.from(expectedPassword);

    // Check lengths first (not timing-sensitive)
    if (usernameBuffer.length !== expectedUsernameBuffer.length ||
        passwordBuffer.length !== expectedPasswordBuffer.length) {
      return false;
    }

    const usernameMatch = timingSafeEqual(usernameBuffer, expectedUsernameBuffer);
    const passwordMatch = timingSafeEqual(passwordBuffer, expectedPasswordBuffer);

    return usernameMatch && passwordMatch;
  } catch {
    // Invalid Base64 or malformed Authorization header
    return false;
  }
}
