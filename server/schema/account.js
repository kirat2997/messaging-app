const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
  name: String,
  email: String,
  password: String,
  workspace: [{
    name: String,
    id: Schema.Types.ObjectId,
    password: String
  }]
})
// Export Mongoose model
module.exports =  mongoose.model('account', accountSchema)
