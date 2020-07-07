import alerts from '../utils/alerts'
import redis from 'redis'

const redisClient = redis.createClient()

redisClient.on('connect', () => {
  alerts.pushover('OK', `Redis connection established successfully.`)
})

redisClient.on('error', error => {
  alerts.pushover('CRITICAL', `Redis connection couldn't be established. ${JSON.stringify(error)}`)
})

redisClient.set('DATABASE_CALL_COUNT', 0)
redisClient.set('REDIS_CALL_COUNT', 0)
redisClient.set('REDIS_UPDATE_TTL_CALL_COUNT', 0)

export default redisClient
