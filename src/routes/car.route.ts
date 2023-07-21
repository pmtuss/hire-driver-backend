import express from 'express'
import {
  createCar,
  deleteCar,
  getCar,
  getCars,
  updateCar,
} from '../controllers/car.controller'
import { ValidateSchema } from '../middleware/ValidateSchema'
import carSchema from '../validates/car.validate'

const router = express.Router()

router.get('/', getCars)
router.get('/:id', getCar)

router.post('/', ValidateSchema(carSchema.create), createCar)
router.put('/:id', ValidateSchema(carSchema.update), updateCar)

router.delete('/:id', deleteCar)

export default router
