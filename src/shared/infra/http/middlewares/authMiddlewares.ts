import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import 'dotenv/config';


import { AppError } from '@shared/errors/AppError';

interface TokenPayLoad {
  sub: string
}

async function authMiddleware(request: Request, response: Response, next: NextFunction){
  const { authorization } = request.headers

  if (!authorization) {
    throw new AppError("Token missing!", 401)
  }

  const token = authorization.replace('Bearer', '').trim()
  
  try {
    const data = verify(token, process.env.API_SECRET);

    const { sub } = data as TokenPayLoad;

    const id = sub

    request.userId = id

    return next()

  } catch {
    throw new AppError("Invalid token!", 401);
  }
}

export { authMiddleware }