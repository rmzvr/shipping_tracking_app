const express = require('express')
const router = express.Router()

const {
  getAllTrucks,
  saveTruck,
  getTruck,
  updateTruck,
  deleteTruck,
  assignTruck,
  unassignTruck
} = require('../controllers/trucksController')

const { asyncWrapper } = require('../asyncWrapper')

router.get('/', asyncWrapper(getAllTrucks))

router.post('/', asyncWrapper(saveTruck))

router.get('/:id', asyncWrapper(getTruck))

router.put('/:id', asyncWrapper(updateTruck))

router.delete('/:id', asyncWrapper(deleteTruck))

router.post('/:id/assign', asyncWrapper(assignTruck))

router.post('/:id/unassign', asyncWrapper(unassignTruck))

module.exports = {
  trucksRouter: router
}
