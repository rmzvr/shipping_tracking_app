const passwordMiddleware = async (req, res, next) => {
  const { _id } = req.user
  const { oldPassword, newPassword } = req.body

  req.user = {
    _id,
    oldPassword,
    newPassword
  }

  next()
}

module.exports = {
  passwordMiddleware
}
