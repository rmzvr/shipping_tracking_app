const { truckJoiShema } = require('../models/Truck')
const {
  getAllTrucksByUserID,
  addUserTruck,
  getUserTruckByID,
  updateUserTruckByID,
  deleteUserTruckByID,
  assignTruckToUserByID,
  getAssignedTruckByUserID,
  unassignUserTruckByID
} = require('../services/trucksService')

const getAllTrucks = async (req, res) => {
  const userID = req.user._id

  const trucks = await getAllTrucksByUserID(userID)

  return res.status(200).json({ trucks })
}

const saveTruck = async (req, res) => {
  const validatedData = await truckJoiShema.validateAsync({
    created_by: req.user._id,
    status: 'IS',
    ...req.body
  })

  await addUserTruck(validatedData)

  return res.status(200).json({
    message: 'Truck created successfully'
  })
}

const getTruck = async (req, res) => {
  const userID = req.user._id
  const truckID = req.params.id

  const truck = await getUserTruckByID(userID, truckID)

  if (!truck) {
    throw Error('Truck not found')
  }

  return res.status(200).json({ truck })
}

const updateTruck = async (req, res) => {
  const truckID = req.params.id
  const type = req.body.type
  const payload = req.body.payload
  const { width, height, length } = req.body.dimensions

  await truckJoiShema.extract('type').validateAsync(type)

  await updateUserTruckByID(truckID, {
    type,
    payload,
    width,
    height,
    length
  })

  return res.status(200).json({
    message: 'Truck details changed successfully'
  })
}

const deleteTruck = async (req, res) => {
  const truckID = req.params.id

  const truck = await deleteUserTruckByID(truckID)

  if (!truck) {
    throw Error('Truck not found')
  }

  return res.status(200).json({
    message: 'Truck deleted successfully'
  })
}

const assignTruck = async (req, res) => {
  const userID = req.user._id
  const truckID = req.params.id

  const currentAssignedTruck = await getAssignedTruckByUserID(userID)

  if (currentAssignedTruck?.status === 'OL') {
    throw Error('You have already active load.')
  }

  if (currentAssignedTruck) {
    throw Error(
      'You have already assigned truck. Please, unassign current truck.'
    )
  }

  await assignTruckToUserByID(userID, truckID)

  return res.status(200).json({
    message: 'Truck assigned successfully'
  })
}

const unassignTruck = async (req, res) => {
  const userID = req.user._id

  const currentAssignedTruck = await getAssignedTruckByUserID(userID)

  if (!currentAssignedTruck) {
    throw Error('Truck not found')
  }

  if (currentAssignedTruck.status === 'OL') {
    throw Error(
      "You have already active load. You can't unassing current truck."
    )
  }

  await unassignUserTruckByID(currentAssignedTruck._id)

    return res.status(200).json({
      message: 'Truck unassigned successfully'
    })
}

module.exports = {
  getAllTrucks,
  saveTruck,
  getTruck,
  updateTruck,
  deleteTruck,
  assignTruck,
  unassignTruck
}
