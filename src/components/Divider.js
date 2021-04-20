import React, { useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  divider: {
    width: '5px',
    height: '95vh',
    position: 'absolute',
    left: '65vw',
    top: theme.spacing(6),
    cursor: 'ew-resize',
    background: '#c7c7c7',
    zIndex: '5',
  },
}))


const Divider = ({ setColWidth }) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const handleOnDrag = event => {
    event.preventDefault()
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setColWidth(event.clientX)
    }, 1)
  }

  return (
    <Draggable axis="x" onDrag={handleOnDrag}>
      <div className={classes.divider} />
    </Draggable>
  )
}


export default Divider
