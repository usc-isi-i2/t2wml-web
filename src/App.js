import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, withStyles } from '@material-ui/core/styles'


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


class App extends React.Component {
  render() {
    return (
      <ThemeProvider>
        <CssBaseline />
      </ThemeProvider>
    )
  }
}


export default withStyles(styles)(App)
