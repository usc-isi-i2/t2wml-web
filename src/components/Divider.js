import React, { useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  divider: {
    top: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    width: '10px',
    cursor: 'col-resize',
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

  const [active, setActive] = useState(false)

  const handleOnMouseMove = useCallback(event => {
    setColWidth(`${event.pageX * 100 / window.innerWidth}vw`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnMouseDown = event => {
    event.preventDefault()
    document.addEventListener('mousemove', handleOnMouseMove)
    setActive(true)
  }

  const handleOnMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleOnMouseMove)
    setActive(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // component did mount
    document.addEventListener('mouseup', handleOnMouseUp)

    // component will unmount
    return () => {
      document.removeEventListener('mouseup', handleOnMouseUp)
    }
  }, [handleOnMouseUp])

  return (
    <div
      onMouseDown={handleOnMouseDown}
      className={classNames(classes.divider, {active})} />
  )
}


export default Divider
