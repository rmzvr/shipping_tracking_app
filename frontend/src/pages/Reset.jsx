import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import axios from '../api/axios'

import useSnackbar from '../hooks/useSnackbar'

import {
  Box,
  Link,
  Grid,
  Button,
  Avatar,
  Container,
  TextField,
  Typography,
  CssBaseline
} from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const RESET_URL = 'api/auth/forgot_password'

export default function RecoveryPage() {
  const showSnackbar = useSnackbar()

  const navigate = useNavigate()

  const [email, setEmail] = useState('')

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const credentials = {
      email
    }

    try {
      const res = await axios.post(RESET_URL, credentials)

      const message = res?.data?.message

      showSnackbar(message, 'success')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 3000)
    } catch (error) {
      const errorMessage = error?.response?.data.message

      showSnackbar(errorMessage, 'error')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component='h1' variant='h5'>
          Reset password
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoFocus
            onChange={handleEmailChange}
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Reset password
          </Button>
          <Grid container>
            <Grid item>
              <Link
                component={RouterLink}
                to='/login'
                variant='body2'
              >
                {'Remembered the password? Sign In'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
