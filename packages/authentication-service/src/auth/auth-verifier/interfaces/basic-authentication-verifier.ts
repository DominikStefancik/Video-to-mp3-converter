import { AuthToken } from '@local/auth/auth-token';
import { BasicAuthenticationCredentials } from '@local/auth/basic-authentication-credentials';

export interface BasicAuthenticationVerifier {
  verify(credentials: BasicAuthenticationCredentials): Promise<AuthToken>;
}
