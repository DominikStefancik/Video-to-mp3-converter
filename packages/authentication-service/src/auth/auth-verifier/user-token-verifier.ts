import { pino } from 'pino';

import { AuthToken } from '@local/auth/auth-token';
import { BearerTokenVerifier } from '@local/auth/auth-verifier/interfaces/bearer-token-verifier';
import { UserRole } from '@local/domain/user/model';

/**
 * Class verifying authorization Bearer token.
 */
export class UserTokenVerifier implements BearerTokenVerifier {
  public constructor(private readonly logger: pino.Logger) {}

  public async verify(token: string): Promise<AuthToken> {
    this.logger.info({ token }, 'Verifying user token');
    // implement verification of an app user based on the provided OAuth token (e.g. read secret data from a cloud)
    // if the user cannot be verified, throw an AuthorizationError

    return { username: 'appUserId', role: UserRole.Admin, token };
  }
}
