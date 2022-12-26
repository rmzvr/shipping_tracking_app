import axios from 'axios'

export default axios.create({
  baseURL: 'https://shipping-tracking-app.herokuapp.com/'
})
