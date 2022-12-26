import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'

export default function FormDialog({
  load,
  openModal,
  handleClose,
  handleSubmit
}) {
  const [loadName, setLoadName] = useState('')
  const [pickUpAddress, setPickUpAddress] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [loadWeight, setLoadWeight] = useState('')
  const [loadWidth, setLoadWidth] = useState('')
  const [loadHeight, setLoadHeight] = useState('')
  const [loadLength, setLoadLength] = useState('')

  useEffect(() => {
    setLoadName(load?.name)
    setPickUpAddress(load?.pickup_address)
    setDeliveryAddress(load?.delivery_address)
    setLoadWeight(load?.payload)
    setLoadWidth(load?.dimensions?.width)
    setLoadHeight(load?.dimensions?.height)
    setLoadLength(load?.dimensions?.length)
  }, [load])

  return (
    <div>
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Edit load</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id='firstName'
                name='firstName'
                label='Load name'
                fullWidth
                autoComplete='given-name'
                variant='standard'
                value={loadName || ''}
                onChange={(e) => setLoadName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id='address1'
                name='address1'
                label='Pick-Up Address'
                fullWidth
                autoComplete='shipping address-line1'
                variant='standard'
                value={pickUpAddress || ''}
                onChange={(e) => setPickUpAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id='address2'
                name='address2'
                label='Delivery Address'
                fullWidth
                autoComplete='shipping address-line2'
                variant='standard'
                value={deliveryAddress || ''}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                id='standard-number'
                label='Weight'
                type='number'
                fullWidth
                variant='standard'
                value={loadWeight || ''}
                onChange={(e) => setLoadWeight(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id='standard-number'
                label='Width'
                type='number'
                fullWidth
                variant='standard'
                value={loadWidth || ''}
                onChange={(e) => setLoadWidth(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id='standard-number'
                label='Height'
                type='number'
                fullWidth
                variant='standard'
                value={loadHeight || ''}
                onChange={(e) => setLoadHeight(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                id='standard-number'
                label='Length'
                type='number'
                fullWidth
                variant='standard'
                value={loadLength || ''}
                onChange={(e) => setLoadLength(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ mr: 2, mb: 2 }}>
          <Button
            size='large'
            variant='outlined'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size='large'
            variant='contained'
            onClick={() => {
              handleSubmit({
                name: loadName,
                pickup_address: pickUpAddress,
                delivery_address: deliveryAddress,
                payload: loadWeight,
                dimensions: {
                  width: loadWidth,
                  height: loadHeight,
                  length: loadLength
                }
              })
              handleClose()
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
