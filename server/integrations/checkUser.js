const Account = require('../schema/account')
const { generateToken } = require('../jwt/token')

module.exports = async function (email, password) {
  let account = await Account.findOne({email, password})
  let token
  if(!account)
    return
  else{
    token = generateToken(account)
  }
  // console.log("token:::", token);
  return token
}