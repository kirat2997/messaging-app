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

const generateMemberMessage = (from, text, toId, fromId) => {
  const now = moment().valueOf()
  const createdAt =  moment(now).format('h:mm a')
  return {
      from,
      text,
      createdAt,
      toId: toId,
      fromId: fromId,
      from,
      key: moment().valueOf()
  }
}

const saveMemberMessage = async function (data) {
  const text = data.text
  const from = data.from
  const channel = data.channel
  const workspace = data.workspace
  const now = moment().valueOf()
  const idArray = [data.fromId, data.toId].sort() 
  const message = new Message({
    text,
    from,
    type: 'member',
    createdAt: moment(now).format('h:mm a'),
    key: now,
    channel,
    workspace,
    toId: data.toId,
    fromId: data.fromId,
    convoId: `${idArray[0]}--${idArray[1]}`
  })
  await message.save()
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
    type: 'channel',
    workspace
  })
  await message.save()
}

const fetchChannelMessage = async function (data) {
  const chats = await Message.find({channel: data.channel, workspace: data.workspace, type: 'channel'}).sort({'key': 'asc'})
  return chats
}

const fetchMemberMessage = async function (data) {
  const idArray = [data.myId, data.otherId].sort() 
  const chats = await Message.find({convoId: `${idArray[0]}--${idArray[1]}`, workspace: data.workspace, type: 'member'}).sort({'key': 'asc'})
  return chats
}

module.exports = { setUserActive, setUserInactive, generateMessage, saveChannelMessage, fetchChannelMessage, generateMemberMessage, saveMemberMessage, fetchMemberMessage }