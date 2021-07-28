import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'

import DraggablePaper from './DraggablePaper'


const ConfirmationDialog = ({
  open,
  close,
  text,
  onConfirm,
}) => {

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

  const renderContent = () => {
    return (
      <React.Fragment>
        {text}
      </React.Fragment>
    )
  }

  const renderButtons = () => {
    return (
      <React.Fragment>
        <Button
          color="primary"
          variant="contained"
          onClick={onConfirm}>
          Yes, I'm sure
        </Button>
      </React.Fragment>
    )
  }

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
