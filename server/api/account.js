const express = require('express')
const router = express.Router()

const Account = require('../schema/account')

router.get('/accounts/:accountId', async function(req, res){
  const account = await Account.findOne({_id: req.params.accountId})
  res.json(account)
})

module.exports = router