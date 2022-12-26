/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import usePrivateAxios from './usePrivateAxios'

const LOADS_URL = '/api/trucks/'

export default function useTrucks() {
  const [trucks, setTrucks] = useState([])

  const axios = usePrivateAxios()

  async function fetchTrucks() {
    try {
      const response = await axios.get(LOADS_URL)

      setTrucks(response?.data?.trucks)
    } catch (error) {}
  }

  useEffect(() => {
    fetchTrucks()
  }, [])

  return { trucks, setTrucks, fetchTrucks }
}
