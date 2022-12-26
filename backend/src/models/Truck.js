const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const truckJoiShema = Joi.object({
  created_by: Joi.objectId(),
  // assigned_to: Joi.objectId(),
  type: Joi.string()
    .pattern(
      new RegExp('^SPRINTER|SMALL\\sSTRAIGHT|LARGE\\sSTRAIGHT$')
    )
    .required(),
  payload: Joi.number(),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    length: Joi.number()
  }),
  status: Joi.string().pattern(new RegExp('^OL|IS$')).required()
})

const truckSchema = mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'IS',
    required: true
  },
  payload: {
    type: Number
  },
  dimensions: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    length: {
      type: Number
    }
  },
  created_date: {
    type: Date,
    default: Date.now
  }
})

const Truck = mongoose.model('trucks', truckSchema)

module.exports = {
  Truck,
  truckJoiShema
}
