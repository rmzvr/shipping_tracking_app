/* eslint-disable no-unused-vars */

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
import UnarchiveIcon from '@mui/icons-material/Unarchive'

import { visuallyHidden } from '@mui/utils'
import { alpha } from '@mui/material/styles'

import EditTruckForm from './EditTruck'
import usePrivateAxios from '../hooks/usePrivateAxios'
import useSnackbar from '../hooks/useSnackbar'
import useSort from '../hooks/useSort'

const headCells = [
  {
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Type'
  },
  {
    id: 'created_date',
    numeric: false,

    disablePadding: true,
    label: 'Created date'
  },
  {
    id: 'payload',
    numeric: false,
    disablePadding: true,
    label: 'Max weight'
  },
  {
    id: 'width',
    numeric: false,
    disablePadding: true,
    label: 'Max width'
  },
  {
    id: 'height',
    numeric: false,
    disablePadding: true,
    label: 'Max height'
  },
  {
    id: 'length',
    numeric: false,
    disablePadding: true,
    label: 'Max length'
  }
]

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>

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
  handleDelete,
  handleClickEditLoadModal,
  assignTruck,
  unassignTruck
}) {
  return (
    <>
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

        {numSelected === 1 && (
          <>
            {activeTab === 'AVAILABLE TRUCKS' ? (
              <>
                <Tooltip title='Assign'>
                  <IconButton onClick={assignTruck}>
                    <ArchiveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Edit'>
                  <IconButton onClick={handleClickEditLoadModal}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title='Unassign'>
                <IconButton onClick={unassignTruck}>
                  <UnarchiveIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}

        {numSelected > 1 && (
          <>
            {activeTab === 'AVAILABLE TRUCKS' && (
              <Tooltip title='Delete'>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Toolbar>
    </>
  )
}

export default function EnhancedTable({
  trucks,
  activeTab,
  fetchTrucks
}) {
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [truck, setTruck] = useState({})

  const axios = usePrivateAxios()

  const {
    getComparator,
    stableSort,
    handleRequestSort,
    order,
    orderBy
  } = useSort()

  const showSnackbar = useSnackbar()

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = trucks.map((n) => n._id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  const [openEditLoadModal, setOpenEditLoadModal] = useState(false)

  const handleClickEditLoadModal = () => {
    setTruck(...trucks.filter((l) => l._id === selected[0]))
    setOpenEditLoadModal(true)
  }

  const handleCloseEditTruckModal = () => {
    setOpenEditLoadModal(false)
  }

  async function handleSubmitEditTruckModal(truck) {
    const truckID = selected[0]

    try {
      const res = await axios.put(`/api/trucks/${truckID}`, truck)

      fetchTrucks()
      selected.length = 0

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  async function assignTruck() {
    const truckID = selected[0]

    try {
      const res = await axios.post(`/api/trucks/${truckID}/assign`)

      fetchTrucks()
      selected.length = 0

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  async function unassignTruck() {
    const truckID = selected[0]

    try {
      const res = await axios.post(`/api/trucks/${truckID}/unassign`)

      fetchTrucks()
      selected.length = 0

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  const handleDelete = () => {
    try {
      selected.forEach(async (truckID) => {
        const res = await axios.delete(`/api/trucks/${truckID}`)

        fetchTrucks()

        setSelected((prev) => [
          ...prev.filter((id) => id !== truckID)
        ])

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
            handleDelete={handleDelete}
            handleClickEditLoadModal={handleClickEditLoadModal}
            assignTruck={assignTruck}
            unassignTruck={unassignTruck}
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
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={trucks.length}
              />
              <TableBody>
                {!trucks.length ? (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Typography>No trucks</Typography>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ) : (
                  stableSort(trucks, getComparator(order, orderBy))
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
                            handleClick(event, row._id)
                          }
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId
                              }}
                            />
                          </TableCell>

                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                          >
                            {row.type}
                          </TableCell>
                          <TableCell>
                            {moment(row.created_date).fromNow()}
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
            count={trucks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>

      <EditTruckForm
        truck={truck}
        openModal={openEditLoadModal}
        handleClose={handleCloseEditTruckModal}
        handleSubmit={handleSubmitEditTruckModal}
      />
    </>
  )
}
