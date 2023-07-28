import Joi from 'joi'
import { IUser } from '../models/user.model'

const updateProfile = Joi.object<IUser>({
  name: Joi.string().required(),
  dob: Joi.date(),
})

const updateAvatar = Joi.object({
  avatar: Joi.string().required(),
})

const userSchema = {
  updateProfile: updateProfile,
  updateAvatar,
}

export default userSchema
