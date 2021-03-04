import React, { useState } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import {
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles'


import Header from './components/Header'
import Content from './components/Content'


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

  const [darkTheme, setDarkTheme] = useState(false)

  const theme = createMuiTheme({
    palette: {
      type: darkTheme ? 'dark' : 'light',
      primary: {
        main: '#4D4D4D',
        contrastText: '#fefefe',
      },
      secondary: {
        main: '#fefefe',
        contrastText: '#4D4D4D',
      },
    },
    shape: {
      borderRadius: 'none',
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        darkTheme={darkTheme}
        switchTheme={() => setDarkTheme(!darkTheme)} />
      <Content />
    </ThemeProvider>
  )
}


export default withStyles(styles)(App)
