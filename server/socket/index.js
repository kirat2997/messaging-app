const { setUserActive, setUserInactive, generateMessage, saveChannelMessage, fetchChannelMessage } = require('../helpers/socket')

module.exports = function(io) {
  io.on('connect', (socket) => {
    console.log(socket.id, 'CONNECTED')
    
    socket.on('join', async (data) => {
      const channels = data.channels
      const workspace = data.workspace.name
      const memberId = data.userId
      const wsData = await setUserActive(memberId, workspace)
      socket.join(workspace)
      io.to(workspace).emit('updateActiveList', wsData)
      channels.forEach(element => {
        socket.join(`${element.name} - ${workspace}`)
      })
    })

    socket.on('signout', async (data) => {
      socket.leave(data.workspace.name)
      const wsData = await setUserInactive(data.userId, data.workspace.name)
      io.to(data.workspace.name).emit('updateActiveList', wsData)
      data.workspace.channels.forEach(element => {
        socket.leave(`${element} - ${data.workspace.name}`)
      })
    })

    socket.on('sendMessage', async (data) => {
      const text = data.text
      const from = data.from
      const channel = data.channel
      const workspace = data.workspace
      socket.emit('newMessage', generateMessage(`You`, text, channel))
      socket.broadcast.to(`${channel} - ${workspace}`).emit('newMessage', generateMessage(from, text, channel))
      await saveChannelMessage(data)
    })

    socket.on('fetchChannelMessage', async (data) => {
      const messageSet = await fetchChannelMessage(data)
      socket.emit('channelMessages', {messageSet, channel: data.channel})
    })
  })  
}