import { EndpointHandler } from './endpoint-handler';

/**
 * Represents a specific endpoint with handlers for requests of a different type (GET, POST, PUT, PATCH, DELETE)
 */
export interface Endpoint {
  getHandler?: EndpointHandler;
  postHandler?: EndpointHandler;
  putHandler?: EndpointHandler;
  patchHandler?: EndpointHandler;
  deleteHandler?: EndpointHandler;
}

export interface Endpoints {
  [endpoint: string]: Endpoint;
}
