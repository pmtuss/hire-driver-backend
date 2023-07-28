import mongoose, { Date, Document, Schema, Types } from 'mongoose'
import { AddressSchema, CoordinateSchema, ICoordinate } from './address.model'
import { TripStatus } from '../constants/enum'

const carSchema = new Schema(
  {
    model: { type: String },
    color: { type: String },
    plate: { type: String },
  },
  {
    _id: false,
    versionKey: false,
  }
)

export interface ITrip {
  passenger?: Types.ObjectId
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

  car: {
    model: string
    color: string
    plate: string
  }

  cost: number
  rate?: number
  status?: TripStatus
}

export interface ITripModel extends ITrip, Document {}

const TripModel = new Schema<ITripModel>(
  {
    passenger: { type: Schema.Types.ObjectId, ref: 'User' },
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
    car: { type: carSchema },

    status: {
      type: String,
      enum: Object.values(TripStatus),
      default: TripStatus.CREATED,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Trip', TripModel)
