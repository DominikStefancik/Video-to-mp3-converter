import * as express from 'express';

import { BearerTokenVerifier } from '@local/auth/auth-verifier/interfaces/bearer-token-verifier';
import { AuthEnrichment } from '@local/interfaces/networking/request';
import { UserTokenScopeVerifier } from '@local/express/scope-verifier/user-token-scope-verifier';
import { BasicAuthenticationVerifier } from '@local/auth/auth-verifier/interfaces/basic-authentication-verifier';
import { UserAuthenticationScopeVerifier } from '@local/express/scope-verifier/user-authentication-scope-verifier';

/**
 * Factory class for creating an authentication middleware, which checks authentication based on different methods
 * (e.g. Basic Auth, OAuth2, etc.)
 */
export class AuthenticationMiddlewareFactory {
  /**
   * Returns an authentication middleware which checks the user's credentials of each request.
   */
  public getForUserCredentials(
    verifier: BasicAuthenticationVerifier
  ): (
    request: express.Request & Partial<AuthEnrichment>,
    _: express.Response,
    next: express.NextFunction
  ) => Promise<void> {
    return async (
      request: express.Request & Partial<AuthEnrichment>,
      _: express.Response,
      next: express.NextFunction
    ) => {
      const scopeVerifier = new UserAuthenticationScopeVerifier(verifier);
      const authorizationHeader = request.headers?.authorization ?? null;

      try {
        request.token = await scopeVerifier.scopedVerifiedCredentials(authorizationHeader);
      } catch (error) {
        next(error);
        return;
      }

      next();
    };
  }

  /**
   * Returns an authentication middleware which checks the user's OAuth token of each request.
   */
  public getForUserToken(
    verifier: BearerTokenVerifier
  ): (
    request: express.Request & Partial<AuthEnrichment>,
    _: express.Response,
    next: express.NextFunction
  ) => Promise<void> {
    return async (
      request: express.Request & Partial<AuthEnrichment>,
      _: express.Response,
      next: express.NextFunction
    ) => {
      const scopeVerifier = new UserTokenScopeVerifier(verifier);
      const authorizationHeader = request.headers?.authorization || '';
      const sessionCookie = request.cookies.__session || '';

      try {
        request.token = await scopeVerifier.scopedVerifiedToken(authorizationHeader, sessionCookie);
      } catch (error) {
        next(error);
        return;
      }

      next();
    };
  }
}
