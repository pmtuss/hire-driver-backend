import Joi from 'joi'
import { IUser } from '../models/user.model'
import { Role } from '../constants/enum'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto extends IUser {
  confirmPassword: string
}

export const authSchema = {
  login: Joi.object<LoginDto>({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  }),
  register: Joi.object<RegisterDto>({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .messages({ 'any.only': '{{#label}} does not match' }),
    name: Joi.string().min(3).required(),
    phone: Joi.string()
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
      .messages({
        'string.pattern.base': 'Invalid phone number',
      }),
    role: Joi.string().valid(Role.DRIVER, Role.PASSENGER),
  }),
}
