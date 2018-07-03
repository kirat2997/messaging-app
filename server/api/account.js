const express = require('express')
const router = express.Router()

const Account = require('../schema/account')
const Workspace = require('../schema/workspace')

const { filterAccountData } = require('../helpers/filterData')

router.get('/accounts/:accountId', async function(req, res){
  let account = await Account.findOne({_id: req.params.accountId})
  account = filterAccountData(account)
  res.json(account)
})

router.post('/sendInvite/:accountId', async (req, res) => {
  const workspaceId = req.body.workspaceId
  const workspaceName = req.body.workspaceName
  const email = req.body.email
  const from = req.body.from

  let account = await Account.findOne({email})
  if (!account) {
    res.sendStatus(404)
  } else {
    let exist = false
    account.invitations.forEach(inv => {
      if (inv.wsid.equals(workspaceId)){
        exist = true
      }
    })
    const workspace = await Workspace.findOne({_id: workspaceId, 'members.id': account._id})
    if(!exist && !workspace){
      account.invitations.push({
        wsid: workspaceId,
        wsname: workspaceName,
        from
      })
      await account.save()
      res.json('success')
    } else {
      res.sendStatus(420)
    }
  }
})

router.post('/acceptInvite/:accountId', async (req, res) => {
  const wsid = req.body.wsid
  const accountId = req.params.accountId
  const name = req.body.name
  const password = req.body.password

  let workspace = await Workspace.findOne({_id: wsid})
  let workspaceData = {
    workspaceName: workspace.name,
    name,
    id: wsid,
    password,
  }
  let account = await Account.findOneAndUpdate({_id: accountId}, {
    $push: { workspace: workspaceData }
  }, {new: true})
  let element
  account.invitations.forEach(elem => {
    if(elem.wsid.equals(wsid)){
      element = elem 
    }
  })
  let index = account.invitations.indexOf(element)
  account.invitations.splice(index, 1)
  account = await account.save()
  workspace = await Workspace.findOneAndUpdate({_id: wsid}, {$push: {members: {id: account._id}}}, {new: true}) 
  account = filterAccountData(account) 
  res.json(account)
})

module.exports = router