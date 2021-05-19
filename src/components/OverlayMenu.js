import React from 'react'

import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  overlayMenu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
  },
}))


const OverlayMenu = ({hideOverlayMenu}) => {

  const renderTitle = () => {}

  const renderContent = () => {}

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideOverlayMenu}
      classes={{paper: classes.overlayMenu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={props => (
        <Draggable handle='.draggable-handle'>
          <Paper {...props} />
        </Draggable>
      )}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
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


export default OverlayMenu
