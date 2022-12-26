const passwordGenerator = require('generate-password')
const nodemailer = require('nodemailer')

const getNewGeneratedPassword = () => {
  return passwordGenerator.generate({
    length: 16,
    numbers: true
  })
}

const sendEmailWithNewPassword = async (email, password) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  return await transporter.sendMail({
    from: process.env.EMAIL_LOGIN,
    to: email,
    subject: 'New password',
    text: 'New password',
    html: `<b>Your new password: <br> ${password}</br>`
  })
}

module.exports = {
  getNewGeneratedPassword,
  sendEmailWithNewPassword
}
