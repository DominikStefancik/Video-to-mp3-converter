import { AuthToken } from '@local/auth/auth-token';

export interface ApiKeyVerifier {
  verify(apiKey: string): Promise<AuthToken>;
}
