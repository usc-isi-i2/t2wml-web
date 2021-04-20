import React from 'react'

import Fab from '@material-ui/core/Fab'
import Slide from '@material-ui/core/Slide'
import GetAppIcon from '@material-ui/icons/GetApp'

import { makeStyles } from '@material-ui/styles'

import downloadFile from '../utils/downloadFile'


const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}))


const Download = ({ data, filename }) => {

  const classes = useStyles()

  const handleOnClick = () => {
    downloadFile(data, filename)
  }

  return (
    <Slide direction="up"
      in={data && data.length > 29}
      mountOnEnter unmountOnExit>
      <Fab
        onClick={handleOnClick}
        className={classes.button}>
        <GetAppIcon fontSize="default" />
      </Fab>
    </Slide>
  )
}


export default Download
