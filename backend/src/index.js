const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const { authRouter } = require('./routers/authRouter')
const { usersRouter } = require('./routers/usersRouter')
const { trucksRouter } = require('./routers/trucksRouter')
const { loadsRouter } = require('./routers/loadsRouter')

const { asyncWrapper } = require('./asyncWrapper')

const { authMiddleware } = require('./middlewares/authMiddleware')

const {
  driverRoleMiddleware
} = require('./middlewares/driverRoleMiddleware')

const app = express()

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static('src/uploads'))

app.use('/api/auth', authRouter)
app.use('/api/users/me', asyncWrapper(authMiddleware), usersRouter)
app.use('/api/loads', asyncWrapper(authMiddleware), loadsRouter)
app.use(
  '/api/trucks',
  asyncWrapper(authMiddleware),
  asyncWrapper(driverRoleMiddleware),
  trucksRouter
)

app.listen(process.env.PORT)

app.use(errorHandler)

function errorHandler(err, req, res, next) {
  return res.status(400).json({ message: err.message })
}
