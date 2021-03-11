import React, { useState } from 'react'

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
  onSelectionChange,
}) => {

  const classes = useStyles()

  const [selectedArea, setSelectedArea] = useState(null)

  const handleOnSubmit = (event) => {
    event.preventDefault()
    hideMenu()
  }

  const parseSelectedAreaInput = value => {
    const regex = /^.?([a-z]+)([0-9]+):([a-z]+)([0-9]+).?$/gmi
    const groups = regex.exec(value)
    if ( groups && groups[1] && groups[2] && groups[3] && groups[4] ) {
      return {
        x1: utils.letterToColumn(groups[1]),
        x2: utils.letterToColumn(groups[3]),
        y1: parseInt(groups[2]),
        y2: parseInt(groups[4]),
      }
    }
  }

  const handleOnChange = (event) => {
    const value = event.target.value
    setSelectedArea(value)
    const newSelection = parseSelectedAreaInput(value)
    if ( newSelection ) {
      onSelectionChange(newSelection)
    }
  }

  const renderSelectionInput = () => {
    const defaultValue = utils.humanReadableSelection(selection)
    const parsedCorrectly = parseSelectedAreaInput(selectedArea)
    return (
      <TextField
        id="selected-area"
        label="Selected area"
        variant="outlined"
        defaultValue={defaultValue}
        value={selectedArea}
        onChange={handleOnChange}
        error={selectedArea && !parsedCorrectly}
        helperText={selectedArea && !parsedCorrectly ? (
          'accepted format: [col][row]:[col][row]'
        ) : ''} />
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
