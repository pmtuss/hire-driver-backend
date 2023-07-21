import { NextFunction, Request, Response } from 'express'

import mongoose from 'mongoose'
import UserModel from '../models/user.model'
import { CustomRequest } from '../middleware/authMiddleware'

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.find()

    return res.status(200).json({ users })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const getUserInfoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Not found' })
    }

    const resUser = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      dob: user.dob ? new Date(user.dob).toLocaleDateString() : '',
    }

    return res.status(200).json(resUser)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const updateInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId

    const { name, dob } = req.body

    console.log(dob)

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        name: name,
        dob: dob,
      }
    )

    if (!user) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(200).json({ message: 'Updated successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}
