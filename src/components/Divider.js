import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


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

  const [delta, setDelta] = useState(0)

  const handleOnDrag = (event, drag) => {
    setDelta(prevDelta => prevDelta + drag.deltaX)
  }

  return (
    <Draggable axis="x" onDrag={handleOnDrag}>
      <div className={classes.divider} />
    </Draggable>
  )
}


export default Divider
