import React, { useState } from 'react'

import Fab from '@material-ui/core/Fab'
import Grow from '@material-ui/core/Grow'
import Slide from '@material-ui/core/Slide'
import Tooltip from '@material-ui/core/Tooltip'
import GetAppIcon from '@material-ui/icons/GetApp'

import { makeStyles } from '@material-ui/styles'

import downloadFile from '../utils/downloadFile'
import classNames from '../utils/classNames'


const OPTIONS = [{
  label: 'ZIP',
  value: 'zip',
  title: '.zip',
}, {
  label: 'T2WML',
  value: 't2wmlz',
  title: '.t2wmlz',
}]


const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    width: theme.spacing(21),
    height: theme.spacing(10),
    right: 0,
    bottom: 0,
    zIndex: 100,
    '&.active': {
      height: theme.spacing(50),
    },
  },
  button: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    '& svg': {
      marginRight: theme.spacing(1),
    },
    '&.csv': {
      bottom: theme.spacing(43),
    },
    '&.tsv': {
      bottom: theme.spacing(35),
    },
    '&.json': {
      bottom: theme.spacing(27),
    },
    '&.zip': {
      bottom: theme.spacing(19),
    },
    '&.t2wmlz': {
      bottom: theme.spacing(11),
    },
  },
}))


const Download = ({ filename, sheetname }) => {

  const classes = useStyles()

  const [active, setActive] = useState(false)

  const handleOnClick = fileType => {
    downloadFile(filename, sheetname, fileType)
  }

  const renderDownloadOptions = () => {
    return OPTIONS.map((option, i) => (
      <Grow key={option.value}
        in={active}
        timeout={100 * (OPTIONS.length - i)}>
        <Tooltip arrow placement="left" title={option.title}>
          <Fab
            className={[classes.button, option.value]}
            onClick={() => handleOnClick(option.value)}>
            {option.label}
          </Fab>
        </Tooltip>
      </Grow>
    ))
  }

  return (
    <div className={classNames(classes.wrapper, {active})}
      onMouseLeave={() => setActive(false)}>
      <Slide
        in={true}
        direction="up"
        mountOnEnter
        unmountOnExit>
        <Fab variant="extended"
          className={classes.button}
          onMouseEnter={() => setActive(true)}>
          <GetAppIcon fontSize="default" />
          Download
        </Fab>
      </Slide>
      {renderDownloadOptions()}
    </div>
  )
}


export default Download
