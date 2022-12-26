import axios from '../api/axios'
import useAuth from './useAuth'

export default function usePrivateAxios() {
  const { auth } = useAuth()

  axios.defaults.headers.common = {
    Authorization: 'Bearer ' + auth
  }

  return axios
}
