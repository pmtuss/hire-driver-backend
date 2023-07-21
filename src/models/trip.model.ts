import mongoose, { Date, Document, Schema, Types } from 'mongoose'
import { AddressSchema, CoordinateSchema, ICoordinate } from './address.model'
import { Status } from '../constants/enum'

export interface ITrip {
  user?: Types.ObjectId
  driver?: Types.ObjectId

  endAt?: Date
  startAt?: Date

  origin: ICoordinate
  originText: string
  destination: ICoordinate
  destinationText: string

  distance: string
  duration: string
  route: string
  carId: string

  cost: number
  rate?: number
  status?: Status
}

export interface ITripModel extends ITrip, Document {}

const TripModel = new Schema<ITripModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },

    startAt: { type: Date },
    endAt: { type: Date },

    origin: { type: CoordinateSchema, required: true },
    originText: { type: String, required: true },
    destination: { type: CoordinateSchema, required: true },
    destinationText: { type: String, required: true },

    cost: { type: Number },
    rate: { type: Number },

    route: { type: String },
    distance: { type: String },
    duration: { type: String },
    carId: { type: String },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.Created,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Trip', TripModel)
