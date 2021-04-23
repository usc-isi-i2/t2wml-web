import React, { useState } from 'react'

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
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
}))


const Download = ({ data, filename }) => {

  const classes = useStyles()

  const [active, setActive] = useState(false)

  const handleOnClick = () => {
    downloadFile(data, filename)
  }

  return (
    <React.Fragment onMouseLeave={setActive(false)}>
      <Slide
        in={data.length > 1}
        direction="up"
        mountOnEnter
        unmountOnExit>
        <Fab variant="extended"
          onClick={handleOnClick}
          className={classes.button}
          onMouseEnter={setActive(true)}>
          <GetAppIcon fontSize="default" />
          Download
        </Fab>
      </Slide>
    </React.Fragment>
  )
}


export default Download
