import { AuthController } from '../../controller/AuthController';
import { SMSController } from '../../controller/SMSController';
import { UserController } from '../../controller/UserController';
import { Endpoint, Route, SubRoute } from '../../types/Routing';
import { Express, NextFunction, Request, Response, Router } from 'express';

class ExpressRouterImpl {
  private routes: Route[];
  private router: Router;
  private paths: string[] = [];
  private static instance: ExpressRouterImpl;
  private unprotectedRoutes = [
    '/',
    '/auth/register',
    '/auth/email-verification',
    '/auth/reset-password-verification',
    '/auth/login',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/sms/send-text',
    '/sms/send-multimedia',
  ];

  private constructor() {
    this.routes = [
      {
        basePath: '/auth',
        controller: new AuthController(),
      },
      {
        basePath: '/user',
        controller: new UserController(),
      },
      {
        basePath: '/sms',
        controller: new SMSController(),
      },
    ];
    this.router = Router();
  }

  public isPublicRoute(path: string) {
    for (const route of this.unprotectedRoutes) {
      if (path.includes(route)) {
        return true;
      }
    }
    return false;
  }

  public traverseRouteTree = (route: SubRoute, basePath: string) => {
    this.router.use(`${basePath}${route.path}`, route.controller.router);
    route.controller.endpoints.forEach((endpoint: Endpoint) => {
      const isEndpointRootPath = endpoint.path === '/';
      this.paths.push(`${basePath}${route.path}${isEndpointRootPath ? '' : endpoint.path}`);
    });
    if (route.children) {
      route.children.forEach((child) => {
        this.traverseRouteTree(child, basePath + route.path);
      });
    }
  };

  public initializeRoutes() {
    this.routes.forEach((route) => {
      this.router.use(route.basePath, route.controller.router);
      route.controller.endpoints.forEach((endpoint: Endpoint) => {
        const isEndpointRootPath = endpoint.path === '/';
        this.paths.push(`${route.basePath}${isEndpointRootPath ? '' : endpoint.path}`);
      });
      if (route.children) {
        route.children.forEach((child) => {
          this.traverseRouteTree(child, route.basePath);
        });
      }
    });

    this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json({
          ServieName: process.env.npm_package_name,
          Version: process.env.npm_package_version,
        });
      } catch (err) {
        next(err);
      }
    });
    this.paths.push('/');
  }

  public getRoutes() {
    return this.paths;
  }

  public getRouter() {
    return this.router;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ExpressRouterImpl();
    }
    return this.instance;
  }
}

export const ExpressRouter = ExpressRouterImpl.getInstance();
