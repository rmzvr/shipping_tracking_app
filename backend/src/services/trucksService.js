const mongoose = require('mongoose')
const { Truck } = require('../models/Truck')

const getAllTrucksByUserID = async (id) => {
  return await Truck.find({ created_by: id }, '-__v')
}

const addUserTruck = async (data) => {
  const truck = new Truck(data)

  return await truck.save()
}

const getUserTruckByID = async (truckID) => {
  return await Truck.findById(truckID, '-__v')
}

const updateUserTruckByID = async (
  truckID,
  { type, payload, width, height, length }
) => {
  return await Truck.findByIdAndUpdate(truckID, {
    type,
    payload,
    dimensions: {
      width,
      height,
      length
    }
  })
}

const deleteUserTruckByID = async (truckID) => {
  return await Truck.findByIdAndDelete(truckID)
}

const getAssignedTruckByUserID = async (userID) => {
  return await Truck.findOne({
    assigned_to: new mongoose.mongo.ObjectId(userID),
  })
}

const assignTruckToUserByID = async (userID, truckID) => {
  return await Truck.findByIdAndUpdate(truckID, {
    assigned_to: new mongoose.mongo.ObjectId(userID)
  })
}

const unassignUserTruckByID = async (truckID) => {
  return await Truck.findByIdAndUpdate(truckID, { assigned_to: null })
}

const getAssignedTrucks = async () => {
  return await Truck.aggregate([
    {
      $match: {
        status: 'IS',
        assigned_to: {
          $ne: null
        }
      }
    }
  ])
}

const getTruckParams = async (truckID) => {
  return ({ payload, dimensions } = await Truck.findById(truckID))
}

const updateTruckStatus = async (truckID) => {
  await Truck.findByIdAndUpdate(truckID, {
    status: 'IS'
  })
}

module.exports = {
  getAllTrucksByUserID,
  addUserTruck,
  getUserTruckByID,
  updateUserTruckByID,
  deleteUserTruckByID,
  assignTruckToUserByID,
  unassignUserTruckByID,
  getAssignedTruckByUserID,
  getAssignedTrucks,
  getTruckParams,
  updateTruckStatus
}
