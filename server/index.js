require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const jwtAuth = require('./jwt/auth')

const app = express()
const PORT = process.env.PORT || 3000

mongoose.Promise = global.Promise
mongoose.connect(process.env.TEST_DB_URL)

app.set('view engine','html')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./api/auth'))

app.use('/api/*', jwtAuth)
app.use('/api', require('./api/account'))

app.listen(PORT, () => {
  console.log(`Server up - localhost:${PORT}`)
})
