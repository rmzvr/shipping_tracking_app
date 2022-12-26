import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useAvatar, useAvatarUpdate } from '../context/AvatarProvider'
import usePrivateAxios from '../hooks/usePrivateAxios'

export default function ClippedDrawer() {
  const avatar = useAvatar()

  const axios = usePrivateAxios()

  const updateAvatar = useAvatarUpdate()

  useEffect(() => {
    axios.get('/api/users/me/image').then((res) => {
      updateAvatar(res?.data?.image)
    })
  }, [avatar, axios, updateAvatar])

  const navigate = useNavigate()
  const location = useLocation()

  const path = location?.pathname.substring(1)

  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  function handleLogout() {
    sessionStorage.removeItem('jwt_token')
    navigate('/login', { replace: true })
  }

  return (
    <AppBar
      position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/', { replace: true })}
        >
          <LocalShippingIcon
            sx={{ display: { xs: 'none', md: 'inline' }, mr: 1 }}
          />
          <Typography variant='h6' noWrap component='div'>
            SHIPPING LAB
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            src={avatar ?? '/static/images/avatars/avatar_6.png'}
          />
        </IconButton>
        <Menu
          sx={{ mt: '45px' }}
          id='menu-appbar'
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {path === 'profile' ? (
            <MenuItem
              key={'Dashboard'}
              onClick={() =>
                navigate('/dashboard', { replace: true })
              }
            >
              <Typography textAlign='center'>
                {'Dashboard'}
              </Typography>
            </MenuItem>
          ) : (
            <MenuItem
              key={'Profile'}
              onClick={() => navigate('/profile', { replace: true })}
            >
              <Typography textAlign='center'>{'Profile'}</Typography>
            </MenuItem>
          )}
          <MenuItem key={'Logout'} onClick={handleLogout}>
            <Typography textAlign='center'>{'Logout'}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
