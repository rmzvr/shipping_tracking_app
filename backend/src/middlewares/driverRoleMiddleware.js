const driverRoleMiddleware = async (req, res, next) => {
  const { role } = req.user

  if (role !== 'DRIVER') {
    throw Error('No access permission')
  }

  next()
}

module.exports = {
  driverRoleMiddleware
}
