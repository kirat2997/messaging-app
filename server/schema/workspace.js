const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workspaceSchema = new Schema({
  name: String,
  type: String,
  channels: [String],
  members: [{
    id: Schema.Types.ObjectId
  }]
})
// Export Mongoose model
module.exports =  mongoose.model('workspace', workspaceSchema)
