import { useState } from 'react'
import moment from 'moment'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArchiveIcon from '@mui/icons-material/Archive'

import { visuallyHidden } from '@mui/utils'
import { alpha } from '@mui/material/styles'

import usePrivateAxios from '../hooks/usePrivateAxios'

import useSnackbar from '../hooks/useSnackbar'
import useSort from '../hooks/useSort'

import EditItem from './EditLoad'

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'created_date',
    numeric: false,

    disablePadding: true,
    label: 'Created date'
  },
  {
    id: 'pickup_address',
    numeric: false,
    disablePadding: true,
    label: 'Pick-Up Address'
  },
  {
    id: 'delivery_address',
    numeric: false,
    disablePadding: true,
    label: 'Delivery Address'
  },
  {
    id: 'payload',
    numeric: false,
    disablePadding: true,
    label: 'Weight'
  },
  {
    id: 'width',
    numeric: false,
    disablePadding: true,
    label: 'Width'
  },
  {
    id: 'height',
    numeric: false,
    disablePadding: true,
    label: 'Height'
  },
  {
    id: 'length',
    numeric: false,
    disablePadding: true,
    label: 'Length'
  }
]

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  activeTab
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {(activeTab === 'NEW LOADS' ||
          activeTab === 'ASSIGNED LOADS') && (
          <TableCell padding='checkbox'>
            <Checkbox
              color='primary'
              indeterminate={
                numSelected > 0 && numSelected < rowCount
              }
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts'
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc'
                    ? 'sorted descending'
                    : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

function EnhancedTableToolbar({
  numSelected,
  activeTab,
  handleDeleteItem,
  handleOpenModal,
  handlePostItem
}) {
  return (
    <>
      {activeTab === 'NEW LOADS' || activeTab === 'ASSIGNED LOADS' ? (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                )
            })
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color='inherit'
              variant='subtitle1'
              component='div'
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='h6'
              id='tableTitle'
              component='div'
            >
              {activeTab}
            </Typography>
          )}

          {numSelected === 1 && activeTab === 'NEW LOADS' && (
            <>
              <Tooltip title='Post'>
                <IconButton onClick={handlePostItem}>
                  <ArchiveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Edit'>
                <IconButton onClick={handleOpenModal}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton onClick={handleDeleteItem}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {numSelected > 1 && activeTab === 'NEW LOADS' && (
            <Tooltip title='Delete'>
              <IconButton onClick={handleDeleteItem}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      ) : (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            {activeTab}
          </Typography>
        </Toolbar>
      )}
    </>
  )
}

export default function EnhancedTable({
  loads,
  activeTab,
  fetchLoads
}) {
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [load, setLoad] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const rowsPerPage = 10

  const {
    getComparator,
    stableSort,
    handleRequestSort,
    order,
    orderBy
  } = useSort()

  const axios = usePrivateAxios()
  const showSnackbar = useSnackbar()

  const isSelected = (name) => selected.indexOf(name) !== -1

  const handleSelectItem = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  const handleSelectAllItems = (event) => {
    if (event.target.checked) {
      const newSelected = loads.map((n) => n._id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleOpenModal = () => {
    setLoad(...loads.filter((l) => l._id === selected[0]))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  async function handlePostItem() {
    const loadID = selected[0]

    try {
      const res = await axios.post(`/api/loads/${loadID}/post`, load)

      fetchLoads()
      selected.length = 0

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  async function handleEditItem(load) {
    const loadID = selected[0]

    try {
      const res = await axios.put(`/api/loads/${loadID}`, load)

      fetchLoads()
      selected.length = 0

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleDeleteItem = () => {
    try {
      selected.forEach(async (loadID) => {
        const res = await axios.delete(`/api/loads/${loadID}`)

        fetchLoads()

        setSelected((prev) => [...prev.filter((id) => id !== loadID)])

        showSnackbar(res?.data?.message, 'success')
      })
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            activeTab={activeTab}
            handleDeleteItem={handleDeleteItem}
            handleOpenModal={handleOpenModal}
            handlePostItem={handlePostItem}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size={'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                activeTab={activeTab}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllItems}
                onRequestSort={handleRequestSort}
                rowCount={loads.length}
              />
              <TableBody>
                {!loads.length ? (
                  <TableRow>
                    {(activeTab === 'NEW LOADS' ||
                      activeTab === 'ASSIGNED LOADS') && (
                      <TableCell></TableCell>
                    )}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Typography>No loads</Typography>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ) : (
                  stableSort(loads, getComparator(order, orderBy))
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            handleSelectItem(event, row._id)
                          }
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          {(activeTab === 'NEW LOADS' ||
                            activeTab === 'ASSIGNED LOADS') && (
                            <TableCell padding='checkbox'>
                              <Checkbox
                                color='primary'
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                          >
                            {row.name}
                          </TableCell>
                          <TableCell>
                            {moment(row.created_date).fromNow()}
                          </TableCell>
                          <TableCell>{row.pickup_address}</TableCell>
                          <TableCell>
                            {row.delivery_address}
                          </TableCell>
                          <TableCell>{row.payload}</TableCell>
                          <TableCell>
                            {row.dimensions.width}
                          </TableCell>
                          <TableCell>
                            {row.dimensions.height}
                          </TableCell>
                          <TableCell>
                            {row.dimensions.length}
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component='div'
            count={loads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>

      <EditItem
        load={load}
        openModal={isModalOpen}
        handleClose={handleCloseModal}
        handleSubmit={handleEditItem}
      />
    </>
  )
}
