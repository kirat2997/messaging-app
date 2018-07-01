require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const Account = require('../schema/account')

app.set('jwtSecret', process.env.JWT_SECRET)

function generateToken(account){
  const payload = {
		userEmail: account.email,
    accountId: account._id
  }
	const token = jwt.sign(payload, app.get('jwtSecret'), {
		expiresIn: parseInt(process.env.JWT_TTL) // expires in 24 hours
	})
  return token
}

async function verifyToken(token){
  let user
  try{
    const decoded = jwt.verify(token, app.get('jwtSecret'))
    const now = new Date().getTime() / 1000
    if(now > decoded.exp){
      user = 'undefined'
    }else{
      user = await getUserDetails(decoded)
    }
  }catch(e){
    user = 'undefined'
  }
  return user
}
async function getUserDetails(decoded){
  let account = undefined
  if(decoded){
    account = await Account.findOne({_id : decoded.accountId})
  }
  return account
}

module.exports = {
  verifyToken,
  generateToken
}
