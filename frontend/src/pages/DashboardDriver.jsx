/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { Box, Fab, Toolbar } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import TruckTable from '../components/TruckTable'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import CollapsibleTableTruck from '../components/CollapsibleTableTruck'
import CreateTruckForm from '../components/CreateTruck'

import usePrivateAxios from '../hooks/usePrivateAxios'
import useTrucks from '../hooks/useTrucks'
import useSnackbar from '../hooks/useSnackbar'

function DashboardPage() {
  const axios = usePrivateAxios()

  const [filteredTrucks, setFilteredTrucks] = useState([])
  const [activeTab, setActiveTab] = useState('AVAILABLE TRUCKS')
  const [filteredLoads, setFilteredLoads] = useState([])

  const { trucks, setTrucks, fetchTrucks } = useTrucks()

  const [openModal, setOpanModal] = useState(false)

  const handleClickCreateLoadModal = () => {
    setOpanModal(true)
  }

  const handleCloseCreateLoadModal = () => {
    setOpanModal(false)
  }

  const showSnackbar = useSnackbar()

  async function createTruck(truck) {
    try {
      const res = await axios.post('/api/trucks/', truck)

      fetchTrucks()
      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  async function showFilteredTrucks(status) {
    if (status === 'AVAILABLE TRUCKS') {
      setFilteredTrucks([
        ...trucks.filter((truck) => !truck?.assigned_to)
      ])
    } else if (status === 'ASSIGNED TRUCK') {
      setFilteredTrucks([
        ...trucks.filter((truck) => truck?.assigned_to)
      ])
    } else if (status === 'ACTIVE LOAD') {
      axios
        .get('/api/loads/active')
        .then((res) => {
          const filteredLoads = res?.data?.load

          setFilteredLoads([filteredLoads])
        })
        .catch(() => {
          setFilteredLoads([])
        })
    } else if (status === 'COMPLETED LOADS') {
      axios
        .get('/api/loads/shipped')
        .then((res) => {
          const shippedLoads = res?.data?.loads

          setFilteredLoads([...shippedLoads])
        })
        .catch(() => {
          setFilteredLoads([])
        })
    }
  }

  useEffect(() => {
    showFilteredTrucks(activeTab)
  }, [trucks, activeTab])

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <SideBar setActiveTab={setActiveTab} />
        <Box component='main' sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Box
            sx={{
              height: 630,
              width: '100%'
            }}
          >
            {activeTab === 'ACTIVE LOAD' ||
            activeTab === 'COMPLETED LOADS' ? (
              <CollapsibleTableTruck
                trucks={filteredLoads}
                activeTab={activeTab}
                setFilteredLoads={setFilteredLoads}
              />
            ) : (
              <TruckTable
                trucks={filteredTrucks}
                setTrucks={setTrucks}
                activeTab={activeTab}
                fetchTrucks={fetchTrucks}
              />
            )}

            <Fab
              color='primary'
              aria-label='add'
              sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem'
              }}
              onClick={handleClickCreateLoadModal}
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>
      </Box>

      <CreateTruckForm
        openModal={openModal}
        handleClose={handleCloseCreateLoadModal}
        handleSubmit={createTruck}
      />
    </>
  )
}

export default DashboardPage
