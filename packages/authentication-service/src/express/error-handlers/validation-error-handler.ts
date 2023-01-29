import * as express from 'express';
import { Logger } from 'pino';

import { HttpResponseCode } from '@local/express/http/http-response-code';
import { ValidationError } from '@local/express/validation-error';

export function validationErrorHandler(
  error: ValidationError,
  request: express.Request & { logger?: Logger },
  response: express.Response,
  next: express.NextFunction
) {
  if (error.constructor !== ValidationError) {
    next(error);
    return;
  }

  if (request.logger) {
    request.logger.warn(error);
  }

  if (error.details) {
    response
      .status(HttpResponseCode.BAD_REQUEST)
      .json({ code: HttpResponseCode.BAD_REQUEST, message: 'Bad request', details: error.details });
  } else {
    response
      .status(HttpResponseCode.BAD_REQUEST)
      .json({ code: HttpResponseCode.BAD_REQUEST, message: 'Bad request' });
  }
}
