import * as express from 'express';
import { Logger } from 'pino';

import { AuthorizationError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export function authorizationErrorHandler(
  error: AuthorizationError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== AuthorizationError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(error.json(), `Handling error as ${HttpResponseCode.FORBIDDEN}`);
  }

  response
    .status(HttpResponseCode.FORBIDDEN)
    .json({ code: HttpResponseCode.FORBIDDEN, message: 'Forbidden' });
}
