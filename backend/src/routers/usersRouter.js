const express = require('express')
const router = express.Router()
const {
  getUserInfo,
  deleteUser,
  updatePassword,
  saveUserAvatar,
  getUserAvatar
} = require('../controllers/usersController')
const {
  passwordMiddleware
} = require('../middlewares/passwordMiddleware')

const multer = require('multer')
const upload = multer({ dest: 'src/uploads/' })

const { asyncWrapper } = require('../asyncWrapper')

router.get('/', asyncWrapper(getUserInfo))

router.delete('/', asyncWrapper(deleteUser))

router.post(
  '/image',
  upload.single('avatar'),
  asyncWrapper(saveUserAvatar)
)

router.patch(
  '/password',
  asyncWrapper(passwordMiddleware),
  asyncWrapper(updatePassword)
)

router.get('/image', asyncWrapper(getUserAvatar))

module.exports = {
  usersRouter: router
}
