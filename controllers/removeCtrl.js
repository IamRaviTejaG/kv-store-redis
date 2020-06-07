import dbConnection from '../config/database'
import redisClient from '../config/redisClient'

const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

export default {
  /**
   * Handles the deletion of a key-value pair.
   * @param  req
   * @param  res
   */
  removeValue: (req, res) => {
    // Removes first from the redis cache
    redisClient.del(req.params.key)
    redisClient.incr('REDIS_CALL_COUNT')  // Increment redis call counter

    // Increment redis db call counter (for deletion)
    redisClient.incr('DATABASE_CALL_COUNT')
    // Removes from the database
    ItemModel.deleteOne({ key: req.params.key }).then(result => {
      if (!result.n) {
        res.status(200).json({ message: 'No matching entry was found!' })
      } else {
        res.status(200).json({ message: 'Deleted successfully!' })
      }
    }).catch(err => {
      res.status(500).json({ error: err })
    })
  }
}
