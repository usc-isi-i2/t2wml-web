import React, { useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  divider: {
    width: '10px',
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

  const [active, setActive] = useState(false)

  const handleOnDrag = event => {
    event.preventDefault()
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setColWidth(event.clientX)
    }, 1)
  }

  const handleOnStart = event => {
    setActive(true)
  }

  const handleOnStop = event => {
    setActive(false)
  }

  return (
    <Draggable axis="x"
      onDrag={handleOnDrag}
      onStart={handleOnStart}
      onStop={handleOnStop}>
      <div className={classes.divider} />
    </Draggable>
  )
}


export default Divider
