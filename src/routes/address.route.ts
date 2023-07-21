import express from 'express'

import { ValidateSchema } from '../middleware/ValidateSchema'

import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from '../controllers/address.controller'
import addressSchema from '../validates/address.validate'

const router = express.Router()

router.get('/', getAddresses)
router.get('/:id', getAddress)

router.post('/', ValidateSchema(addressSchema.create), createAddress)
router.put('/:id', ValidateSchema(addressSchema.update), updateAddress)

router.delete('/:id', deleteAddress)

export default router
