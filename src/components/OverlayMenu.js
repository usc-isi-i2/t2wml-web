import React from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/styles'

import Draggable from 'react-draggable'

import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(15),
  },
}))


const OverlayMenu = ({ isOpen, handleOnClose, selection }) => {

  const classes = useStyles()

  const openAnnotationMenu = () => {}
  const openWikifyMenu = () => {}

  const renderContent = () => {}

  const renderActions = () => {
    return (
      <Grid container justify="space-between">
        <Grid item xs={12}>
          <Button
            autoFocus
            color="primary"
            variant="link"
            onClick={openAnnotationMenu}>
            1. specify selection (subject/property/value)
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="link"
            onClick={openWikifyMenu}>
            2. link selection to wikidata knowledge base
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleOnClose}
      classes={{ paper: classes.menu }}
      PaperProps={{ tabIndex: -1 }}
      TransitionComponent={Draggable}
      TransitionProps={{ handle: '.draggable-handle' }}>
      <DialogTitle classes={{ root: 'draggable-handle' }}>
        Selected {utils.humanReadableSelection(selection)}
        <IconButton aria-label="close" onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
      <DialogActions>
        {renderActions()}
      </DialogActions>
    </Dialog>
  )
}


export default OverlayMenu
