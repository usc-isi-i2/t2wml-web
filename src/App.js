import React, { useState } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import {
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles'


import Header from './components/Header'


const styles = theme => ({
  '@global': {
    body: {
      width: '100vw',
      height: '100vh',
      color: '#fefefe',
      background: 'linear-gradient(180deg, #4D4D4D, #737373)',
    },
  },
})


const App = () => {
  const theme = createMuiTheme()

  const [darkTheme, setDarkTheme] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        darkTheme={darkTheme}
        switchTheme={() => setDarkTheme(!darkTheme)} />
    </ThemeProvider>
  )
}


export default withStyles(styles)(App)
