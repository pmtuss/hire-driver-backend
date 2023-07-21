import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { Role } from '../constants/enum'

export interface IUser {
  email: string
  password: string
  name: string
  phone: string
  dob: string
  role: string
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  dob: {
    type: Date,
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.PASSENGER,
  },
})

UserSchema.pre('save', async function () {
  try {
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
  } catch (error) {}
})

export default mongoose.model<IUserModel>('User', UserSchema)
