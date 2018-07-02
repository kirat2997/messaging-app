const filterAccountData = function (accountData) {
  const account = accountData
  account.password = null
  account.workspace.forEach(ws => {
    ws.password = null
  })
  return account
}

const filterWorkspaceData = function (workspaceData) {
  // const account
}

module.exports = {
  filterAccountData,
  filterWorkspaceData
}