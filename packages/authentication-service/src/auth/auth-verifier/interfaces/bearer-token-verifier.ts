import { AuthToken } from '@local/auth/auth-token';

export interface BearerTokenVerifier {
  verify(token: string): Promise<AuthToken>;
}
