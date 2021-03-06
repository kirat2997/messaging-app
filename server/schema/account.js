const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
  name: String,
  email: String,
  password: String,
  workspace: [{
    workspaceName: String,
    name: String,
    id: Schema.Types.ObjectId,
    password: String
  }],
  invitations: [{
    wsid: Schema.Types.ObjectId,
    from: String,
    wsname: String
  }],
  socket: {
    id: String,
    active: {
      type: Boolean,
      default: false
    },
    workspace: String
  }
})
// Export Mongoose model
module.exports =  mongoose.model('account', accountSchema)
