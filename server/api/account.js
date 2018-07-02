const express = require('express')
const router = express.Router()

const Account = require('../schema/account')

const { filterAccountData } = require('../helpers/filterData')

router.get('/accounts/:accountId', async function(req, res){
  let account = await Account.findOne({_id: req.params.accountId})
  account = filterAccountData(account)
  res.json(account)
})

module.exports = router