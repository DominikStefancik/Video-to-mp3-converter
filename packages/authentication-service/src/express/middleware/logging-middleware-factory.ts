import * as express from 'express';
import { Logger, pino } from 'pino';

export interface LoggerEnrichment {
  logger: Logger;
  correlationId: string;
}

/**
 * Factory class creating a middleware for logging. Logging is enriched with labels for a better inter-service
 * communication.
 */
export class LoggingMiddlewareFactory {
  public constructor(private readonly logger: pino.Logger) {}

  public get(): (
    request: express.Request & Partial<LoggerEnrichment>,
    response: express.Response,
    next: express.NextFunction
  ) => void {
    return (
      request: express.Request & Partial<LoggerEnrichment>,
      _response: express.Response,
      next: express.NextFunction
    ) => {
      request.logger = this.logger;

      next();
    };
  }
}
