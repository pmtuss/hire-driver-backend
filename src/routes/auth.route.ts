import express from 'express'
import controller from '../controllers/auth.controller'
import { ValidateSchema } from '../middleware/ValidateSchema'
import { authSchema } from '../validates/auth.validates'
import { authMiddleware } from '../middleware/authMiddleware'
const router = express.Router()

router.post(
  '/register',
  ValidateSchema(authSchema.register),
  controller.register
)
router.post('/login', ValidateSchema(authSchema.login), controller.login)

router.post('/refresh-token', controller.refreshToken)

router.delete('/logout', authMiddleware, controller.logout)

export default router
