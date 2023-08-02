import { Request, Response, NextFunction } from 'express'
import { CustomRequest } from '../middleware/authMiddleware'
import TripModel, { ITrip } from '../models/trip.model'
import { Role, TripStatus } from '../constants/enum'

export const createTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!

    if (role !== Role.PASSENGER) {
      return res.status(400).json({ error: 'You cannot create trip' })
    }

    const trip: ITrip = req.body

    const newTrip = await TripModel.create({
      ...trip,
      passenger: userId,
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
    const { userId, role } = req.user!

    let trips
    if (role === Role.PASSENGER) {
      trips = await TripModel.find({ passenger: userId })
    } else if (role === Role.DRIVER) {
      trips = await TripModel.find({ driver: userId })
    } else {
      trips = await TripModel.find()
    }

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
    const { id } = req.params

    const trip = await TripModel.findOne({ _id: id })

    if (!trip) {
      return res.status(404).json({ error: 'Trip is not found' })
    }

    res.status(201).json(trip)
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
    const { id } = req.params

    const trip: Partial<ITrip> = req.body

    const updatedTrip = await TripModel.findOneAndUpdate(
      { _id: id },
      {
        ...trip,
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
    const { userId } = req.user!
    const { id } = req.params

    const deleteTrip = await TripModel.findOneAndDelete({
      _id: id,
      passenger: userId,
    })

    if (!deleteTrip) {
      return res.status(404).json({ error: 'Cannot delete this trip' })
    }

    res.status(200).json(deleteTrip)
  } catch (error) {
    next(error)
  }
}

export const acceptTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!
    const { id } = req.params

    if (role === Role.PASSENGER) {
      return res
        .status(400)
        .json({ error: 'You are passenger, cannot accept the trip' })
    }

    const trip = await TripModel.findById(id)

    if (!trip) {
      return res.status(404).json({ error: 'Trip does not exist!' })
    }

    if (trip.status === TripStatus.CANCELED) {
      return res.status(400).json({ error: 'The trip is canceled' })
    }

    if (trip.status !== TripStatus.CREATED) {
      return res
        .status(400)
        .json({ error: 'The trip is accepted by other driver!' })
    }

    trip.status = TripStatus.ACCEPTED
    trip.driver = userId

    await trip.save()

    res.status(200).json({ message: 'The trip has been accepted' })
  } catch (error) {
    next(error)
  }
}

export const getAccepableTrips = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!

    if (role === Role.PASSENGER) {
      return res.status(400).json({ error: 'You cannot access this route' })
    }

    const trips = await TripModel.find({
      status: TripStatus.CREATED,
    })

    res.status(200).json(trips)
  } catch (error) {
    next(error)
  }
}

export const getCurrentTrip = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, role } = req.user!

    let trip

    if (role === Role.PASSENGER) {
      trip = await TripModel.findOne({
        passenger: userId,
        status: {
          $nin: [TripStatus.FINISHED, TripStatus.CANCELED],
        },
      })
    } else if (role === Role.DRIVER) {
      trip = await TripModel.findOne({
        driver: userId,
        status: {
          $nin: [TripStatus.FINISHED, TripStatus.CANCELED],
        },
      })
    }

    res.status(200).json(trip)
  } catch (error) {
    next(error)
  }
}
