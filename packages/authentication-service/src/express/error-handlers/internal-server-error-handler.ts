import * as express from 'express';
import { Logger } from 'pino';

import { InternalServerError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export function internalServerErrorHandler(
  error: InternalServerError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== InternalServerError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(
      error.json(),
      `Handling error as ${HttpResponseCode.INTERNAL_SERVER_ERROR}`
    );
  }

  response
    .status(HttpResponseCode.INTERNAL_SERVER_ERROR)
    .json({ code: HttpResponseCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
}
