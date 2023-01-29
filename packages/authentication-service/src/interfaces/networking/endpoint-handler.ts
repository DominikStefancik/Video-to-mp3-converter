import { Logger } from 'pino';

import { AuthToken } from '@local/auth/auth-token';
import { Request } from './request';
import { Response } from './response';

export interface HandlerResponse<T> {
  code: number;
  payload: T;
}

export type EndpointHandler = (
  request: Request,
  token: AuthToken,
  logger: Logger
) => Promise<Response>;
