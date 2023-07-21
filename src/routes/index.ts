import express, { ErrorRequestHandler } from 'express'
import createError from 'http-errors'

import authorRoutes from './author.route'
import bookRoutes from './book.route'
import authRoutes from './auth.route'
import carRoutes from './car.route'
import addressRoutes from './address.route'
import userRoutes from './user.route'
import tripRoutes from './trip.route'

import { authMiddleware } from '../middleware/authMiddleware'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/authors', authorRoutes)
router.use('/books', bookRoutes)
router.use('/cars', authMiddleware, carRoutes)
router.use('/addresses', authMiddleware, addressRoutes)
router.use('/users', authMiddleware, userRoutes)
router.use('/trips', authMiddleware, tripRoutes)

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
