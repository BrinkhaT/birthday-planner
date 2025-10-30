/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts, before any requests are handled
 * Used for startup validation and initialization
 */

export function register() {
  // Check if BasicAuth is enabled
  const authEnabled = process.env.ENABLE_BASICAUTH === 'true';

  if (authEnabled) {
    // Validate that credentials are configured
    const username = process.env.BASICAUTH_USERNAME;
    const password = process.env.BASICAUTH_PASSWORD;

    if (!username || !password) {
      // Fail-fast with clear German error message
      const errorMessage = `
❌ FEHLER: BasicAuth ist aktiviert, aber Zugangsdaten fehlen.

   Bitte setzen Sie die folgenden Umgebungsvariablen:
   - BASICAUTH_USERNAME
   - BASICAUTH_PASSWORD

   Beispiel in docker-compose.yml:
   environment:
     ENABLE_BASICAUTH: "true"
     BASICAUTH_USERNAME: "admin"
     BASICAUTH_PASSWORD: "ihr_sicheres_passwort"
`;
      console.error(errorMessage);

      // Throw error instead of process.exit() for Edge Runtime compatibility
      throw new Error('BasicAuth aktiviert, aber Zugangsdaten fehlen. Anwendung wird gestoppt.');
    }

    // Success message
    console.log('✓ BasicAuth aktiviert und Zugangsdaten validiert');
    console.log(`  Benutzername: ${username}`);
  } else {
    // Info message when disabled
    console.log('ℹ BasicAuth ist deaktiviert');
  }
}
