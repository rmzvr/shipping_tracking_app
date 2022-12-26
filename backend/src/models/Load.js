const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const loadJoiShema = Joi.object({
  created_by: Joi.objectId(),
  assigned_to: Joi.objectId(),
  status: Joi.string().pattern(
    new RegExp('^NEW|POSTED|ASSIGNED|SHIPPED$')
  ),
  state: Joi.string().pattern(
    new RegExp(
      '^En\\sroute\\sto\\sPick\\sUp|Arrived\\sto\\sPick\\sUp|En\\sroute\\sto\\sdelivery|Arrived\\sto\\sdelivery$'
    )
  ),
  name: Joi.string().required(),
  payload: Joi.number().required(),
  pickup_address: Joi.string().required(),
  delivery_address: Joi.string().required(),
  dimensions: Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required()
  }),
  logs: Joi.array().items(
    Joi.object({
      message: Joi.string().required(),
      time: Joi.date().required()
    })
  )
})

const logSchema = mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})

const loadSchema = mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  status: {
    type: String,
    default: 'NEW',
    required: true
  },
  state: {
    type: String
  },
  name: {
    type: String,
    required: true
  },

  pickup_address: {
    type: String,
    required: true
  },
  delivery_address: {
    type: String,
    required: true
  },
  payload: {
    type: Number,
    required: true
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    length: {
      type: Number,
      required: true
    }
  },
  logs: [logSchema],
  created_date: {
    type: Date,
    default: Date.now,
    required: true
  }
})

const Load = mongoose.model('loads', loadSchema)

module.exports = {
  Load,
  loadJoiShema
}
