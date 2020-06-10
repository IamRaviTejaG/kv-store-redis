import redis from 'redis'

const redisClient = redis.createClient()

redisClient.set('DATABASE_CALL_COUNT', 0)
redisClient.set('REDIS_CALL_COUNT', 0)
redisClient.set('REDIS_UPDATE_TTL_CALL_COUNT', 0)

export default redisClient
