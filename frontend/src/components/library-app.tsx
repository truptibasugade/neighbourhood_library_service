import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import AppLayout from './layout/app-layout'
import LibraryRoutes from '../routes'

const theme = createTheme({
  palette: {
    primary: { main: '#3f6b3f' },
  },
})

const LibraryApp = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppLayout>
      <LibraryRoutes />
    </AppLayout>
  </ThemeProvider>
)

export default LibraryApp
