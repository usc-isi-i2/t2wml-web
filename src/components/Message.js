import React, { useState } from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'


const Message = ({ message }) => {

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
        severity={message.type}
        onClose={handleClose}>
        {message.text}
      </Alert>
    </Snackbar>
  )
}


export default Message
