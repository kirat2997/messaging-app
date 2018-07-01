const express = require('express')
const router = express.Router()

const Account = require('../schema/account')

const checkUser = require('../integrations/checkUser')

router.post('/signup', async function(req, res){
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name

  const account = await Account.findOne({email})
  if (account) {
    res.sendStatus(404)
  } else {
    let newAccount = new Account({
      name,
      email,
      password
    })
    newAccount = await newAccount.save()
    res.json(newAccount)
  }
})

router.post('/login', async function(req, res){
  const email = req.body.email
  const password = req.body.password

  const account = await checkUser(email, password)
  if(!account){
    res.sendStatus(400)
  }else{
    res.json(account)
  }
})

module.exports = router