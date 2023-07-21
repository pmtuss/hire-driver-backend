import Joi from 'joi'
import { IUser } from '../models/user.model'

const updateProfile = Joi.object<IUser>({
  name: Joi.string().required(),
  dob: Joi.date(),
})

const userSchema = {
  updateProfile: updateProfile,
}

export default userSchema
