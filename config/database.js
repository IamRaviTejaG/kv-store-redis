import alerts from '../utils/alerts'
import mongoose from 'mongoose'
require('dotenv').config()

const dbURL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DBNAME}`

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

const dbConnection = mongoose.createConnection(dbURL, dbOptions)

dbConnection.on('connected', () => {
  alerts.pushover('OK', `MongoDB connection established successfully.`)
})

dbConnection.on('error', error => {
  alerts.pushover('CRITICAL', `MongoDB connection couldn't be established. ${JSON.stringify(error)}`)
})

export default dbConnection
