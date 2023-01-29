import { pino } from 'pino';

import { AuthToken } from '@local/auth/auth-token';
import { BearerTokenVerifier } from '@local/auth/auth-verifier/bearer-token-verifier';

/**
 * Class verifying authorization Bearer token.
 */
export class UserTokenVerifier implements BearerTokenVerifier {
  public constructor(private readonly logger: pino.Logger) {}

  public async verify(token: string): Promise<AuthToken> {
    this.logger.info('Verifying user token', { token });
    // implement verification of an app user based on the provided OAuth token (e.g. read secret data from a cloud)
    // if the user cannot be verified, throw an AuthorizationError

    return { userId: 'appUserId', role: 'Admin' };
  }
}
