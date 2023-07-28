import express, { ErrorRequestHandler } from 'express'
import createError from 'http-errors'

import authRoutes from './auth.route'
import carRoutes from './car.route'
import addressRoutes from './address.route'
import userRoutes from './user.route'
import tripRoutes from './trip.route'

import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()

router.use('/api/auth', authRoutes)
router.use('/api/cars', authMiddleware, carRoutes)
router.use('/api/addresses', authMiddleware, addressRoutes)
router.use('/api/users', authMiddleware, userRoutes)
router.use('/api/trips', authMiddleware, tripRoutes)

router.get('/test', (req, res) => {
  res.send('alo')
})

/** Error handling */
router.use((req, res, next) => {
  next(createError.NotFound('This route does not exist'))
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      // status: err.status || 500,
      message: err.message,
    },
  })
}

router.use(errorHandler)

export default router
