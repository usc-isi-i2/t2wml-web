import React from 'react'

import Fab from '@material-ui/core/Fab'
import GetAppIcon from '@material-ui/icons/GetApp'

import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
}))


const Download = () => {

  const classes = useStyles()

  return (
    <Fab variant="extended" className={classes.button}>
      <GetAppIcon fontSize="medium" />
      Download
    </Fab>
  )
}


export default Download
