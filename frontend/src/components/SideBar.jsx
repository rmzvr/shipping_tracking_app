import { useState } from 'react'

import useAuth from '../hooks/useAuth'

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar
} from '@mui/material'

import HistoryIcon from '@mui/icons-material/History'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import InventoryIcon from '@mui/icons-material/Inventory'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DomainVerificationIcon from '@mui/icons-material/DomainVerification'

const drawerWidth = 240

export default function SideBar({ activeTab, setActiveTab }) {
  const { role } = useAuth()

  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
    setActiveTab(event.target.innerText)
  }

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          <ListItem
            key={
              role === 'SHIPPER' ? 'NEW LOADS' : 'AVAILABLE TRUCKS'
            }
            disablePadding
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemButton selected={selectedIndex === 0}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  role === 'SHIPPER'
                    ? 'NEW LOADS'
                    : 'AVAILABLE TRUCKS'
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem
            key={
              role === 'SHIPPER' ? 'POSTED LOADS' : 'ASSIGNED TRUCK'
            }
            disablePadding
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <ListItemButton selected={selectedIndex === 1}>
              <ListItemIcon>
                <FlightTakeoffIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  role === 'SHIPPER'
                    ? 'POSTED LOADS'
                    : 'ASSIGNED TRUCK'
                }
              />
            </ListItemButton>
          </ListItem>

          {role === 'DRIVER' && (
            <>
              <ListItem
                key={'ACTIVE LOAD'}
                disablePadding
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemButton selected={selectedIndex === 2}>
                  <ListItemIcon>
                    <WebAssetIcon />
                  </ListItemIcon>
                  <ListItemText primary={'ACTIVE LOAD'} />
                </ListItemButton>
              </ListItem>

              <ListItem
                key={'COMPLETED LOADS'}
                disablePadding
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemButton selected={selectedIndex === 3}>
                  <ListItemIcon>
                    <DomainVerificationIcon />
                  </ListItemIcon>
                  <ListItemText primary={'COMPLETED LOADS'} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {role === 'SHIPPER' && (
            <>
              <ListItem
                key={'ASSIGNED LOADS'}
                disablePadding
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemButton selected={selectedIndex === 2}>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary={'ASSIGNED LOADS'} />
                </ListItemButton>
              </ListItem>

              <ListItem
                key={'HISTORY'}
                disablePadding
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemButton selected={selectedIndex === 3}>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={'HISTORY'} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  )
}
