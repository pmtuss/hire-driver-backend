import express from 'express'
import {
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from '../controllers/trip.controller'

const router = express.Router()

router.get('/', getTrips)
router.get('/:id', getTrip)

router.post('/', createTrip)
router.put('/:id', updateTrip)
router.delete('/:id', deleteTrip)

export default router
