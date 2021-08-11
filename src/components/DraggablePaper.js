import React from 'react'

import Paper from '@material-ui/core/Paper'
import Draggable from 'react-draggable'


const DraggablePaper = props => {
  return (
    <Draggable bounds="body" handle={props.handle}>
      <Paper {...props} />
    </Draggable>
  )
}


export default DraggablePaper
