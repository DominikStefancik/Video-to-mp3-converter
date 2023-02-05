// At the very beginning of the index.ts file we need to setup an alias which will be used to avoid using relative paths in imports
import 'module-alias/register';

import { ExpressAppBuilder } from '@local/express/express-app-builder';
import { AuthenticationMiddlewareFactory } from '@local/express/middleware/authentication-middleware-factory';
import { VersionTag, RoutePrefix } from '@local/express/routing/routes';
import {
  MODULE_NAME,
  PORT,
  AUTH_SERVICE_DATABASE_HOST,
  AUTH_SERVICE_DATABASE,
  AUTH_SERVICE_DATABASE_PORT,
  AUTH_SERVICE_DATABASE_USERNAME,
  AUTH_SERVICE_DATABASE_PASSWORD,
  JWT_SECRET,
} from './constants';
import { getLogger } from './logging/logger';
import { UserCredentialsVerifier } from '@local/auth/auth-verifier/user-authentication-verifier';
import { UserLoginEndpoint } from '@local/domain/user/endpoints/login-endpoint';
import { UserRepository } from '@local/domain/user/database/repository';
import { UserTokenVerifier } from '@local/auth/auth-verifier/user-token-verifier';
import { UserValidationEndpoint } from '@local/domain/user/endpoints/validation-endpoint';

if (
  !MODULE_NAME ||
  !PORT ||
  !AUTH_SERVICE_DATABASE_HOST ||
  !AUTH_SERVICE_DATABASE ||
  !AUTH_SERVICE_DATABASE_PORT ||
  !AUTH_SERVICE_DATABASE_USERNAME ||
  !AUTH_SERVICE_DATABASE_PASSWORD ||
  !JWT_SECRET
) {
  throw new Error('Required environment variables are not set');
}

const logger = getLogger(MODULE_NAME);
const authenticationMiddlewareFactory = new AuthenticationMiddlewareFactory();
const userRepository = new UserRepository(logger);
const userCredentialsVerifier = new UserCredentialsVerifier(userRepository, logger);
const userTokenVerifier = new UserTokenVerifier(logger);

const app = new ExpressAppBuilder(logger)
  .withInternalRoute(`${RoutePrefix.api}/basic`, VersionTag.v1, [
    authenticationMiddlewareFactory.getForUserCredentials(userCredentialsVerifier),
  ])
  .withInternalRouteEndpoints(`${RoutePrefix.api}/basic`, VersionTag.v1, {
    [UserLoginEndpoint.PATH]: new UserLoginEndpoint(),
  })
  .withInternalRoute(`${RoutePrefix.api}/bearer`, VersionTag.v1, [
    authenticationMiddlewareFactory.getForUserToken(userTokenVerifier),
  ])
  .withInternalRouteEndpoints(`${RoutePrefix.api}/bearer`, VersionTag.v1, {
    [UserValidationEndpoint.PATH]: new UserValidationEndpoint(),
  })
  .build();

app.listen(PORT, () => {
  logger.info(`Express server is listening on the port ${PORT}`);
});
