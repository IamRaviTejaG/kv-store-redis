import dbConnection from '../config/database'
import redisClient from '../config/redisClient'

const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

const protected_keys = ['DATABASE_CALL_COUNT', 'REDIS_CALL_COUNT', 'REDIS_UPDATE_TTL_CALL_COUNT']

export default {
  /**
   * Gets the corresponding value of a key.
   * @param  req
   * @param  res
   */
  getValue: (req, res) => {
    if (protected_keys.includes(req.params.key)) {
      res.status(200).json({ error: "Error getting protected keys!" })
    } else {
      // First checks if the key exists in redis, if yes, sends it out,
      // else makes a db call, stores it in redis for further use, and sends it
      // out to the user.
      redisClient.incr('REDIS_CALL_COUNT')  // Increment redis call counter
      redisClient.get(req.params.key, (err, reply) => {
        if (err) {
          res.status(500).json({ error: err })
        } else {
          if (reply === null) {
            // Increment redis db call counter (for read ops below)
            redisClient.incr('DATABASE_CALL_COUNT')
            ItemModel.find({ key: req.params.key }).then(result => {
              if (!result.length) {
                res.status(200).json({ message: 'No result found!' })
              } else {
                redisClient.set(req.params.key, result[0].value, 'EX', 21600)
                redisClient.incr('REDIS_UPDATE_TTL_CALL_COUNT')  // Increment redis call counter
                res.status(200).json({ value: result[0].value })
              }
            }).catch(err => {
              res.status(500).json({ error: err })
            })
          } else {
            redisClient.set(req.params.key, reply, 'EX', 21600)
            redisClient.incr('REDIS_UPDATE_TTL_CALL_COUNT')  // Increment redis call counter
            res.status(200).json({ value: reply })
          }
        } 
      })
    }
  }
}
