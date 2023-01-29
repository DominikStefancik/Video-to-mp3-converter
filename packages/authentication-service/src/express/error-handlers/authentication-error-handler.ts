import * as express from 'express';
import { Logger } from 'pino';

import { AuthenticationError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export function authenticationErrorHandler(
  error: AuthenticationError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== AuthenticationError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(error.json(), `Handling error as ${HttpResponseCode.UNAUTHORIZED}`);
  }

  response
    .status(HttpResponseCode.UNAUTHORIZED)
    .json({ code: HttpResponseCode.UNAUTHORIZED, message: 'Unauthorized' });
}
