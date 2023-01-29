import { AuthToken } from '@local/auth/auth-token';
import { ApiKeyVerifier } from '@local/auth/auth-verifier/api-key-verifier';
import { AuthenticationError } from '@local/express/http/http-errors';

/**
 * Class verifying if a user or system sending a request is allowed to do so.
 */
export class ApiKeyScopeVerifier {
  public constructor(private readonly apiKeyVerifier: ApiKeyVerifier) {}

  public async scopedVerifiedApiKey(apiKeyHeader: string): Promise<AuthToken> {
    return await this.verifiedApiKey(apiKeyHeader);
  }

  private async verifiedApiKey(apiKey: string): Promise<AuthToken> {
    try {
      return await this.apiKeyVerifier.verify(apiKey);
    } catch (error: any) {
      throw new AuthenticationError(`Failed to verify API Key: ${error.message}`);
    }
  }
}
