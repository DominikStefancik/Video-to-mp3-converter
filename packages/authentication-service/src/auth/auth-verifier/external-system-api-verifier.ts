import { pino } from 'pino';

import { AuthToken } from '@local/auth/auth-token';
import { ApiKeyVerifier } from '@local/auth/auth-verifier/api-key-verifier';

/**
 * Class verifying API Key from a request header.
 */
export class ExternalSystemApiVerifier implements ApiKeyVerifier {
  public constructor(private readonly logger: pino.Logger) {}

  public async verify(apiKey: string): Promise<AuthToken> {
    this.logger.info('Verifying external system api key', { apiKey });
    // implement verification of an external system based on the provided ApiKey (e.g. read secret data from a cloud)
    // if an external system cannot be verified, throw an AuthorizationError

    return Promise.resolve({ userId: 'externalUserId', role: 'Admin' });
  }
}
