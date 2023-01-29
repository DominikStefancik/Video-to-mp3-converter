import { AuthToken } from '@local/auth/auth-token';

interface QueryParameters {
  [key: string]: string | string[] | QueryParameters | QueryParameters[] | undefined;
}

interface UrlParameters {
  [key: string]: string;
}

export interface Headers {
  [key: string]: string | string[] | undefined;
}

export interface Request {
  body: any;
  lowercaseHeaders: Headers;
  urlParameters: UrlParameters;
  queryParameters: QueryParameters;
  correlationId: string;
}

export interface AuthEnrichment {
  token: AuthToken;
}
