import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IAddress, ICompound } from '../models/address.model'

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      })
      next()
    } catch (error) {
      const errors = (error as any).details.reduce(
        (result: any, currentValue: any) => {
          const key = currentValue.context.key
          const message = currentValue.message
          return { ...result, [key]: message }
        },
        {}
      )

      return res.status(422).json({ errors })
    }
  }
}
