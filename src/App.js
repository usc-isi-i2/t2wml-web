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

  const defaultTheme = createMuiTheme()

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
      borderRadius: '0',
    },
    overrides: {
      MuiButton: {
        containedPrimary: {
          color: darkTheme ? '#4D4D4D' : '#fefefe',
          backgroundColor: darkTheme ? '#fefefe' : '#4D4D4D',
          '&:hover': {
            color: darkTheme ? '#fefefe' : '#4d4d4d',
            backgroundColor: darkTheme ? '#7f7f7f' : '#ddd',
          },
        },
      },
      MuiFormLabel: {
        root: {
          color: darkTheme ? '#d8d8d8' : '#737373',
          '&.Mui-focused': {
            color: darkTheme ? '#fefefe' : '#4d4d4d',
          },
        },
      },
      MuiOutlinedInput: {
        root: {
          '& fieldset': {
            borderColor: darkTheme ? '#d8d8d8' : '#737373',
          },
          '&:hover fieldset': {
            borderColor: darkTheme ? '#fefefe' : '#4d4d4d',
          },
          '&.Mui-focused fieldset': {
            borderColor: darkTheme ? '#fefefe !important' : '#4d4d4d !important',
          },
        },
      },
      MuiDialog: {
        root: {
          userSelect: 'none',
          pointerEvents: 'none',
          '& .MuiDialog-container .MuiPaper-root': {
            border: darkTheme ? '1px solid #fefefe' : '1px solid #777',
            pointerEvents: 'all',
            height: '300px',
            width: '500px',
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
      MuiDialogTitle: {
        root: {
          '& .MuiIconButton-root': {
            position: 'absolute',
            top: defaultTheme.spacing(1),
            right: defaultTheme.spacing(1),
          },
        },
      },
      MuiDialogActions: {
        root: {
          justifyContent: 'flex-start',
          padding: `${defaultTheme.spacing(2)} ${defaultTheme.spacing(3)}`,
        },
      },
    },
    props: {
      MuiButton: {
        disableRipple: true,
      },
      MuiIconButton: {
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
