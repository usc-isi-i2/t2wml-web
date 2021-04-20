import React from 'react'

import Fab from '@material-ui/core/Fab'
import GetAppIcon from '@material-ui/icons/GetApp'

import { makeStyles } from '@material-ui/styles'

import downloadFile from '../utils/downloadFile'


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


const Download = ({ data, filename }) => {

  const classes = useStyles()

  const handleOnClick = () => {
    downloadFile(data, filename)
  }

  return (
    <Fab variant="extended"
      onClick={handleOnClick}
      className={classes.button}>
      <GetAppIcon fontSize="medium" />
      Download
    </Fab>
  )
}


export default Download
