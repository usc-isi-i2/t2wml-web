import React, { useState } from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  alert: {
    '& .MuiAlert-message': {
      color: '#fefefe',
    },
  },
}))


const Message = ({ message }) => {

  const classes = useStyles()

  const [open, setOpen] = useState(!!message.text)

  const handleClose = (event, reason) => {
    if ( reason === 'clickaway' ) {
      return
    }
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={10000}>
      <Alert
        elevation={6}
        variant="filled"
        className={classes.alert}
        severity={message.type}
        onClose={handleClose}>
        {message.text}
      </Alert>
    </Snackbar>
  )
}


export default Message
