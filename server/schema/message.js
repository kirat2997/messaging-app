const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: String,
  to: String,
  from: String,
  createdAt: String,
  channel: String,
  type: String,
  workspace: String,
  fromId: String,
  toId: String,
  key: String,
  convoId: String
})
// Export Mongoose model
module.exports =  mongoose.model('message', messageSchema)
