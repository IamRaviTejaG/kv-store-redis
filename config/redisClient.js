import redis from 'redis'

const redisClient = redis.createClient()

redisClient.set('DATABASE_CALL_COUNT', 0)
redisClient.set('REDIS_CALL_COUNT', 0)
redisClient.set('REDIS_UPDATE_TTL_CALL_COUNT', 0)

const protected_keys = ['DATABASE_CALL_COUNT', 'REDIS_CALL_COUNT', 'REDIS_UPDATE_TTL_CALL_COUNT']

export default { redisClient, protected_keys }
