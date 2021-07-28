import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import DraggablePaper from './DraggablePaper'


const ConfirmationDialog = ({ open, close }) => {

  const renderTitle = () => {
    return (
      <React.Fragment>
        Are you sure?
        <IconButton onClick={close}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {}

  const renderButtons = () => {}

  return (
    <Dialog
      open={open}
      onClose={close}
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-confirmation-handle'}}>
      <DialogTitle classes={{ root: 'draggable-confirmation-handle' }}>
        {renderTitle()}
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderButtons()}
      </DialogActions>
    </Dialog>
  )
}


export default ConfirmationDialog
