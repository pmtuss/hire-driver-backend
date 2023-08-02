import express from 'express'
import {
  acceptTrip,
  createTrip,
  deleteTrip,
  getAccepableTrips,
  getCurrentTrip,
  getTrip,
  getTrips,
  updateTrip,
} from '../controllers/trip.controller'

const router = express.Router()

router.get('/', getTrips)
router.get('/acceptable', getAccepableTrips)
router.get('/currentTrip', getCurrentTrip)

router.get('/:id', getTrip)

router.post('/', createTrip)
router.put('/:id', updateTrip)
router.get('/:id/acceptTrip', acceptTrip)

router.delete('/:id', deleteTrip)

export default router
