const Account = require('../schema/account')

const filterAccountData = function (accountData) {
  const account = accountData
  account.password = null
  account.workspace.forEach(ws => {
    ws.password = null
  })
  return account
}

const filterWorkspaceData = async function (workspaceData) {
  let members = []
  await Promise.all(workspaceData.members.map((member) => {
    return (async function () {
      const account = await Account.findOne({_id: member.id})
      let displayName
      account.workspace.forEach(ws => {
        if (ws.id.equals(workspaceData._id)){
          displayName = ws.name
        }
      })
      if(!displayName)
        displayName = account.name
      let data = {
        name: account.name,
        displayName,
        active: member.active
      }
      members.push(data)
    })()
  }))
  const workspace = {
    name: workspaceData.name,
    channels: workspaceData.channels,
    members
  }
  return workspace
}

module.exports = {
  filterAccountData,
  filterWorkspaceData
}