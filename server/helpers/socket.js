const Workspace = require('../schema/workspace')
const { filterWorkspaceData } = require('./filterData')
const moment = require('moment')

const setUserActive = async function (memberId, name) {
  let ws = await Workspace.findOne({name})
  ws.members.forEach(member => {
    if (member.id.equals(memberId)) {
      member.active = true
    }
  })
  ws = await ws.save()
  ws = await filterWorkspaceData(ws)
  return ws
}

const setUserInactive = async function (memberId, name) {
  let ws = await Workspace.findOne({name})
  ws.members.forEach(member => {
    if (member.id.equals(memberId)) {
      member.active = false
    }
  })
  ws = await ws.save()
  ws = await filterWorkspaceData(ws)
  return ws
}

const generateMessage = (from, text, channel) => {
  const now = moment().valueOf()
  const createdAt =  moment(now).format('h:mm a')
  return {
      from,
      text,
      createdAt,
      channel,
      key: moment().valueOf()
  }
}

module.exports = { setUserActive, setUserInactive, generateMessage }