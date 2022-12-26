const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  restorePassword
} = require('../controllers/authController.js')

const { asyncWrapper } = require('../asyncWrapper')

router.post('/register', asyncWrapper(registerUser))

router.post('/login', asyncWrapper(loginUser))

router.post('/forgot_password', asyncWrapper(restorePassword))

module.exports = {
  authRouter: router
}
