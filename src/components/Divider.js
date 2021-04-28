import React, { useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'

import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  divider: {
    flex: '0 0 .5em',
    width: theme.spacing(1),
    height: '95vh',
    position: 'absolute',
    left: '65vw',
    cursor: 'ew-resize',
    background: '#c7c7c7',
    zIndex: '5',
    '&.active': {
      background: '#a1a1a1',
      transform: 'all 250ms ease',
    },
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
      <div className={classNames(classes.divider, {active})} />
    </Draggable>
  )
}


export default Divider
