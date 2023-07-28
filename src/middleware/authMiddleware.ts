import { Request, Response, NextFunction } from 'express'

import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from '../config/config'
import { Types } from 'mongoose'

interface TokenPayload extends JwtPayload {
  userId: Types.ObjectId
  role: string
}

export interface CustomRequest extends Request {
  user?: {
    userId: Types.ObjectId
    role: string
  }
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid access token' })
  }

  const token = authHeader.substring(7)
  const secret = config.jwt.accessSecret

  try {
    const decodedToken = jwt.verify(token, secret) as TokenPayload
    req.user = { userId: decodedToken.userId, role: decodedToken.userRole }
    next()
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}
