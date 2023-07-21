import mongoose, { Schema, Document, Types } from 'mongoose'

// Coordinate
export interface ICoordinate {
  lat: number
  lng: number
}

export const CoordinateSchema = new Schema<ICoordinate>(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
)

// Compound
export interface ICompound {
  district: string
  commune: string
  province: string
}

// export interface ICompoundModel extends ICompound, Document{}

export const CompoundSchema = new Schema<ICompound>(
  {
    district: { type: String },
    commune: { type: String },
    province: { type: String },
  },
  { _id: false }
)

// Address
export interface IAddress {
  formatted_address: string
  place_id: string
  name: string
  location: ICoordinate
  compound: ICompound
  isDefault: boolean
  user: Types.ObjectId
}

export interface IAddressModel extends IAddress, Document {}

export const AddressSchema = new Schema<IAddressModel>(
  {
    formatted_address: {
      type: String,
      require: true,
    },
    place_id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    location: {
      type: CoordinateSchema,
      required: true,
    },
    compound: {
      type: CompoundSchema,
      required: true,
    },
    isDefault: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  },

  { timestamps: true }
)

export default mongoose.model<IAddressModel>('Address', AddressSchema)
