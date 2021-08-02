import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import FileDrop from './FileDrop'


const useStyles = makeStyles(theme => ({
  uploadAnnotationsMenu: {
    '&.MuiPaper-root.MuiDialog-paper': {
      width: '900px',
      maxWidth: '900px',
    },
  },
}))


const UploadAnnotationsDialog = ({
  open,
  close,
  onUpload,
  setMessage,
}) => {

  const classes = useStyles()

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
        <FileDrop
          onSuccess={onUpload}
          setMessage={setMessage}
          uploadAnnotations={true} />
      </React.Fragment>
    )
  }

  const renderButtons = () => {}

  return (
    <Dialog
      open={open}
      onClose={close}
      PaperComponent={DraggablePaper}
      classes={{paper: classes.uploadAnnotationsMenu}}
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
