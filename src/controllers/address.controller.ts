import { Request, Response, NextFunction } from 'express'
import { CustomRequest } from '../middleware/authMiddleware'
import AddressModel, { IAddress } from '../models/address.model'

export const createAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const address: IAddress = req.body

    // set other cars is not default if newCar set is default
    if (address.isDefault) {
      await AddressModel.updateMany(
        {
          user: userId,
        },
        { isDefault: false }
      )
    }

    const addresses = await AddressModel.find({ user: userId })

    // user have not a car --> set this is default
    if (addresses.length == 0) {
      address.isDefault = true
    }

    const newAddress = await AddressModel.create({
      ...address,
      user: userId,
    })

    if (!newAddress) {
      return res.status(400).json({ error: 'Cannot create this Address' })
    }

    res.status(201).json(newAddress)
  } catch (error) {
    next(error)
  }
}

export const getAddresses = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!

    const addresses = await AddressModel.find({
      user: userId,
    })

    res.status(200).json(addresses)
  } catch (error) {
    next(error)
  }
}

export const getAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const { id } = req.params

    const address = await AddressModel.findOne({ _id: id, user: userId })

    if (!address) {
      return res.status(404).json({ error: 'Address is not found' })
    }

    res.status(201).json(address)
  } catch (error) {
    next(error)
  }
}

export const updateAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const { id } = req.params

    const address: IAddress = req.body

    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: id, user: userId },
      {
        ...address,
        user: userId,
      },
      { new: true }
    )

    if (!updatedAddress) {
      return res.status(404).json({ error: 'Cannot update this Address' })
    }

    if (address.isDefault) {
      await AddressModel.updateMany(
        {
          _id: { $ne: id },
          user: userId,
        },
        { isDefault: false }
      )
    }

    res.status(200).json(updatedAddress)
  } catch (error) {
    next(error)
  }
}

export const deleteAddress = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user!
    const { id } = req.params

    const address = await AddressModel.findOne({
      _id: id,
      user: userId,
    })

    if (!address) {
      return res.status(404).json({ error: 'Address is not found' })
    }

    if (address.isDefault)
      return res.status(400).json({ error: 'Cannot delete default address' })

    await AddressModel.deleteOne({ _id: address._id })

    return res.status(200).json({ mesage: 'Deletion is successful!' })
  } catch (error) {
    next(error)
  }
}
