import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'

import DraggablePaper from './DraggablePaper'


const UploadAnnotationsDialog = ({
  open,
  close,
  onUpload,
}) => {

  const renderTitle = () => {
    return (
      <React.Fragment>
        Upload Annotations File
        <IconButton onClick={close}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {
    return (
      <React.Fragment>
      </React.Fragment>
    )
  }

  const renderButtons = () => {}

  return (
    <Dialog
      open={open}
      onClose={close}
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-upload-annotations-handle'}}>
      <DialogTitle classes={{ root: 'draggable-upload-annotations-handle' }}>
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


export default UploadAnnotationsDialog
