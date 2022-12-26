const { default: mongoose } = require('mongoose')
const { Load } = require('../models/Load')
const { Truck } = require('../models/Truck')

const getAllLoadsByUserID = async (id) => {
  return await Load.find({ created_by: id }, '-__v')
}

const addUserLoad = async (data) => {
  const load = new Load(data)

  return await load.save()
}

const getUserLoadByID = async (loadID) => {
  return await Load.findById(loadID, '-__v')
}

const updateUserLoadByID = async (loadID, data) => {
  return await Load.findByIdAndUpdate(loadID, data)
}

const updateUserLoadStatus = async (loadID, status) => {
  return await Load.findByIdAndUpdate(loadID, { status: status })
}

const deleteUserLoadByID = async (loadID) => {
  return await Load.findByIdAndDelete(loadID)
}

const assignTruckToLoad = async (loadID, truckID, driverID) => {
  await Truck.findByIdAndUpdate(truckID, { status: 'OL' })

  return await Load.findByIdAndUpdate(loadID, {
    assigned_to: truckID,
    $set: { state: 'En route to Pick Up' },
    $push: {
      logs: {
        message: `Load assigned to driver with id ${driverID}`,
        time: new Date()
      }
    }
  })
}

const getLoadParams = async (loadID) => {
  return { payload, dimensions } = await Load.findById(loadID)
}

const getLoadShippingInfo = async (userID, loadID) => {
  return await Load.aggregate([
    {
      $match: {
        created_by: new mongoose.mongo.ObjectId(userID),
        status: 'ASSIGNED',
        _id: new mongoose.mongo.ObjectId(loadID)
      }
    },
    {
      $lookup: {
        from: 'trucks',
        localField: 'assigned_to',
        foreignField: '_id',
        as: 'truck'
      }
    },
    {
      $unwind: {
        path: '$truck'
      }
    }
  ])
}

const compareTruckAndLoadParams = (truckParams, loadParams) => {
  if (loadParams.payload > truckParams.payload) {
    throw Error('Too big load for available trucks')
  }

  if (loadParams.dimensions.width > truckParams.dimensions.width) {
    throw Error('Too big load for available trucks')
  }

  if (loadParams.dimensions.height > truckParams.dimensions.height) {
    throw Error('Too big load for available trucks')
  }

  if (loadParams.dimensions.length > truckParams.dimensions.length) {
    throw Error('Too big load for available trucks')
  }
}

const getActiveLoadByTruckID = async (truckID) => {
  return await Load.findOne(
    {
      assigned_to: new mongoose.mongo.ObjectId(truckID),
      status: 'ASSIGNED'
    },
    '-__v'
  )
}

const getShippedLoadsByUserID = async (userID) => {
  return await Load.aggregate([
    {
      $match: {
        'logs.0.message': new RegExp(userID),
        status: 'SHIPPED'
      }
    }
  ])
}

module.exports = {
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
}
