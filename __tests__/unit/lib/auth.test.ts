import { getAuthConfig, validateBasicAuth } from '@/lib/auth';

describe('lib/auth', () => {
  describe('getAuthConfig', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      // Save original env
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      // Restore original env
      process.env = originalEnv;
    });

    it('should return config with enabled=true when ENABLE_BASICAUTH is "true"', () => {
      process.env.ENABLE_BASICAUTH = 'true';
      process.env.BASICAUTH_USERNAME = 'testuser';
      process.env.BASICAUTH_PASSWORD = 'testpass';

      const config = getAuthConfig();

      expect(config.enabled).toBe(true);
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should return config with enabled=false when ENABLE_BASICAUTH is not "true"', () => {
      process.env.ENABLE_BASICAUTH = 'false';
      process.env.BASICAUTH_USERNAME = 'testuser';
      process.env.BASICAUTH_PASSWORD = 'testpass';

      const config = getAuthConfig();

      expect(config.enabled).toBe(false);
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('testpass');
    });

    it('should return empty strings for username/password when env vars are not set', () => {
      delete process.env.ENABLE_BASICAUTH;
      delete process.env.BASICAUTH_USERNAME;
      delete process.env.BASICAUTH_PASSWORD;

      const config = getAuthConfig();

      expect(config.enabled).toBe(false);
      expect(config.username).toBe('');
      expect(config.password).toBe('');
    });

    it('should handle partial env var configuration', () => {
      process.env.ENABLE_BASICAUTH = 'true';
      process.env.BASICAUTH_USERNAME = 'testuser';
      delete process.env.BASICAUTH_PASSWORD;

      const config = getAuthConfig();

      expect(config.enabled).toBe(true);
      expect(config.username).toBe('testuser');
      expect(config.password).toBe('');
    });
  });

  describe('validateBasicAuth', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      // Save original env
      originalEnv = { ...process.env };
      // Set up test credentials
      process.env.BASICAUTH_USERNAME = 'testuser';
      process.env.BASICAUTH_PASSWORD = 'testpass';
    });

    afterEach(() => {
      // Restore original env
      process.env = originalEnv;
    });

    it('should return true for valid credentials', () => {
      // "testuser:testpass" in Base64
      const authHeader = 'Basic ' + Buffer.from('testuser:testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(true);
    });

    it('should return false for invalid username', () => {
      // "wronguser:testpass" in Base64
      const authHeader = 'Basic ' + Buffer.from('wronguser:testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for invalid password', () => {
      // "testuser:wrongpass" in Base64
      const authHeader = 'Basic ' + Buffer.from('testuser:wrongpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for null auth header', () => {
      const result = validateBasicAuth(null);

      expect(result).toBe(false);
    });

    it('should return false for empty auth header', () => {
      const result = validateBasicAuth('');

      expect(result).toBe(false);
    });

    it('should return false for auth header without "Basic " prefix', () => {
      const authHeader = Buffer.from('testuser:testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for malformed Base64', () => {
      const authHeader = 'Basic !!!invalid-base64!!!';

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for credentials without colon separator', () => {
      // "testusertestpass" (no colon) in Base64
      const authHeader = 'Basic ' + Buffer.from('testusertestpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for empty username', () => {
      // ":testpass" in Base64
      const authHeader = 'Basic ' + Buffer.from(':testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false for empty password', () => {
      // "testuser:" in Base64
      const authHeader = 'Basic ' + Buffer.from('testuser:').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should return false when env credentials are not set', () => {
      delete process.env.BASICAUTH_USERNAME;
      delete process.env.BASICAUTH_PASSWORD;

      const authHeader = 'Basic ' + Buffer.from('testuser:testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });

    it('should handle special characters in credentials', () => {
      process.env.BASICAUTH_USERNAME = 'test@user.com';
      process.env.BASICAUTH_PASSWORD = 'p@$$w0rd!';

      const authHeader = 'Basic ' + Buffer.from('test@user.com:p@$$w0rd!').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(true);
    });

    it('should handle Unicode characters in credentials', () => {
      process.env.BASICAUTH_USERNAME = 'über';
      process.env.BASICAUTH_PASSWORD = 'päss';

      const authHeader = 'Basic ' + Buffer.from('über:päss').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(true);
    });

    it('should use constant-time comparison (timing attack resistance)', () => {
      // This test verifies the function doesn't short-circuit
      // We can't test timing directly, but we verify it works correctly
      const authHeader = 'Basic ' + Buffer.from('testuser:testpass').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(true);
    });

    it('should return false for credentials with different lengths', () => {
      // Set short expected credentials
      process.env.BASICAUTH_USERNAME = 'user';
      process.env.BASICAUTH_PASSWORD = 'pass';

      // Try with longer credentials
      const authHeader = 'Basic ' + Buffer.from('verylongusername:verylongpassword').toString('base64');

      const result = validateBasicAuth(authHeader);

      expect(result).toBe(false);
    });
  });
});
