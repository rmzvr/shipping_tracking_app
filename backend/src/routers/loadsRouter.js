const express = require('express')
const router = express.Router()

const {
  getAllLoads,
  addLoad,
  getActiveLoad,
  IterateNextLoadState,
  getLoad,
  updateLoad,
  deleteLoad,
  postLoad,
  getLoadInfo,
  getShippedLoads
} = require('../controllers/loadsController')

const {
  shipperRoleMiddleware
} = require('../middlewares/shipperRoleMiddleware')

const {
  driverRoleMiddleware
} = require('../middlewares/driverRoleMiddleware')

const { asyncWrapper } = require('../asyncWrapper')

router.get('/', asyncWrapper(getAllLoads))

router.post(
  '/',
  asyncWrapper(shipperRoleMiddleware),
  asyncWrapper(addLoad)
)

router.get(
  '/active',
  asyncWrapper(driverRoleMiddleware),
  asyncWrapper(getActiveLoad)
)

router.patch(
  '/active/state',
  asyncWrapper(driverRoleMiddleware),
  asyncWrapper(IterateNextLoadState)
)

router.get(
  '/shipped',
  asyncWrapper(driverRoleMiddleware),
  asyncWrapper(getShippedLoads)
)

router.get('/:id', asyncWrapper(getLoad))

router.put(
  '/:id',
  asyncWrapper(shipperRoleMiddleware),
  asyncWrapper(updateLoad)
)

router.delete(
  '/:id',
  asyncWrapper(shipperRoleMiddleware),
  asyncWrapper(deleteLoad)
)

router.post(
  '/:id/post',
  asyncWrapper(shipperRoleMiddleware),
  asyncWrapper(postLoad)
)

router.get(
  '/:id/shipping_info',
  asyncWrapper(shipperRoleMiddleware),
  asyncWrapper(getLoadInfo)
)

module.exports = {
  loadsRouter: router
}
