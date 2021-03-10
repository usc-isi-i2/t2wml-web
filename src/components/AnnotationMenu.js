import React from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'

import Draggable from 'react-draggable'

import * as utils from '../utils/table'


const AnnotationMenu = ({
  selection,
  openMenu,
  hideMenu,
}) => {

  return (
    <Dialog
      open={openMenu}
      onClose={hideMenu}
      aria-labelledby='dialog-modal-title'
      PaperProps={{ tabIndex: -1 }}
      TransitionComponent={Draggable}
      TransitionProps={{ handle: '.draggable-handle' }}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
        Selected {utils.humanReadableSelection(selection)}
      </DialogTitle>
      <DialogContent>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color="primary"
          variant="contained"
          onClick={hideMenu}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}


export default AnnotationMenu
