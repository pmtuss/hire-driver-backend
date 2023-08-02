import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from './config/config'

import routes from './routes'
import socketio from './config/socketio'

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
  app.use(express.json({ limit: '10mb' }))
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
        'https://hire-driver-fe.onrender.com',
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

  const server = http.createServer(app)
  socketio(server)

  server.listen(config.server.port, () => {
    console.log(`Server is running at port: ${config.server.port}`)
  })
}
