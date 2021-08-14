import React, { useRef } from 'react'

import Paper from '@material-ui/core/Paper'
import Draggable from 'react-draggable'


const DraggablePaper = props => {
  const nodeRef = useRef(null)
  return (
    <Draggable bounds="body" handle={props.handle} nodeRef={nodeRef}>
      <Paper {...props} />
    </Draggable>
  )
}


export default DraggablePaper
