import React from 'react'

import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
  divider: {
    width: '5px',
    height: '100vh',
    marginRight: '-5px',
    cursor: 'ew-resize',
    background: '#c7c7c7',
    zIndex: '5',
  },
}))


const Divider = () => {

  const classes = useStyles()

  return (
    <div className={classes.divider}></div>
  )
}


export default Divider
