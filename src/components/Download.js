import React, { useState } from 'react'

import Fab from '@material-ui/core/Fab'
import Slide from '@material-ui/core/Slide'
import GetAppIcon from '@material-ui/icons/GetApp'

import { makeStyles } from '@material-ui/styles'

import downloadFile from '../utils/downloadFile'
import classNames from '../utils/classNames'


const OPTIONS = [{
  label: 'CSV',
  value: 'csv',
}, {
  label: 'TSV',
  value: 'tsv',
}, {
  label: 'JSON',
  value: 'json',
}]


const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    width: theme.spacing(21),
    height: theme.spacing(10),
    right: 0,
    bottom: 0,
    '&.active': {
      height: theme.spacing(30),
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
      bottom: theme.spacing(27),
    },
    '&.tsv': {
      bottom: theme.spacing(19),
    },
    '&.json': {
      bottom: theme.spacing(11),
    },
  },
}))


const Download = ({ data, filename }) => {

  const classes = useStyles()

  const [active, setActive] = useState(false)

  const handleOnClick = () => {
    downloadFile(data, filename)
  }

  const renderDownloadOptions = () => {
    return OPTIONS.map(option => {
      const classNames = [classes.button, option.value]
      return (
        <Slide key={option.value}
          in={active}
          direction="up"
          mountOnEnter>
          <Fab variant="extended"
            className={classNames}>
            {option.label}
          </Fab>
        </Slide>
      )
    })
  }

  return (
    <div className={classNames(classes.wrapper, {active})}
      onMouseLeave={() => setActive(false)}>
      <Slide
        in={data.length > 1}
        direction="up"
        mountOnEnter
        unmountOnExit>
        <Fab variant="extended"
          onClick={handleOnClick}
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
