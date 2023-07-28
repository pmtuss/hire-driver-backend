import Joi from 'joi'
import { IAddress, ICompound, ICoordinate } from '../models/address.model'

const compoundSchema = Joi.object<ICompound>({
  commune: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
})

const locationSchema = Joi.object<ICoordinate>({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
})

const create = Joi.object<IAddress>({
  // compound: compoundSchema,
  location: locationSchema,
  formatted_address: Joi.string().required(),
  name: Joi.string().required(),
  // place_id: Joi.string().required(),
  isDefault: Joi.boolean().default(false),
})

const addressSchema = {
  create: create,
  update: create,
}

export default addressSchema
