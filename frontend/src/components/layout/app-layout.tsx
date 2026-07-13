import React from 'react'
import { observer } from 'mobx-react-lite'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import NavBar, { DRAWER_WIDTH } from './nav-bar'
import useStores from '../../hooks-use-stores'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifierStore } = useStores()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Neighbourhood Library Service
          </Typography>
        </Toolbar>
      </AppBar>
      <NavBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${DRAWER_WIDTH}px)` }}
      >
        <Toolbar />
        {children}
      </Box>
      <Snackbar
        open={notifierStore.open}
        autoHideDuration={4000}
        onClose={notifierStore.close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={notifierStore.close} severity={notifierStore.severity} variant="filled">
          {notifierStore.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default observer(AppLayout)
