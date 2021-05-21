import React from 'react'

import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(55),
    right: theme.spacing(15),
  },
}))


const CreateQnode = ({ hideMenu }) => {

  const classes = useStyles()

  const renderTitle = () => {
    return (
      <React.Fragment>
        <Typography variant="body1">
          Create a new Qnode
        </Typography>
        <IconButton onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {}

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={props => (
        <Draggable handle='.draggable-qnode-handle'>
          <Paper {...props} />
        </Draggable>
      )}>
      <DialogTitle classes={{ root: 'draggable-qnode-handle' }}>
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


export default CreateQnode
