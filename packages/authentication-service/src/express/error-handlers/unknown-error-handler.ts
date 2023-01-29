import * as express from 'express';
import { Logger } from 'pino';

import { HttpResponseCode } from '@local/express/http/http-response-code';

export function unknownErrorHandler(
  error: Error,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  _next: express.NextFunction
) {
  if (request.logger) {
    request.logger.warn(
      {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      `Handling error as ${HttpResponseCode.INTERNAL_SERVER_ERROR}`
    );
  }

  response
    .status(HttpResponseCode.INTERNAL_SERVER_ERROR)
    .json({ code: HttpResponseCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
}
