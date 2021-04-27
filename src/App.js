import React, { useState } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import {
  createMuiTheme,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles'

import Content from './components/Content'


const styles = theme => ({
  '@global': {
    body: {
      width: '100vw',
      height: '100vh',
      color: '#fefefe',
      background: 'linear-gradient(180deg, #4D4D4D, #737373)',
    },
    '@keyframes darkBlink': {
      '45%': {
        background: '#424242',
      },
      '50%': {
        background: 'rgba(59, 171, 117, 0.75)',
      },
      '55%': {
        background: '#424242',
      },
    },
    '@keyframes lightBlink': {
      '45%': {
        background: '#fff',
      },
      '50%': {
        background: 'rgba(50, 205, 50, 0.25)',
      },
      '55%': {
        background: '#fff',
      },
    },
  },
})


const App = () => {

  const [darkTheme, setDarkTheme] = useState(false)

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
      MuiAlert: {
        message: {
          color: '#f44336',
        },
      },
      MuiButton: {
        containedPrimary: {
          color: darkTheme ? '#fefefe' : '#4D4D4D',
          backgroundColor: darkTheme ? '#4d4d4d' : '#fefefe',
          '&:hover': {
            color: darkTheme ? '#333' : '#fff',
            backgroundColor: darkTheme ? '#ddd' : '#7f7f7f',
          },
          '&.Mui-disabled': {
            pointerEvents: 'all',
            cursor: 'not-allowed',
          },
        },
      },
      MuiFab: {
        root: {
          color: darkTheme ? '#fefefe' : '#4D4D4D',
          backgroundColor: darkTheme ? '#4d4d4d' : '#fefefe',
          border: darkTheme ? '1px solid #fefefe' : '1px solid #4d4d4d',
          '&:hover': {
            color: darkTheme ? '#333' : '#fefefe',
            backgroundColor: darkTheme ? '#ddd' : '#7f7f7f',
            border: darkTheme ? '1px solid #333' : '1px solid #fefefe',
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
      MuiLinearProgress: {
        colorPrimary: {
          backgroundColor: 'limegreen',
        },
        bar1Determinate: {
          backgroundColor: 'darkgreen',
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
          '&.Mui-error fieldset': {
            borderColor: '#f44336 !important',
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
            maxHeight: '750px',
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
          paddingTop: defaultTheme.spacing(2),
          paddingLeft: defaultTheme.spacing(3),
          paddingRight: defaultTheme.spacing(3),
          paddingBottom: defaultTheme.spacing(2),
        },
      },
      MuiPopover: {
        paper: {
          padding: defaultTheme.spacing(1),
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
      <Content
        darkTheme={darkTheme}
        setDarkTheme={setDarkTheme} />
    </ThemeProvider>
  )
}


export default withStyles(styles)(App)
