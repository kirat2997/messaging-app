const express = require('express')
const router = express.Router()

const Account = require('../schema/account')

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

module.exports = router