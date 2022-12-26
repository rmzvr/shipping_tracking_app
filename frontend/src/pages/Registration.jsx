import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import axios from '../api/axios'

import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  Link,
  Grid,
  Paper,
  Button,
  Avatar,
  TextField,
  Typography,
  FormControl,
  CssBaseline
} from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import useSnackbar from '../hooks/useSnackbar'

export default function RegistrationPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('SHIPPER')

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  const showSnackbar = useSnackbar()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const credentials = {
      email,
      password,
      role
    }

    await axios
      .post('/api/auth/register', credentials)
      .then((res) => {
        const message = res.data.message
        showSnackbar(message, 'success')
        navigate('/login')
      })
      .catch((error) => {
        const errorMessage = error?.response?.data.message

        showSnackbar(errorMessage, 'error')
      })
  }

  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <CssBaseline />

      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            'url(https://www.owrlogistics.co.uk/wp-content/uploads/2020/06/parcel.png)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>

          <Box
            component='form'
            onSubmit={handleSubmit}
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

            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              onChange={handlePasswordChange}
            />

            <FormControl fullWidth margin='normal'>
              <InputLabel id='demo-simple-select-label'>
                Register as
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={role}
                label='Register as'
                fullWidth
                onChange={handleRoleChange}
              >
                <MenuItem value={'SHIPPER'}>Shipper</MenuItem>
                <MenuItem value={'DRIVER'}>Driver</MenuItem>
              </Select>
            </FormControl>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 1, mb: 2 }}
            >
              Sign Up
            </Button>

            <Grid container>
              <Grid item>
                <Link
                  component={RouterLink}
                  to='/login'
                  variant='body2'
                >
                  {'Already have an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
