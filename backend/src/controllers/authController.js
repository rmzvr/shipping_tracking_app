const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { userJoiSchema } = require('../models/User')
const {
  getNewGeneratedPassword,
  sendEmailWithNewPassword
} = require('../services/authService')

const {
  saveUser,
  getUserByEmail,
  findUserByEmailAndUpdate
} = require('../services/usersService')

const registerUser = async (req, res, next) => {
  const { email, password, role } = req.body

  await userJoiSchema.extract(['email']).validateAsync(email)
  await userJoiSchema.extract(['password']).validateAsync(password)
  await userJoiSchema.extract(['role']).validateAsync(role)

  await saveUser({ email, password, role })

  return res
    .status(200)
    .json({ message: 'Profile created successfully' })
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  await userJoiSchema.extract(['email']).validateAsync(email)

  const user = await getUserByEmail(email)

  if (!user) {
    throw Error(`User doesn't exist`)
  }

  await userJoiSchema.extract(['password']).validateAsync(password)

  const isPasswordCorrect = await bcrypt.compare(
    String(password),
    String(user.password)
  )

  if (!isPasswordCorrect) {
    throw Error('Invalid password')
  }

  const payload = {
    email: user.email,
    userID: user._id,
    role: user.role,
    created_date: user.created_date
  }
  const jwt_token = jwt.sign(payload, process.env.SECRET_JWT_KEY)

  return res.status(200).json({
    jwt_token,
    role: user.role
  })
}

const restorePassword = async (req, res, next) => {
  const { email } = req.body

  await userJoiSchema.extract(['email']).validateAsync(email)

  const user = await getUserByEmail(email)

  if (!user) {
    throw Error(`User doesn't exist`)
  }

  const newPassword = getNewGeneratedPassword()

  const newCryptedPassword = await bcrypt.hash(newPassword, 10)

  await findUserByEmailAndUpdate(email, {
    password: newCryptedPassword
  })

  await sendEmailWithNewPassword(email, newPassword)

  return res.status(200).json({
    message:
      'New password sent to your email address. Check spam folder.'
  })
}

module.exports = {
  registerUser,
  loginUser,
  restorePassword
}
