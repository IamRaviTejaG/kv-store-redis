import dbConnection from '../config/database'
import { redisClient, protected_keys } from '../config/redisClient'
const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

export default {
  /**
   * Sets value of a key, when value is a string.
   * @param  req
   * @param  res
   */
  setValueString: (req, res) => {
    if (protected_keys.includes(req.params.key)) {
      res.status(200).json({ error: "Error setting protected keys!" })
    } else {
      // Increment redis db call counter (for write operation below)
      redisClient.incr('DATABASE_CALL_COUNT')
      ItemModel.updateOne(
        { key: req.params.key },
        { value: req.params.value },
        { upsert: true }
      ).then(result => {
        // Adds value to redis for update operations
        if (result.nModified !== 0) {
          redisClient.set(req.params.key, req.params.value, 'EX', 21600)
          redisClient.incr('REDIS_UPDATE_TTL_CALL_COUNT')  // Increment redis call counter
        }
        res.status(200).json({ message: 'New value set successfully!' })
      }).catch(err => {
        res.status(500).json({ error: err })
      })
    }
  },

  /**
   * Sets value of a key, when value is a array, object, etc.
   * The HTTP "Content-type" header must be set to "application/json".
   * @param  req
   * @param  res
   */
  setValueObject: (req, res) => {
    // Increment redis db call counter (for write operation below)
    redisClient.incr('DATABASE_CALL_COUNT')
    ItemModel.updateOne(
      { key: req.body.key },
      { value: req.body.value },
      { upsert: true }
    ).then(result => {
      // Insert value to redis for update operations or update
      // if already existing in the redis cache
      if (result.nModified !== 0) {
        redisClient.set(req.body.key, req.body.value, 'EX', 21600)
        redisClient.incr('REDIS_UPDATE_TTL_CALL_COUNT')  // Increment redis call counter
      }
      res.status(200).json({ message: 'New value set successfully!' })
    }).catch(err => {
      res.status(500).json({ error: err })
    })
  }
}
