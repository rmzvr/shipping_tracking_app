const mongoose = require('mongoose')
const Joi = require('joi')

const userJoiSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2
    })
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
  role: Joi.string()
    .pattern(new RegExp('^SHIPPER|DRIVER$'))
    .required()
})

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    require: true
  },
  created_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  image: {
    type: String
  }
})

const User = mongoose.model('users', userSchema)

module.exports = {
  User,
  userJoiSchema
}
