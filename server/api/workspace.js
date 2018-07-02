const express = require('express')
const router = express.Router()

const Account = require('../schema/account')
const Workspace = require('../schema/workspace')

const { filterAccountData } = require('../helpers/filterData')
router.post('/createWorkspace/:accountId', async function(req, res){
  const name = req.body.name
  const displayName = req.body.displayName
  const password = req.body.password
  
  const existingWorkspace = await Workspace.findOne({name, admin: req.params.accountId})
  if(existingWorkspace){
    res.sendStatus(420)  
  }else{
    let members = []
    let channels = []
    channels.push('general')
    channels.push('random')
    members.push({id: req.params.accountId})
    let workspace = new Workspace({
      name,
      members,
      channels,
      admin: req.params.accountId
    })
    workspace = await workspace.save()
    let workspaceData = {
      workspaceName: name,
      name: displayName,
      id: workspace._id,
      password
    }
    const account = await Account.findOneAndUpdate({_id: req.params.accountId}, {$push : { workspace: workspaceData } }, {new: true})
    const accountFiltered = filterAccountData(account)
    res.json(accountFiltered)
  }
})

router.post('/workspaceLogin/:accountId', async function(req, res){
  const id = req.body.id
  const password = req.body.password
  const accountId = req.params.accountId

  const account = await Account.findOne({_id: accountId})
  if(!account){
    res.sendStatus(404)
  } else {
    let found = false
    account.workspace.forEach(acc => {
      if (acc.id.equals(id) && acc.password === password){
        found = true
      }
    })
    if(found){
      res.json(id)
    } else {
      res.sendStatus(420)
    }
  }
})

router.get('/fetchWorkspace/:id', async function(req, res){
  const id = req.params.id
  const workspace = await Workspace.findOne({_id: id})
  if (workspace) {
    res.json(workspace)
  } else { 
    res.sendStatus(400)
  }
})

module.exports = router