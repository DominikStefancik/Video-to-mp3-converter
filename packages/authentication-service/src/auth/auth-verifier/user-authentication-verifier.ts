import { pino } from 'pino';
import * as jwt from 'jsonwebtoken';

import { AuthToken } from '@local/auth/auth-token';
import { BasicAuthenticationVerifier } from '@local/auth/auth-verifier/interfaces/basic-authentication-verifier';
import { BasicAuthenticationCredentials } from '@local/auth/basic-authentication-credentials';
import { UserRepository } from '@local/domain/user/database/repository';
import { AuthenticationError } from '@local/express/http/http-errors';
import { UserRole } from '@local/domain/user/model';
import { JWT_SECRET } from '../../constants';

/**
 * Class verifying user's credentials.
 */
export class UserCredentialsVerifier implements BasicAuthenticationVerifier {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: pino.Logger
  ) {}

  public async verify(credentials: BasicAuthenticationCredentials): Promise<AuthToken> {
    const { username, password } = credentials;
    this.logger.info({ username }, 'Verifying user credentials');

    const user = await this.userRepository.getOne(username);

    if (!user) {
      throw new AuthenticationError(`User with ${username} doesn't exist`);
    }

    if (user.password !== password) {
      throw new AuthenticationError(`Incorrect password for the user ${username}`);
    }

    const role = UserRole.Admin;
    const jsonWebToken = jwt.sign({ username, role }, JWT_SECRET!, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });

    return {
      username,
      role,
      token: jsonWebToken,
    };
  }
}
