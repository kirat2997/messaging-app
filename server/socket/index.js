const { 
  setUserActive,
  setUserInactive,
  generateMessage,
  generateMemberMessage,
  saveChannelMessage,
  fetchChannelMessage,
  saveMemberMessage,
  fetchMemberMessage } = require('../helpers/socket')

const Account = require('../schema/account')

module.exports = function(io) {
  io.on('connect', (socket) => {
    socket.on('join', async (data) => {
      const channels = data.channels
      const workspace = data.workspace.name
      const memberId = data.userId
      
      const wsData = await setUserActive(memberId, workspace, socket.id)
      
      socket.join(workspace)
      
      io.to(workspace).emit('updateActiveList', wsData)
      
      channels.forEach(element => {
        socket.join(`${element.name} - ${workspace}`)
      })
      socket.join(`${memberId} - ${workspace}`)
    })

    socket.on('sendChannelMessage', async (data) => {
      const text = data.text
      const from = data.from
      const channel = data.channel
      const workspace = data.workspace
      socket.emit('newMessage', generateMessage(`You`, text, channel))
      socket.broadcast.to(`${channel} - ${workspace}`).emit('newMessage', generateMessage(from, text, channel))
      await saveChannelMessage(data)
    })

    socket.on('sendMemberMessage', async (data) => {
      socket.emit('newMemberMessage', generateMemberMessage('You', data.text, data.toId, data.fromId))
      socket.broadcast.to(`${data.toId} - ${data.workspace}`).emit('newMemberMessage', generateMemberMessage(data.from, data.text, data.toId, data.fromId))
      await saveMemberMessage(data)
    })

    socket.on('fetchChannelMessage', async (data) => {
      const messageSet = await fetchChannelMessage(data)
      socket.emit('channelMessages', {messageSet, channel: data.channel})
    })
    
    socket.on('fetchMemberMessage', async (data) => {
      const messageSet = await fetchMemberMessage(data)
      socket.emit('memberMessages', {messageSet, user: data.user})
    })

    socket.on('loggedin', async (data) => {
      socket.join(data)
    })

    socket.on('newInvitation', async (data) => {
      socket.broadcast.to(data).emit('ping', data)
    })
    socket.on('newUser', (data) => {
      io.to(data).emit('updateList')
    })
    
    socket.on('signout', async (data) => {
      socket.leave(data.workspace.name)
      const wsData = await setUserInactive(data.userId, data.workspace.name)
      io.to(data.workspace.name).emit('updateActiveList', wsData)
      data.workspace.channels.forEach(element => {
        socket.leave(`${element} - ${data.workspace.name}`)
      })
      socket.leave(`${data.userId} - ${data.workspace.name}`)
    })
    
    socket.on('disconnect', async (data) => {
      const account = await Account.findOneAndUpdate({'socket.id': socket.id}, {'socket.active': false}, {new:true})
      if(account){
        setTimeout(async ()=>{
          const backUser =  await Account.findOne({_id: account._id})
          if(!(backUser.socket.active && backUser.socket.workspace === account.socket.workspace)){
            if(!backUser.active)
              await Account.findOneAndUpdate({_id: account._id}, {'socket.id': null, 'socket.active': false, 'socket.workspace': null})
            
            socket.leave(account.socket.workspace)
            const wsData = await setUserInactive(account._id, account.socket.workspace)
            io.to(account.socket.workspace).emit('updateActiveList', wsData)
            wsData.channels.forEach(element => {
              socket.leave(`${element.name} - ${account.socket.workspace}`)
            })
            socket.leave(`${account._id} - ${account.socket.workspace}`)
          }
        }, 5000)
      }
    })
  })  
}