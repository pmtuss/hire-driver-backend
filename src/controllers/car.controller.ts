import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

import CarModel, { ICar } from '../models/car.model'
import UserModel from '../models/user.model'
import { CustomRequest } from '../middleware/authMiddleware'
import carModel from '../models/car.model'

export const getCars = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!

    const user = await UserModel.findById(userId)
    if (!user) res.status(401).json({ error: 'aaaaaaaaaaaaa' })

    const cars = await CarModel.find({ user: userId })

    return res.status(200).json(cars)
  } catch (error) {
    next(error)
  }
}

export const getCar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const carId = req.params.id

    const car = await CarModel.findOne({
      _id: carId,
      user: userId,
    })

    if (!car) {
      return res
        .status(400)
        .json({ error: `Car with id: ${carId} is not exist` })
    }

    return res.status(200).json(car)
  } catch (error) {
    next(error)
  }
}

export const createCar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const car: ICar = req.body

    // set other cars is not default if newCar set is default
    if (car.isDefault) {
      await CarModel.updateMany(
        {
          user: userId,
        },
        { isDefault: false }
      )
    }

    const cars = await CarModel.find({ user: userId })

    // user have not a car --> set this is default
    if (cars.length == 0) {
      car.isDefault = true
    }

    const newCar = await CarModel.create({ ...car, user: userId })

    return res.status(201).json(newCar)
  } catch (error) {
    next(error)
  }
}

export const updateCar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const carId = req.params.id

    const carUpdate: Omit<ICar, 'user'> = req.body

    if (carUpdate.isDefault)
      await carModel.updateMany(
        { user: { $eq: userId }, _id: { $ne: carId } },
        { isDefault: false }
      )

    const updatedCar = await CarModel.findOneAndUpdate(
      { _id: carId, user: userId },
      {
        ...carUpdate,
      },
      { new: true }
    )

    if (!updatedCar) {
      res.status(400).json({ error: 'Update model is failure!' })
    }

    return res.status(200).json(updatedCar)
  } catch (error) {
    next(error)
  }
}

export const deleteCar = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const carId = req.params.id

    const car = await CarModel.findOne({
      _id: carId,
      user: userId,
    })

    if (!car) {
      return res.status(404).json({ error: 'Car is not found' })
    }

    if (car.isDefault)
      return res.status(400).json({ error: 'Cannot delete default car' })

    await CarModel.deleteOne({ _id: car._id })

    return res.status(200).json({ mesage: 'Deletion is successful!' })
  } catch (error) {
    next(error)
  }
}
