"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressRouter = void 0;
const AuthController_1 = require("../../controller/AuthController");
const SMSController_1 = require("../../controller/SMSController");
const UserController_1 = require("../../controller/UserController");
const express_1 = require("express");
class ExpressRouterImpl {
    constructor() {
        this.paths = [];
        this.unprotectedRoutes = [
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
        this.traverseRouteTree = (route, basePath) => {
            this.router.use(`${basePath}${route.path}`, route.controller.router);
            route.controller.endpoints.forEach((endpoint) => {
                const isEndpointRootPath = endpoint.path === '/';
                this.paths.push(`${basePath}${route.path}${isEndpointRootPath ? '' : endpoint.path}`);
            });
            if (route.children) {
                route.children.forEach((child) => {
                    this.traverseRouteTree(child, basePath + route.path);
                });
            }
        };
        this.routes = [
            {
                basePath: '/auth',
                controller: new AuthController_1.AuthController(),
            },
            {
                basePath: '/user',
                controller: new UserController_1.UserController(),
            },
            {
                basePath: '/sms',
                controller: new SMSController_1.SMSController(),
            },
        ];
        this.router = (0, express_1.Router)();
    }
    isPublicRoute(path) {
        for (const route of this.unprotectedRoutes) {
            if (path.includes(route)) {
                return true;
            }
        }
        return false;
    }
    initializeRoutes() {
        this.routes.forEach((route) => {
            this.router.use(route.basePath, route.controller.router);
            route.controller.endpoints.forEach((endpoint) => {
                const isEndpointRootPath = endpoint.path === '/';
                this.paths.push(`${route.basePath}${isEndpointRootPath ? '' : endpoint.path}`);
            });
            if (route.children) {
                route.children.forEach((child) => {
                    this.traverseRouteTree(child, route.basePath);
                });
            }
        });
        this.router.get('/', (req, res, next) => {
            try {
                res.json({
                    ServieName: process.env.npm_package_name,
                    Version: process.env.npm_package_version,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.paths.push('/');
    }
    getRoutes() {
        return this.paths;
    }
    getRouter() {
        return this.router;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ExpressRouterImpl();
        }
        return this.instance;
    }
}
exports.ExpressRouter = ExpressRouterImpl.getInstance();
//# sourceMappingURL=ExpressRouter.js.map