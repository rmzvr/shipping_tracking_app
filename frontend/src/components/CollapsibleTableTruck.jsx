/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

import moment from 'moment'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Collapse,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material'

import { visuallyHidden } from '@mui/utils'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import usePrivateAxios from '../hooks/usePrivateAxios'
import useSnackbar from '../hooks/useSnackbar'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name'
  },
  {
    id: 'state',
    numeric: false,
    disablePadding: true,
    label: 'State'
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
    id: 'created_date',
    numeric: false,

    disablePadding: true,
    label: 'Created date'
  }
]

function Row({ row, activeTab }) {
  const axios = usePrivateAxios()

  const [open, setOpen] = useState(false)

  const [state, setState] = useState(row.state)

  const handleChange = (event) => {
    setState(event.target.value)
    changeStatus()
  }

  const states = [
    'En route to Pick Up',
    'Arrived to Pick Up',
    'En route to delivery',
    'Arrived to delivery'
  ]

  const showSnackbar = useSnackbar()

  async function changeStatus() {
    try {
      const res = await axios.patch('/api/loads/active/state')

      showSnackbar(res?.data?.message, 'success')
    } catch (error) {
      const errorMessage = error?.response?.data?.message
      showSnackbar(errorMessage, 'error')
    }
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          {row.name}
        </TableCell>
        {activeTab === 'COMPLETED LOADS' ? (
          <TableCell component='th' scope='row'>
            {row.state}
          </TableCell>
        ) : (
          <TableCell>
            <FormControl size='small'>
              <Select
                sx={{ fontSize: 15 }}
                labelId='demo-select-small'
                id='demo-select-small'
                value={state}
                defaultValue={state}
                onChange={handleChange}
              >
                <MenuItem disabled value={'En route to Pick Up'}>
                  En route to Pick Up
                </MenuItem>
                <MenuItem
                  disabled={states[1 - 1] === state ? false : true}
                  value={'Arrived to Pick Up'}
                >
                  Arrived to Pick Up
                </MenuItem>
                <MenuItem
                  disabled={states[2 - 1] === state ? false : true}
                  value={'En route to delivery'}
                >
                  En route to delivery
                </MenuItem>
                <MenuItem
                  disabled={states[3 - 1] === state ? false : true}
                  value={'Arrived to delivery'}
                >
                  Arrived to delivery
                </MenuItem>
              </Select>
            </FormControl>
          </TableCell>
        )}
        <TableCell>{row.pickup_address}</TableCell>
        <TableCell>{row.delivery_address}</TableCell>
        <TableCell>{moment(row.created_date).fromNow()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={12}
        >
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Load
              </Typography>
              <Table size='medium'>
                <TableHead>
                  <TableRow>
                    <TableCell>Weight</TableCell>
                    <TableCell>Width</TableCell>
                    <TableCell>Height</TableCell>
                    <TableCell>Length</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow key={row?.payload || 'truck'}>
                    <TableCell component='th' scope='row'>
                      {row?.payload || ''}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.dimensions?.width || ''}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.dimensions?.height || ''}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {row?.dimensions?.length || ''}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Logs
              </Typography>
              <Table size='medium'>
                <TableHead>
                  <TableRow>
                    <TableCell>Message</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row?.logs?.map((log) => (
                    <TableRow key={log.time || 'log'}>
                      <TableCell component='th' scope='row'>
                        {log.message}
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        {moment(log.time).fromNow()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function CollapsibleTable({ trucks, activeTab }) {
  const rowsPerPage = 10

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [page, setPage] = useState(0)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
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

        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={
                    orderBy === headCell.id ? order : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={
                      orderBy === headCell.id ? order : 'asc'
                    }
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

          <TableBody>
            {!trucks.length ? (
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Typography>No active load</Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              stableSort(trucks, getComparator(order, orderBy))
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((truck) => (
                  <Row
                    key={truck._id}
                    row={truck}
                    activeTab={activeTab}
                  />
                ))
            )}
          </TableBody>
        </Table>

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
  )
}
