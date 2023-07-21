import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/config'

import routes from './routes'

const app = express()

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.log('Db connected')
    startServer()
  })
  .catch((error) => {
    console.log('Unable to connect: ')
    console.log(error)
  })

/** Start server */
const startServer = () => {
  app.use(morgan('dev'))

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://localhost:3001',
        'http://10.78.79.26:3001',
        'http://10.78.79.103:3001',

        'http://192.168.0.103:3001',
      ],
      credentials: true,
    })
  )

  /** Routes */
  app.use(routes)

  /** Test */
  app.use('/test', (req, res) => {
    res.send('alo')
  })

  app.listen(config.server.port, () => {
    console.log(`Server is running at port: ${config.server.port}`)
  })
}
