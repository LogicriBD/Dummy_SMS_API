import { AuthRepository } from '../database/repository/AuthRepository';
import { IJwtToken } from '../types/Auth';
import { TokenType } from '../types/enums/AuthToken';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from './ApiError';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../database/repository/UserRepository';

class AuthManagerImpl {
  async verifyToken(token: string) {
    const JWTSecret = process.env.JWT_SECRET;
    if (!JWTSecret) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `JWT Secret not found`);
    }
    const payload = jwt.verify(token, JWTSecret) as IJwtToken;
    if (!payload || !payload.id || !payload.userId || !payload.type) {
      throw new ApiError(StatusCodes.FORBIDDEN, `Malformed Token`);
    }
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new ApiError(StatusCodes.FORBIDDEN, `Token has expired`);
    }
    if (payload.type === TokenType.ACCESS) {
      return {
        tokenId: payload.id,
        userId: payload.userId,
        type: payload.type,
      };
    }
    const authToken = await AuthRepository.findUserTokenByTokenAndType({
      userId: payload.userId,
      token: token,
      type: payload.type as TokenType,
    });
    if (!authToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, `Token is Invalid`);
    }
    return {
      tokenId: payload.id,
      userId: payload.userId,
      type: payload.type,
    };
  }

  generateToken = async (userId: string, type: TokenType): Promise<{ token: string; expires: Date } | null> => {
    try {
      let expires: Date;
      if (type === TokenType.ACCESS) {
        expires = new Date(Date.now() + Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) * 60 * 1000);
      } else if (type === TokenType.REFRESH) {
        expires = new Date(Date.now() + Number(process.env.JWT_REFRESH_EXPIRATION_MINUTES) * 60 * 1000);
      } else if (type === TokenType.RESET_PASSWORD) {
        expires = new Date(Date.now() + Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) * 60 * 1000);
      } else if (type === TokenType.VERIFY_EMAIL) {
        expires = new Date(Date.now() + Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES) * 60 * 1000);
      } else if (type === TokenType.RESET_LINK) {
        expires = new Date(Date.now() + Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) * 60 * 1000);
      } else {
        return null;
      }
      const id = uuidv4();
      const payload: IJwtToken = {
        id,
        userId,
        type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(expires.getTime() / 1000),
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET!);
      const user = await UserRepository.findById(userId);

      if (type !== TokenType.ACCESS) {
        const authToken = await AuthRepository.insertOne({
          user: {
            _id: user.id,
            email: user.email,
            username: user.username,
          },
          expires,
          type,
          token,
        });
        if (!authToken) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Token could not be created for userId: ${userId}`);
        }
      }
      return { token, expires };
    } catch (error: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Token could not be created for userId: ${userId} due to ${error.message}`,
      );
    }
  };

  generateAuthTokens = async (userId: string) => {
    await AuthRepository.deleteManyByUserId(userId);
    const access = await this.generateToken(userId, TokenType.ACCESS);
    const refresh = await this.generateToken(userId, TokenType.REFRESH);
    return {
      access,
      refresh,
    };
  };

  generateNewAccessToken = async (refreshToken: string) => {
    const token = await this.verifyToken(refreshToken);
    const access = this.generateToken(token.userId, TokenType.ACCESS);
    return access;
  };

  async getVerifiedUser(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'This phone number has not been registered. Please contact your administrator for help.',
      );
    } else if (!user.active) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deactivated. Please contact your administrator for more information.',
      );
    } else if (!user.verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Your account has not been verified yet. Please verify to continue.');
    } else if (user.lock) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Your account has been locked. Please contact your administrator for more information.',
      );
    }
    return user;
  }

  async getRegisteredUser(email: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'The phone number is not yet registered. Please register to continue.');
    } else if (!user.active) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Your account has been deactivated. Please contact your administrator for more information.',
      );
    } else if (user.verified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Your account has already been registered. Please login to continue.');
    } else if (user.lock) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Your account has been locked. Please contact your administrator for more information.',
      );
    }
    return user;
  }
}

export const AuthManager = new AuthManagerImpl();
