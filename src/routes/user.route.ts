import express from 'express'
import {
  findAll,
  getInfo,
  getUserInfoById,
  updateAvatar,
  updateInfo,
} from '../controllers/user.controller'
import { ValidateSchema } from '../middleware/ValidateSchema'
import userSchema from '../validates/user.validate'

const router = express.Router()

router.get('/', findAll)

router.get('/profile', getInfo)
router.put('/profile', ValidateSchema(userSchema.updateProfile), updateInfo)

router.get('/:id', getUserInfoById)

router.post(
  '/update-avatar',
  ValidateSchema(userSchema.updateAvatar),
  updateAvatar
)

export default router
