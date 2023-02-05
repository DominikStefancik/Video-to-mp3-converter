import { Logger } from 'pino';

import { Endpoint } from '@local/interfaces/networking/endpoint';
import { Response } from '@local/interfaces/networking/response';
import { Request } from '@local/interfaces/networking/request';
import { AuthToken } from '@local/auth/auth-token';
import { HttpResponseCode } from '@local/express/http/http-response-code';

export class UserLoginEndpoint implements Endpoint {
  public static readonly PATH = '/user/login';

  public async postHandler(
    request: Request,
    authToken: AuthToken,
    logger: Logger
  ): Promise<Response> {
    logger.info({ request, authToken }, 'UserLoginEndpoint postHandler');

    return { code: HttpResponseCode.OK, payload: authToken };
  }
}
