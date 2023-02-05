import { pino } from 'pino';
import * as jwt from 'jsonwebtoken';

import { AuthToken } from '@local/auth/auth-token';
import { BearerTokenVerifier } from '@local/auth/auth-verifier/interfaces/bearer-token-verifier';
import { UserRole } from '@local/domain/user/model';
import { JWT_SECRET } from '../../constants';
import { AuthorizationError } from '@local/express/http/http-errors';

/**
 * Class verifying authorization Bearer token.
 */
export class UserTokenVerifier implements BearerTokenVerifier {
  public constructor(private readonly logger: pino.Logger) {}

  public async verify(token: string): Promise<AuthToken> {
    this.logger.info({ token }, 'Verifying user token');

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET!) as { username: string; role: UserRole };

      return { username: decodedToken.username, role: decodedToken.role, token };
    } catch (error) {
      throw new AuthorizationError('User not authorized');
    }
  }
}
