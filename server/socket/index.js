module.exports = function(io) {
  io.on('connect', (socket) => {
    console.log(socket.id, 'CONNECTED')
  })  
}