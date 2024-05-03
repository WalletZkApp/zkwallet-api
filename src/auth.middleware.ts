import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

/** The AuthMiddleware is used to
 * (1) read the request header bearer token/user access token
 * (2) decrypt the access token to get the user object
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async use(req: Request, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;

    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user: any = null;

    if (!bearerHeader || !accessToken) {
      return next();
    }

    const jwtSecret = process.env.AUTH_JWT_SECRET;

    try {
      user = verify(accessToken, jwtSecret || '');
    } catch (error) {
      user = null;
    }

    if (user) {
      req.user = user;
    }

    next();
  }
}
