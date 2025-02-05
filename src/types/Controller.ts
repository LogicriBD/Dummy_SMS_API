import { Router } from 'express';
import { Endpoint } from './Routing';

export function Controller<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    router: Router = Router();
    endpoints: Endpoint[] = [];
    constructor(...args: any[]) {
      super(...args);
      if ((constructor as any)._routes) {
        for (const route of (constructor as any)._routes) {
          this.endpoints.push({
            method: route.method,
            path: route.path,
          });
          this.router[route.method as 'get' | 'post'](route.path, ...route.middlewares, route.handler.bind(this));
        }
      }
    }
  };
}

function RouteDecorator(method: 'get' | 'post', path: string, middlewares: any[] = []) {
  return function (target: any, key: string | symbol, property: PropertyDescriptor) {
    if (!target.constructor._routes) {
      target.constructor._routes = [];
    }
    target.constructor._routes.push({
      method,
      path,
      middlewares,
      handler: property.value,
    });
  };
}

/**
 *
 * @param path
 * @param middlewares
 * Note that GET methods always use query params only
 */
export function GET(path: string, middlewares: any[] = []) {
  return RouteDecorator('get', path, middlewares);
}
/**
 *
 * @param path
 * @param middlewares
 * Note that POST methods always use request body only
 */
export function POST(path: string, middlewares: any[] = []) {
  return RouteDecorator('post', path, middlewares);
}
