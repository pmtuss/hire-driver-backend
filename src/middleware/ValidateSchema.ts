import Joi, { ObjectSchema } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { IAuthor } from '../models/author.model'
import { IBook } from '../models/book.model'
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

const joiCompoundSchema = Joi.object<ICompound>({
  commune: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
})

export const Schemas = {
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
    update: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
  },
  book: {
    create: Joi.object<IBook>({
      author: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      title: Joi.string().required(),
    }),
    update: Joi.object<IBook>({
      author: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/),
      title: Joi.string().required(),
    }),
  },
  address: {
    create: Joi.object<IAddress>({
      formatted_address: Joi.string().required(),
      isDefault: Joi.boolean(),
      name: Joi.string().required(),
      place_id: Joi.string().required(),
      compound: joiCompoundSchema,
    }),
  },
}
