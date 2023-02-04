import { AuthToken } from '@local/auth/auth-token';
import { BearerTokenVerifier } from '@local/auth/auth-verifier/interfaces/bearer-token-verifier';
import { AuthenticationError } from '@local/express/http/http-errors';

/**
 * Class verifying if an app user sending a request is allowed to do so.
 */
export class UserTokenScopeVerifier {
  public constructor(private readonly bearerTokenVerifier: BearerTokenVerifier) {}

  public async scopedVerifiedToken(
    authorizationHeader: string,
    sessionCookie: string
  ): Promise<AuthToken> {
    const bearerToken = this.getBearerToken(authorizationHeader, sessionCookie);

    return this.verifiedToken(bearerToken);
  }

  private getBearerToken(authorizationHeader: string, sessionCookie: string) {
    if (authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.split('Bearer ')[1];
    }

    if (sessionCookie.length > 1) {
      return sessionCookie;
    }

    throw new AuthenticationError('Failed to extract Bearer token');
  }

  private async verifiedToken(apiKey: string): Promise<AuthToken> {
    try {
      return this.bearerTokenVerifier.verify(apiKey);
    } catch (error: any) {
      throw new AuthenticationError(`Failed to verify user token: ${error.message}`);
    }
  }
}
