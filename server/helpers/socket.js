const Workspace = require('../schema/workspace')
const Message = require('../schema/message')
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

const saveChannelMessage = async function (data) {
  const text = data.text
  const from = data.from
  const channel = data.channel
  const workspace = data.workspace
  const now = moment().valueOf()
  
  const message = new Message({
    text,
    from,
    createdAt: moment(now).format('h:mm a'),
    key: now,
    channel,
    workspace
  })
  await message.save()
}

const fetchChannelMessage = async function (data) {
  const chats = await Message.find({channel: data.channel, workspace: data.workspace}).sort({'key': 'asc'})
  return chats
}

module.exports = { setUserActive, setUserInactive, generateMessage, saveChannelMessage, fetchChannelMessage }