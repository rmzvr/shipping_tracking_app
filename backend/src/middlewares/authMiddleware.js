const jwt = require('jsonwebtoken')
const { getUserByID } = require('../services/usersService')

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res
      .status(400)
      .json({ message: 'Please, provide authorization header' })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Please, include token to request' })
  }

  const tokenPayload = jwt.verify(token, process.env.SECRET_JWT_KEY)

  const user = await getUserByID(tokenPayload.userID)

  if (!user) {
    throw Error("User doesn't exist")
  }

  req.user = {
    _id: tokenPayload.userID,
    role: tokenPayload.role,
    email: tokenPayload.email,
    created_date: tokenPayload.created_date
  }

  next()
}

module.exports = {
  authMiddleware
}
