import React from 'react'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(65),
    right: theme.spacing(80),
  },
}))


const CreateProperty = ({ hideMenu }) => {

  const classes = useStyles()

  const handleOnSubmit = () => {}

  const renderTitle = () => {
    return (
      <React.Fragment>
        <Typography variant="body1">
          Create a new Property
        </Typography>
        <IconButton onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {}

  const renderButtons = () => {
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={handleOnSubmit}>
        Submit
      </Button>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-property-handle'}}>
      <DialogTitle classes={{ root: 'draggable-property-handle' }}>
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


export default CreateProperty
