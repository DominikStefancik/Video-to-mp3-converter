// At the very beginning of the index.ts file we need to setup an alias which will be used to avoid using relative paths in imports
import 'module-alias/register';

import express from 'express';

import { ExternalSystemApiVerifier } from '@local/auth/auth-verifier/external-system-api-verifier';
import { ExpressAppBuilder } from '@local/express/express-app-builder';
import { AuthenticationMiddlewareFactory } from '@local/express/middleware/authentication-middleware-factory';
import { VersionTag, RoutePrefix } from '@local/express/routing/routes';
import { MODULE_NAME, PORT } from './constants';
import { getLogger } from './logging/logger';

if (!MODULE_NAME || !PORT) {
  throw new Error('Required environment variables are not set');
}

const logger = getLogger(MODULE_NAME);

const main = async (): Promise<express.Express> => {
  const authenticationMiddlewareFactory = new AuthenticationMiddlewareFactory();
  const externalSystemVerifier = new ExternalSystemApiVerifier(logger);

  return new ExpressAppBuilder(logger)
    .withPublicRoute(RoutePrefix.api, VersionTag.v1, [
      authenticationMiddlewareFactory.getForApiKey(externalSystemVerifier),
    ])
    .withPublicRouteEndpoints(RoutePrefix.api, VersionTag.v1, {})
    .build();
};

main().then((app) =>
  app.listen(PORT, () => {
    logger.info(`Express server is listening on the port ${PORT}`);
  })
);
