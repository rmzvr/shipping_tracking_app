import { useState } from 'react'
import usePrivateAxios from './usePrivateAxios'

export default function useItems(type) {
  const [items, setItems] = useState([])

  const privateAxios = usePrivateAxios()

  async function fetchItems() {
    const response = await privateAxios.get(`/api/${type}/`)

    setItems(response.data[type])
  }

  return { items, setItems, fetchItems }
}
