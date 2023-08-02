import dotenv from 'dotenv'
dotenv.config()

// const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''

// const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.cyvqald.mongodb.net/`
const MONGO_URL = process.env.MONGO_URL || ''
const FRONTEND_URL = process.env.FRONTEND_URL || ''

const SERVER_PORT = parseInt('' + process.env.SERVER_PORT) || 4000

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'ADSLADSFFKADSLKFJ'
const ACCESS_TOKEN_SECRET_EXPIRE =
  process.env.ACCESS_TOKEN_SECRET_EXPIRE || '7d'

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  frontend: FRONTEND_URL,
  server: {
    port: SERVER_PORT,
  },
  jwt: {
    accessSecret: ACCESS_TOKEN_SECRET,
    accessExpiresIn: ACCESS_TOKEN_SECRET_EXPIRE,
  },
}
