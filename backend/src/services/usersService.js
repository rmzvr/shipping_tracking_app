const { User } = require('../models/User')
const bcrypt = require('bcryptjs')


const saveUser = async ({ email, password, role }) => {
  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
    role
  })

  return await user.save()
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email })
}

const getUserByID = async (id) => {
  return await User.findById(id)
}

const findUserByIDAndDelete = async (id) => {
  return await User.findByIdAndDelete(id)
}

const findUserByIDAndUpdate = async (id, data) => {
  return await User.findByIdAndUpdate(id, data)
}

const findUserByEmailAndUpdate = async (email, data) => {
  return await User.findOneAndUpdate({ email }, data)
}

const uploadUserAvatar = async (req, res, next) => {
  upload.single('avatar')
}

module.exports = {
  saveUser,
  getUserByEmail,
  getUserByID,
  findUserByIDAndDelete,
  findUserByIDAndUpdate,
  findUserByEmailAndUpdate,
  uploadUserAvatar
}
