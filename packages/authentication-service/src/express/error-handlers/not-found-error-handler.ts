import * as express from 'express';
import { Logger } from 'pino';

import { NotFoundError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export function notFoundErrorHandler(
  error: NotFoundError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== NotFoundError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(error.json(), `Handling error as ${HttpResponseCode.NOT_FOUND}`);
  }

  if (error.responseMessage) {
    response
      .status(HttpResponseCode.NOT_FOUND)
      .json({ code: HttpResponseCode.NOT_FOUND, message: `Not found: ${error.responseMessage}` });
  } else {
    response
      .status(HttpResponseCode.NOT_FOUND)
      .json({ code: HttpResponseCode.NOT_FOUND, message: 'Not found' });
  }
}
