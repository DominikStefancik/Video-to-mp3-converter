import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Logger } from 'pino';
import helmet from 'helmet';

import { Endpoints } from '@local/interfaces/networking/endpoint';
import { authenticationErrorHandler } from '@local/express/error-handlers/authentication-error-handler';
import { authorizationErrorHandler } from '@local/express/error-handlers/authorization-error-handler';
import { internalServerErrorHandler } from '@local/express/error-handlers/internal-server-error-handler';
import { invalidRequestErrorHandler } from '@local/express/error-handlers/invalid-request-error-handler';
import { notFoundErrorHandler } from '@local/express/error-handlers/not-found-error-handler';
import { unknownErrorHandler } from '@local/express/error-handlers/unknown-error-handler';
import { validationErrorHandler } from '@local/express/error-handlers/validation-error-handler';
import { ExpressRequestHandler } from '@local/express/express-adapter';
import { NotFoundError } from '@local/express/http/http-errors';
import { HttpResponseCode } from '@local/express/http/http-response-code';
import { LoggingMiddlewareFactory } from '@local/express/middleware/logging-middleware-factory';
import { RouterFactory } from '@local/express/routing/router-factory';
import { VersionTag } from '@local/express/routing/routes';
import { Route } from '@local/express/routing/route';
import urlJoin = require('url-join');

enum Consumer {
  public = 'public',
}

interface EndpointCollection {
  [consumer: string]: {
    [prefix: string]: {
      [versionTag: string]: {
        endpoints: Endpoints[];
        middleware: ExpressRequestHandler[];
      };
    };
  };
}

/**
 * Class for building an Express app. Sets all routes with respective request handlers, logging middleware and
 * authentication middleware for verifying an authenticated user in incoming requests.
 */
export class ExpressAppBuilder {
  private readonly loggingMiddlewareFactory: LoggingMiddlewareFactory;
  private readonly defaultPrefix: { [key in Consumer]: string };
  private readonly defaultMiddleware: {
    [key in Consumer]: ExpressRequestHandler[];
  };
  private readonly routerFactory: RouterFactory;
  private readonly endpoints: EndpointCollection;

  public constructor(private readonly logger: Logger) {
    this.loggingMiddlewareFactory = new LoggingMiddlewareFactory(logger);
    this.routerFactory = new RouterFactory();
    this.defaultPrefix = {
      [Consumer.public]: '',
    };
    this.defaultMiddleware = {
      [Consumer.public]: [],
    };
    this.endpoints = {};
  }

  build(): express.Express {
    this.logger.info('Creating Express server...');
    const expressApp = this.createExpressApp();

    this.setupLogging(expressApp);
    this.setupHealthRoute(expressApp);
    this.setupContentRoutes(expressApp);
    this.setupFallbackRoute(expressApp);
    this.setupErrorHandlers(expressApp);

    this.logger.info('Express server created');

    return expressApp;
  }

  private createExpressApp(): express.Express {
    const expressApp: express.Express = express();

    expressApp.enable('trust proxy');
    expressApp.use(cors({ origin: true }));
    expressApp.use(cookieParser());
    expressApp.use(helmet());
    // allows making cross origin sharing requests
    expressApp.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    // express.json() is an Express built-in middleware which retrieves data from a request body
    expressApp.use(express.json());

    return expressApp;
  }

  public withPublicRoute(
    prefix: string,
    versionTag: VersionTag,
    middleware: ExpressRequestHandler[]
  ): ExpressAppBuilder {
    return this.withRoute(Consumer.public, prefix, versionTag, middleware);
  }

  public withPublicRouteEndpoints(prefix: string, versionTag: VersionTag, endpoints: Endpoints) {
    // A route for these endpoints has to be created before the endpoints are added, otherwise an error is thrown
    return this.withEndpoints(Consumer.public, prefix, versionTag, endpoints);
  }

  public withPublicEndpoints(versionTag: VersionTag, endpoints: Endpoints) {
    const consumer = Consumer.public;

    return this.withDefaultRoute(consumer, versionTag).withEndpoints(
      consumer,
      this.defaultPrefix[consumer],
      versionTag,
      endpoints
    );
  }

  private withDefaultRoute(consumer: Consumer, versionTag: VersionTag): ExpressAppBuilder {
    const prefix = this.defaultPrefix[consumer];
    const route = this.endpoints[consumer]?.[prefix]?.[versionTag];

    // the default route is already set
    if (route) {
      return this;
    }

    return this.withRoute(consumer, prefix, versionTag, this.defaultMiddleware[consumer]);
  }

  private withRoute(
    consumer: Consumer,
    prefix: string,
    versionTag: VersionTag,
    middleware: ExpressRequestHandler[]
  ): ExpressAppBuilder {
    const route = this.endpoints[consumer]?.[prefix]?.[versionTag];

    if (route) {
      throw new Error(`Route ${consumer} ${prefix} ${versionTag} already created`);
    }

    this.endpoints[consumer] = this.endpoints[consumer] || {};
    const consumerEndpoint = this.endpoints[consumer];
    consumerEndpoint[prefix] = consumerEndpoint[prefix] || {};
    const prefixEndpoint = consumerEndpoint[prefix];
    prefixEndpoint[versionTag] = prefixEndpoint[versionTag] || {
      endpoints: [],
      middleware,
    };

    return this;
  }

  private withEndpoints(
    consumer: Consumer,
    prefix: string,
    versionTag: VersionTag,
    endpoints: Endpoints
  ) {
    const route = this.endpoints[consumer]?.[prefix]?.[versionTag];

    if (!route) {
      throw new Error(`Route ${consumer} ${prefix} ${versionTag} does not exist`);
    }

    this.validateEndpoints(endpoints);
    route.endpoints.push(endpoints);

    return this;
  }

  private validateEndpoints(endpoints: Endpoints): void {
    Object.keys(endpoints).forEach((endpoint) => {
      if (endpoint.length > 0 && endpoint[0] !== '/') {
        throw new Error('Endpoints have to start with a dash');
      }
    });
  }

  private setupContentRoutes(expressApp: express.Express) {
    Object.entries(this.endpoints).forEach(([consumer, consumerEndpoints]) => {
      Object.entries(consumerEndpoints).forEach(([prefix, prefixEndpoints]) => {
        Object.entries(prefixEndpoints).forEach(([versionTag, { endpoints, middleware }]) => {
          const root = urlJoin('/', consumer, prefix, versionTag);
          this.setupRoute(expressApp, { root, endpoints, middleware });
        });
      });
    });
  }

  private setupRoute(expressApp: express.Express, route: Route): void {
    const router = this.routerFactory.getFor(route);
    expressApp.use(route.root, router);
  }

  private setupHealthRoute(expressApp: express.Express): void {
    expressApp.get('/health', (_request: express.Request, response: express.Response) =>
      response.status(HttpResponseCode.OK).json({ message: 'Server is accessible' })
    );
  }

  private setupFallbackRoute(expressApp: express.Express): void {
    expressApp.use('*', (_request: express.Request, _response: express.Response) => {
      throw new NotFoundError();
    });
  }

  private setupLogging(expressApp: express.Express): void {
    expressApp.use(this.loggingMiddlewareFactory.get());
  }

  private setupErrorHandlers(expressApp: express.Express): void {
    expressApp.use(authenticationErrorHandler);
    expressApp.use(authorizationErrorHandler);
    expressApp.use(notFoundErrorHandler);
    expressApp.use(invalidRequestErrorHandler);
    expressApp.use(validationErrorHandler);
    expressApp.use(internalServerErrorHandler);
    expressApp.use(unknownErrorHandler);
  }
}
