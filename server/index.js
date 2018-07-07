require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')
const path = require('path')

const jwtAuth = require('./jwt/auth')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

require('./socket')(io)

const PORT = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URL)

app.set('view engine','html')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", express.static(path.resolve(__dirname, '..', 'client','dist')))

app.use('/api', require('./api/auth'))

app.use('/api/*', jwtAuth)
app.use('/api', require('./api/account'))
app.use('/api', require('./api/workspace'))

server.listen(PORT, () => {
  console.log(`Server up - localhost:${PORT}`)
})
