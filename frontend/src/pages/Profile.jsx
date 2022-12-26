import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import moment from 'moment'

import {
  Box,
  Container,
  Grid,
  Toolbar,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  CardHeader,
  TextField
} from '@mui/material'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

import Header from '../components/Header'

import usePrivateAxios from '../hooks/usePrivateAxios'

import { useAvatar, useAvatarUpdate } from '../context/AvatarProvider'
import useSnackbar from '../hooks/useSnackbar'

export default function Account() {
  const navigate = useNavigate()
  const axios = usePrivateAxios()

  const avatar = useAvatar()
  const updateAvatar = useAvatarUpdate()

  const showSnackbar = useSnackbar()

  async function handleAvatarSubmit(avatar) {
    const formData = new FormData()

    formData.append('avatar', avatar)

    await axios
      .post('/api/users/me/image', formData)
      .then((res) => {
        const imagePath = res?.data?.image
        updateAvatar(imagePath)

        showSnackbar(
          'Avatar has been successfully updated',
          'success'
        )
      })
      .catch((error) => {
        const errorMessage = error?.response?.data.message

        showSnackbar(errorMessage, 'error')
      })
  }

  const [user, setUser] = useState({})

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: ''
  })

  function handleDeleteAccount() {
    axios
      .delete('/api/users/me')
      .then((res) => {
        showSnackbar(res.data.message, 'success')

        sessionStorage.clear()

        navigate('/login', { replace: true })
      })
      .catch((error) => {
        const errorMessage = error?.response?.data.message

        showSnackbar(errorMessage, 'error')
      })
  }

  const handleChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value
    })
  }

  function handleSubmit() {
    axios
      .patch('/api/users/me/password', {
        ...passwords
      })
      .then(() => {
        sessionStorage.removeItem('jwt_token')
        navigate('/login', { replace: true })
        setPasswords({})

        showSnackbar(
          'Password has been successfully updated',
          'success'
        )
      })
      .catch((error) => {
        const errorMessage = error?.response?.data.message

        showSnackbar(errorMessage, 'error')
      })
  }

  useEffect(() => {
    axios.get('/api/users/me').then((res) => {
      setUser(res?.data?.user)
    })
  }, [axios])

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box component='main' sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Box
            component='main'
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >
            <Container maxWidth='md'>
              <Grid container spacing={3}>
                <Grid item lg={4} md={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Avatar
                          src={
                            avatar ??
                            '/static/images/avatars/avatar_6.png'
                          }
                          sx={{
                            height: 64,
                            mb: 2,
                            width: 64
                          }}
                        />
                        <Typography
                          color='textSecondary'
                          variant='body2'
                        >
                          {user?.email || ''}
                        </Typography>
                        <Typography
                          color='textSecondary'
                          variant='body2'
                        >
                          Joined:{' '}
                          {moment(user?.created_date).format(
                            'DD.MM.YYYY'
                          ) || ''}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <Button
                        color='primary'
                        component='label'
                        fullWidth
                        variant='text'
                      >
                        Upload picture
                        <input
                          type='file'
                          accept='image/png, image/jpeg'
                          hidden
                          onChange={(e) =>
                            handleAvatarSubmit(e.target.files[0])
                          }
                        />
                      </Button>
                    </CardActions>
                    <Divider />
                    <CardActions>
                      <Button
                        color='error'
                        component='label'
                        fullWidth
                        variant='text'
                        onClick={handleDeleteAccount}
                      >
                        Delete account
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item lg={8} md={6} xs={12}>
                  <form autoComplete='off' noValidate>
                    <Card>
                      <CardHeader title='Change password' />
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <TextField
                              fullWidth
                              label='Current password'
                              name='oldPassword'
                              onChange={handleChange}
                              required
                              value={passwords.oldPassword}
                              variant='outlined'
                            />
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <TextField
                              fullWidth
                              label='New password'
                              name='newPassword'
                              onChange={handleChange}
                              required
                              value={passwords.newPassword}
                              variant='outlined'
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2
                        }}
                      >
                        <Button
                          color='primary'
                          variant='contained'
                          sx={{ mr: 2, pl: 1 }}
                          onClick={() => {
                            navigate('/dashboard', { replace: true })
                          }}
                        >
                          <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
                          Back to dashboard
                        </Button>
                        <Button
                          color='primary'
                          variant='contained'
                          onClick={handleSubmit}
                        >
                          Change password
                        </Button>
                      </Box>
                    </Card>
                  </form>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  )
}
