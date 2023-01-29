import * as express from 'express';
import { Logger } from 'pino';

import { InvalidRequestError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export function invalidRequestErrorHandler(
  error: InvalidRequestError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== InvalidRequestError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(error.json(), `Handling error as ${HttpResponseCode.BAD_REQUEST}`);
  }

  if (error.responseMessage) {
    response.status(HttpResponseCode.BAD_REQUEST).json({
      code: HttpResponseCode.BAD_REQUEST,
      message: `Invalid request: ${error.responseMessage}`,
    });
  } else {
    response
      .status(HttpResponseCode.BAD_REQUEST)
      .json({ code: HttpResponseCode.BAD_REQUEST, message: 'Invalid request' });
  }
}
