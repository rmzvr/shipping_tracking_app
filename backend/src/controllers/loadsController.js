const { default: mongoose } = require('mongoose')
const { loadJoiShema, Load } = require('../models/Load')
const { Truck } = require('../models/Truck')

const {
  getAllLoadsByUserID,
  addUserLoad,
  getUserLoadByID,
  updateUserLoadByID,
  deleteUserLoadByID,
  updateUserLoadStatus,
  assignTruckToLoad,
  getLoadParams,
  getLoadShippingInfo,
  compareTruckAndLoadParams,
  getActiveLoadByTruckID,
  getShippedLoadsByUserID
} = require('../services/loadsService')
const {
  getAssignedTrucks,
  getTruckParams,
  getAssignedTruckByUserID,
  updateTruckStatus
} = require('../services/trucksService')

const getAllLoads = async (req, res) => {
  const userID = req.user._id

  const loads = await getAllLoadsByUserID(userID)

  return res.status(200).json({ loads })
}

const addLoad = async (req, res) => {
  const validatedData = await loadJoiShema.validateAsync({
    created_by: req.user._id,
    ...req.body
  })

  await addUserLoad(validatedData)

  return res.status(200).json({
    message: 'Load created successfully'
  })
}

const getActiveLoad = async (req, res) => {
  const userID = req.user._id

  const assignedTruck = await getAssignedTruckByUserID(userID)

  if (!assignedTruck) {
    throw Error('No assigned truck')
  }

  const assignedTruckID = assignedTruck._id

  const activeLoad = await getActiveLoadByTruckID(assignedTruckID)

  if (!activeLoad) {
    throw Error('No active load')
  }

  return res.status(200).json({ load: activeLoad })
}

const getShippedLoads = async (req, res) => {
  const userID = req.user._id

  const shippedLoads = await getShippedLoadsByUserID(userID)

  console.log(shippedLoads)

  res.status(200).json({ loads: shippedLoads })
}

const IterateNextLoadState = async (req, res) => {
  const states = [
    'En route to Pick Up',
    'Arrived to Pick Up',
    'En route to delivery',
    'Arrived to delivery'
  ]

  const userID = req.user._id

  const assignedTruck = await getAssignedTruckByUserID(userID)

  if (!assignedTruck) {
    throw Error('No assigned truck')
  }

  const assignedTruckID = assignedTruck._id


  const activeLoad = await getActiveLoadByTruckID(assignedTruckID)

  if (!activeLoad) {
    throw Error('No active load')
  }

  const activeLoadID = activeLoad._id

  const currentStateIndex = states.findIndex(
    (state) => state === activeLoad.state
  )

  if (currentStateIndex === 3) {
    throw Error('Load has already delivered')
  }

  const nextState = states[currentStateIndex + 1]

  if (nextState === 'Arrived to delivery') {
    await updateUserLoadByID(activeLoadID, {
      state: nextState,
      status: 'SHIPPED',
      $push: {
        logs: {
          message: `Load state changed to '${nextState}'`,
          time: new Date()
        }
      }
    })

    await updateTruckStatus(assignedTruckID, { status: 'IS' })
  }

  await updateUserLoadByID(activeLoadID, {
    state: nextState,
    $push: {
      logs: {
        message: `Load state changed to '${nextState}'`,
        time: new Date()
      }
    }
  })

  return res.status(200).json({
    message: `Load state changed to '${nextState}'`
  })
}

const getLoad = async (req, res) => {
  const loadID = req.params.id

  const load = await getUserLoadByID(loadID)

  if (!load) {
    throw Error('Load not found')
  }

  return res.status(200).json({ load })
}

const updateLoad = async (req, res) => {
  const loadID = req.params.id

  await loadJoiShema.validateAsync(req.body)

  await updateUserLoadByID(loadID, req.body)

  return res.status(200).json({
    message: 'Load details changed successfully'
  })
}

const deleteLoad = async (req, res) => {
  const loadID = req.params.id

  const load = await deleteUserLoadByID(loadID)

  if (!load) {
    throw Error('Load not found')
  }

  res.status(200).json({
    message: 'Load deleted successfully'
  })
}

const postLoad = async (req, res) => {
  const loadID = req.params.id

  const load = await updateUserLoadStatus(loadID, 'POSTED')

  if (!load) {
    throw Error('Load not found')
  }

  const assignedTrucks = await getAssignedTrucks()

  if (!assignedTrucks.length) {
    await updateUserLoadStatus(loadID, 'NEW')

    throw Error('No available trucks found')
  }

  const truckID = assignedTrucks[0]._id
  const driverID = assignedTrucks[0].assigned_to

  await assignTruckToLoad(loadID, truckID, driverID)

  await updateUserLoadStatus(loadID, 'ASSIGNED')

  const loadParams = await getLoadParams(loadID)

  const truckParams = await getTruckParams(truckID)

  compareTruckAndLoadParams(truckParams, loadParams)

  return res.status(200).json({
    message: 'Load posted successfully',
    driver_found: true
  })
}

const getLoadInfo = async (req, res) => {
  const userID = req.user._id
  const loadID = req.params.id

  const [load] = await getLoadShippingInfo(userID, loadID)

  if (!load) {
    throw Error('Load not found')
  }

  return res.status(200).json({ load })
}

module.exports = {
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
}
