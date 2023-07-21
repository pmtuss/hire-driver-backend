import Joi from 'joi'
import { ICar } from '../models/car.model'

const create = Joi.object<ICar>({
  color: Joi.string().required(),
  plate: Joi.string().required(),
  model: Joi.string().required(),
  isDefault: Joi.boolean().default(false),
})

const carSchema = {
  create,
  update: create,
}

export default carSchema
