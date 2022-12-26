import { useSnackbar as Snackbar } from 'notistack'

export default function useSnackbar(errorMessage, type) {
  const { enqueueSnackbar } = Snackbar()

  const showSnackbar = (errorMessage, type) => {
    enqueueSnackbar(errorMessage, { variant: type })
  }

  return showSnackbar
}
