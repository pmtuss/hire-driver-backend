import { Request, Response, NextFunction } from 'express'
import { CustomRequest } from '../middleware/authMiddleware'
import TripModel, { ITrip } from '../models/trip.model'

export const createTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req
    const trip: ITrip = req.body

    const newTrip = await TripModel.create({
      ...trip,
      user: userId,
    })

    if (!newTrip) {
      return res.status(400).json({ error: 'Cannot create Trip' })
    }

    res.status(201).json(newTrip)
  } catch (error) {
    next(error)
  }
}

export const getTrips = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req

    const trips = await TripModel.find({
      user: userId,
    })

    res.status(200).json(trips)
  } catch (error) {
    next(error)
  }
}

export const getTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req
    const { id } = req.params

    const address = await TripModel.findOne({ _id: id, user: userId })

    if (!address) {
      return res.status(404).json({ error: 'Trip is not found' })
    }

    res.status(201).json(address)
  } catch (error) {
    next(error)
  }
}

export const updateTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req
    const { id } = req.params

    const trip: ITrip = req.body

    const updatedTrip = await TripModel.findOneAndUpdate(
      { _id: id, user: userId },
      {
        ...trip,
        user: userId,
      },
      { new: true }
    )

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Cannot update this trip' })
    }

    res.status(200).json(updatedTrip)
  } catch (error) {
    next(error)
  }
}

export const deleteTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req
    const { id } = req.params

    const deleteTrip = await TripModel.findOneAndDelete({
      _id: id,
      user: userId,
    })

    if (!deleteTrip) {
      return res.status(404).json({ error: 'Cannot delete this trip' })
    }

    res.status(200).json(deleteTrip)
  } catch (error) {
    next(error)
  }
}
