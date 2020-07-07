import alerts from './utils/alerts'
import app from './config/app'

require('dotenv').config()

const server = async app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server live at http://${process.env.HOST}:${process.env.PORT}`)
  alerts.pushover('OK', `Server started successfully.`)
}).on('error', error => {
  alerts.pushover('CRITICAL', `Server startup failed. ${error}`)
})

export default server
