import { Alert, Snackbar } from '@mui/material'

export default function Snack({
  isOpen,
  handleClose = Function.prototype
}) {
  return (
    <Snackbar
      open={isOpen}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert severity='success'>Success</Alert>
    </Snackbar>
  )
}
