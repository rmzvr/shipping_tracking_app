/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import { Box, Fab, Toolbar } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import Header from '../components/Header'
import Table from '../components/LoadTable'
import SideBar from '../components/SideBar'
import CreateLoadForm from '../components/CreateLoad'
import CollapsibleTable from '../components/CollapsibleTableLoad'

import usePrivateAxios from '../hooks/usePrivateAxios'
import useSnackbar from '../hooks/useSnackbar'
import useItems from '../hooks/useItems'

function DashboardPage() {
  const showSnackbar = useSnackbar()

  const privateAxios = usePrivateAxios()

  const { items, fetchItems } = useItems('loads')
  const [filteredLoads, setFilteredLoads] = useState([])
  const [activeTab, setActiveTab] = useState('NEW LOADS')

  const [openCreateLoadModal, setOpenCreateLoadModal] =
    useState(false)

  const handleOpenModal = () => {
    setOpenCreateLoadModal(true)
  }

  const handleCloseModal = () => {
    setOpenCreateLoadModal(false)
  }

  async function handleCreateItem(item) {
    try {
      const res = await privateAxios.post('/api/loads/', item)

      fetchItems()

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  function showFilteredItems(status) {
    if (status === 'HISTORY') {
      status = 'SHIPPED'
    }

    setFilteredLoads([
      ...items.filter((item) => item?.status === status.split(' ')[0])
    ])
  }

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    showFilteredItems(activeTab)
  }, [items, activeTab])

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
            {activeTab !== 'ASSIGNED LOADS' ? (
              <Table
                loads={filteredLoads}
                activeTab={activeTab}
                fetchLoads={fetchItems}
              />
            ) : (
              <CollapsibleTable
                loads={filteredLoads}
                activeTab={activeTab}
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
              onClick={handleOpenModal}
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>
      </Box>

      <CreateLoadForm
        openModal={openCreateLoadModal}
        handleClose={handleCloseModal}
        handleSubmit={handleCreateItem}
      />
    </>
  )
}

export default DashboardPage
