const bcrypt = require('bcryptjs')
const { User } = require('../models/User')
const fs = require('fs')

const {
  getUserByID,
  findUserByIDAndDelete,
  findUserByIDAndUpdate
} = require('../services/usersService')

const getUserInfo = async (req, res, next) => {
  const { _id, email, role, created_date } = req.user

  return res.status(200).json({
    user: {
      _id,
      role,
      email,
      created_date: created_date
    }
  })
}

const deleteUser = async (req, res, next) => {
  const userID = req.user._id

  await findUserByIDAndDelete(userID)

  return res.status(200).json({
    message: 'Profile deleted successfully'
  })
}

const updatePassword = async (req, res, next) => {
  let { _id, oldPassword, newPassword } = req.user

  const { password: currentPassword } = await getUserByID(_id)

  const isPasswordCorrect = await bcrypt.compare(
    String(oldPassword),
    String(currentPassword)
  )

  if (!isPasswordCorrect) {
    throw Error('Invalid current password')
  }

  newPassword = await bcrypt.hash(newPassword, 10)

  await findUserByIDAndUpdate(_id, { password: newPassword })

  return res.status(200).json({
    message: 'Password changed successfully'
  })
}

const saveUserAvatar = async (req, res, next) => {
  const fileType = req.file.mimetype.split('/')[1]

  const newFileName = `${req.file.filename}.${fileType}`

  fs.rename(
    `src/uploads/${req.file.filename}`,
    `src/uploads/${newFileName}`,
    () =>
      res.status(200).json({
        message: 'Avatar uploaded successfully',
        image: newFileName
      })
  )

  const userID = req.user._id

  await User.findByIdAndUpdate(userID, {
    $set: { image: newFileName }
  })
}

const getUserAvatar = async (req, res, next) => {
  const userID = req.user._id

  const response = await User.findById(userID)

  res.status(200).json({ image: response.image })
}

module.exports = {
  getUserInfo,
  deleteUser,
  updatePassword,
  saveUserAvatar,
  getUserAvatar
}
