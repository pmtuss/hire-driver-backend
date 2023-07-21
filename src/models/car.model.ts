import mongoose, { Document, Schema, Types } from 'mongoose'

export interface ICar {
  model: string
  color: string
  plate: string
  isDefault: boolean
  user: Types.ObjectId
}

export interface ICarModel extends ICar, Document {}

const CarModel = new Schema<ICarModel>(
  {
    model: { type: String, required: true },
    color: { type: String, required: true },
    plate: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model<ICarModel>('Car', CarModel)
