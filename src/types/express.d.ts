import { UserType } from '../database/model/User';
import { Endpoint } from './Routing';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      phone: string[];
      active: boolean;
      verified: boolean;
      lock?: {
        loginAttempts: number;
        isLocked: boolean;
        feedback?: string;
        lockedAt?: Date;
      };
    }

    interface Request {
      user?: User; // Attach the User type to the Request object
    }
  }
}

declare module '../controller/AuthController' {
  interface AuthController {
    router: Router;
    endpoints: Endpoint[];
  }
}

declare module '../controller/UserController' {
  interface UserController {
    router: Router;
    endpoints: Endpoint[];
  }
}

declare module '../controller/SampleController' {
  interface SampleController {
    router: Router;
    endpoints: Endpoint[];
  }
}
