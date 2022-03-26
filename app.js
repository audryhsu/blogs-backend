const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogs')

console.log(`Connecting to ${config.MONGODB_URI}...`)
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('connected to mongodb!'))
  .catch(err => {
    console.error('could not connect to mongodb: ' + err.message)
  })

// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/blogs', blogRouter)

// error handler must be last
app.use((error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return res.status(400).send( { error: 'Improperly formatted id' })
  }
  next(error)
})

module.exports = app
