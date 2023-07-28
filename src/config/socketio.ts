import { Server, Socket } from 'socket.io'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { config } from './config'
import { Role } from '../constants/enum'

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

    // socket.on('driver-connect', (coordinate) => {
    //   console.log('A driver connected: ', socket.id, coordinate)
    //   drivers.set(socket.user?.userId, socket.id)
    //   console.log(drivers)
    // })

    // socket.on('driver-disconnect', (payload) => {
    //   console.log('A driver disconnected: ', socket.id, payload)
    //   drivers.delete(socket.user?.userId)
    //   console.log(drivers)
    // })

    socket.on('requestTrip', (data) => {
      console.log('requestTrip', drivers)
      let i = 0
      drivers.forEach((val, key) => {
        console.log('drivers', key, val)
        io.to(val).emit('new-ride-request', {
          ...data,
          passengerId: socket.user?.userId,
        })
      })
    })

    socket.on('acceptTrip', (passengerId) => {
      io.to(passengers.get(passengerId)).emit('tripAccepted', {
        user: socket.user,
      })
    })

    socket.on('arriveStart', (passengerId) => {
      console.log('arriveStart')
      io.to(passengers.get(passengerId)).emit('driverArrived', {
        user: socket.user,
      })
    })

    socket.on('startTrip', (passengerId) => {
      console.log('startTrip')
      io.to(passengers.get(passengerId)).emit('tripStart', {
        user: socket.user,
      })
    })

    socket.on('finishTrip', (passengerId) => {
      console.log('finishTrip')
      io.to(passengers.get(passengerId)).emit('tripFinished', {
        user: socket.user,
      })
    })

    socket.on('updateDriverLocation', (data) => {
      socket.emit('dirverLocationUpdated', { a: 'alo' })
    })
  })
}

export default socketio
