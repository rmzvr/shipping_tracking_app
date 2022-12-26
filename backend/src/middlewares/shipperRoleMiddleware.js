const shipperRoleMiddleware = async (req, res, next) => {
  const { role } = req.user

  if (role !== 'SHIPPER') {
    throw Error('No access permission')
  }

  next()
}

module.exports = {
  shipperRoleMiddleware
}
