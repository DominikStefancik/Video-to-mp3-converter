import { Endpoints } from '@local/interfaces/networking/endpoint';
import { ExpressRequestHandler } from '@local/express/express-adapter';

export interface Route {
  root: string;
  endpoints: Endpoints[];
  middleware: ExpressRequestHandler[];
}
