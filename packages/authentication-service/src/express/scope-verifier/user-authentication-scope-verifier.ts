import { AuthToken } from '@local/auth/auth-token';
import { AuthenticationError } from '@local/express/http/http-errors';
import { BasicAuthenticationVerifier } from '@local/auth/auth-verifier/interfaces/basic-authentication-verifier';
import { BasicAuthenticationCredentials } from '@local/auth/basic-authentication-credentials';

/**
 * Class verifying if a user sending a request is allowed to do so.
 */
export class UserAuthenticationScopeVerifier {
  public constructor(private readonly credentialsVerifier: BasicAuthenticationVerifier) {}

  public async scopedVerifiedCredentials(authorizationHeader: string | null): Promise<AuthToken> {
    if (authorizationHeader === null) {
      throw new AuthenticationError('Authorization header is missing');
    }

    const credentials = this.getCredentials(authorizationHeader);

    return this.verifiedUserCredentials(credentials);
  }

  private getCredentials(authorizationHeader: string): BasicAuthenticationCredentials {
    if (authorizationHeader.startsWith('Basic ')) {
      const base64Credentials = authorizationHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      return { username, password };
    }

    throw new AuthenticationError('Failed to extract credentials');
  }

  private async verifiedUserCredentials(
    credentials: BasicAuthenticationCredentials
  ): Promise<AuthToken> {
    try {
      return this.credentialsVerifier.verify(credentials);
    } catch (error: any) {
      throw new AuthenticationError(`Failed to verify user credentials: ${error.message}`);
    }
  }
}
