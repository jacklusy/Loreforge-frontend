/** Shared between AuthContext (reads/writes on the happy path) and the API client
 * (clears it directly when a request reveals the token is no longer valid) so
 * both agree on the same key without importing a whole React context. */
export const AUTH_TOKEN_STORAGE_KEY = "loreforge_auth_token";
