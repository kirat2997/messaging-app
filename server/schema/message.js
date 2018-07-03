const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: String,
  to: String,
  from: String,
  createdAt: String,
  channel: String,
  workspace: String,
  key: String
})
// Export Mongoose model
module.exports =  mongoose.model('message', messageSchema)
