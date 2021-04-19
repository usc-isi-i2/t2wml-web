import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  divider: {
    width: '5px',
    height: '100vh',
    position: 'absolute',
    left: '50vw',
    top: theme.spacing(6),
    cursor: 'ew-resize',
    background: '#c7c7c7',
    zIndex: '5',
  },
}))


const Divider = ({ setColWidth }) => {

  const classes = useStyles()

  const handleOnDrag = event => {
    event.preventDefault()
    setColWidth(event.clientX)
  }

  return (
    <Draggable axis="x" onDrag={handleOnDrag}>
      <div className={classes.divider} />
    </Draggable>
  )
}


export default Divider
