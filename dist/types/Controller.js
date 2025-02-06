"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = Controller;
exports.GET = GET;
exports.POST = POST;
const express_1 = require("express");
function Controller(constructor) {
    return class extends constructor {
        constructor(...args) {
            super(...args);
            this.router = (0, express_1.Router)();
            this.endpoints = [];
            if (constructor._routes) {
                for (const route of constructor._routes) {
                    this.endpoints.push({
                        method: route.method,
                        path: route.path,
                    });
                    this.router[route.method](route.path, ...route.middlewares, route.handler.bind(this));
                }
            }
        }
    };
}
function RouteDecorator(method, path, middlewares = []) {
    return function (target, key, property) {
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
function GET(path, middlewares = []) {
    return RouteDecorator('get', path, middlewares);
}
/**
 *
 * @param path
 * @param middlewares
 * Note that POST methods always use request body only
 */
function POST(path, middlewares = []) {
    return RouteDecorator('post', path, middlewares);
}
//# sourceMappingURL=Controller.js.map