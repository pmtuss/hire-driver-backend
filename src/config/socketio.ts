import { Server, Socket } from 'socket.io'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from './config'
import { Role, TripStatus } from '../constants/enum'
import TripModel from '../models/trip.model'

interface TokenPayload extends JwtPayload {
  userId: string
  role: string
}

interface CustomSocket extends Socket {
  user?: {
    userId: string
    role: string
  }
}

const drivers = new Map()
const passengers = new Map()

const socketio = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3001', 'http://localhost:3000'],
    },
  })

  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication token not provided.'))
    }

    try {
      // Verify and decode the JWT token to obtain the user ID or any other relevant data
      const decodedToken = jwt.verify(
        token,
        config.jwt.accessSecret
      ) as JwtPayload
      socket.user = { userId: decodedToken.userId, role: decodedToken.userRole } // Store the user ID on the socket object for later use
      next()
    } catch (error) {
      return next(new Error('Authentication failed.'))
    }
  })

  io.on('connection', (socket: CustomSocket) => {
    console.log('A client connected: ', socket.user?.userId)

    if (socket.user?.role === Role.PASSENGER) {
      passengers.set(socket.user.userId, socket.id)
    } else if (socket.user?.role === Role.DRIVER) {
      drivers.set(socket.user.userId, socket.id)
    }

    socket.on('disconnect', () => {
      console.log('A client disconneted: ', socket.id)
    })

    socket.on('requestTrip', (data) => {
      let i = 0
      drivers.forEach((val, key) => {
        console.log('drivers', key, val)
        io.to(val).emit('new-ride-request', {
          ...data,
          passengerId: socket.user?.userId,
        })
      })
    })

    socket.on('acceptTrip', (data) => {
      io.to(passengers.get(data.passenger)).emit('tripAccepted', {
        ...data,
        driver: socket.user?.userId,
      })

      drivers.forEach((val, key) => {
        if (key === socket.user?.userId) return
        io.to(val).emit('deleteTrip', { _id: data._id })
      })
    })

    socket.on('arriveStart', async (data) => {
      const { passenger, _id } = data
      const updatedTrip = await TripModel.findOneAndUpdate(
        { _id },
        { status: TripStatus.ARRIVED_START },
        { new: true }
      )
      io.to(passengers.get(passenger)).emit('driverArrived', updatedTrip)
    })

    socket.on('startTrip', async (data) => {
      const { passenger, _id } = data
      const updatedTrip = await TripModel.findOneAndUpdate(
        { _id },
        { status: TripStatus.RUNNING },
        { new: true }
      )
      console.log('startTrip')
      io.to(passengers.get(passenger)).emit('tripStart', updatedTrip)
    })

    socket.on('finishTrip', async (data) => {
      const { passenger, _id } = data
      const updatedTrip = await TripModel.findOneAndUpdate(
        { _id },
        { status: TripStatus.FINISHED },
        { new: true }
      )
      io.to(passengers.get(passenger)).emit('tripFinished', updatedTrip)
    })

    socket.on('updateDriverLocation', (data) => {
      const { passengerId, location } = data
      io.to(passengers.get(passengerId)).emit('driverLocation', location)
    })

    socket.on('cancelTrip', (data) => {
      const { _id } = data
      console.log(data)
      drivers.forEach((val, key) => {
        io.to(val).emit('deleteTrip', {
          _id,
        })
      })
    })
  })
}

export default socketio
