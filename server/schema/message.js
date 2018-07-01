const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: String,
  to: String,
  from: String,
  time: String,
  convoId: String
})
// Export Mongoose model
module.exports =  mongoose.model('message', messageSchema)
