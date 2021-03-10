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

  const [darkTheme, setDarkTheme] = useState(true)

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
    overrides: {
      MuiButton: {
        root: {
          background: darkTheme ? '#777' : '#555',
        },
      },
      MuiDialog: {
        root: {
          pointerEvents: 'none',
          '& .MuiDialog-container .MuiPaper-root': {
            border: darkTheme ? '1px solid #fefefe' : '1px solid #777',
            pointerEvents: 'all',
            outline: 'none',
            '& .MuiDialogTitle-root': {
              cursor: 'pointer',
            },
          },
        },
      },
      MuiBackdrop: {
        root: {
          display: 'none',
        },
      },
      MuiDialogActions: {
        root: {
          justifyContent: 'flex-start',
        },
      },
    },
    props: {
      MuiButton: {
        disableRipple: true,
      },
      MuiCheckbox: {
        disableRipple: true,
      },
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
