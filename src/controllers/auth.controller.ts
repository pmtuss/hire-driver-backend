import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/user.model'

import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs'
import { config } from '../config/config'
import { CustomRequest } from '../middleware/authMiddleware'
import { Role } from '../constants/enum'

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, role } = req.body

    const existingUser = await UserModel.findOne({ email })

    if (existingUser)
      return res.status(409).json({ error: `Email này đã được đăng ký` })

    const user = new UserModel({
      email,
      password,
      name,
      phone,
      role: role || Role.PASSENGER,
    })
    const savedUser = await user.save()

    const { accessExpiresIn, accessSecret } = config.jwt

    const token = jwt.sign(
      { userId: savedUser._id, userRole: savedUser.role },
      accessSecret,
      {
        expiresIn: accessExpiresIn,
      }
    )

    res.status(201).json({ token, message: 'User registered successfully!' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ error: 'Email hoặc mật khẩu không chính xác' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ error: 'Email hoặc mật khẩu không chính xác' })
    }

    const { accessSecret, accessExpiresIn } = config.jwt
    const token = jwt.sign(
      { userId: user._id, userRole: user.role },
      accessSecret,
      {
        expiresIn: accessExpiresIn,
      }
    )

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  res.send('Logout')
}

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send('refresh-token')
}

export default {
  register,
  login,
  logout,
  refreshToken,
}
