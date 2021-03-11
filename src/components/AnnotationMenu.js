import React from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import Draggable from 'react-draggable'

import * as utils from '../utils/table'


const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}))


const AnnotationMenu = ({
  selection,
  openMenu,
  hideMenu,
}) => {

  const classes = useStyles()

  const handleOnSubmit = (event) => {
    event.preventDefault()
    hideMenu()
  }

  const renderSelectionInput = () => {
    return (
      <TextField id="selection" label="Selected area" variant="filled" />
    )
  }

  const renderForm = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        {renderSelectionInput()}
      </form>
    )
  }

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
        {renderForm()}
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color="primary"
          variant="contained"
          onClick={handleOnSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}


export default AnnotationMenu
