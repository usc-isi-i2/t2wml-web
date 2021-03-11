import React, { useState } from 'react'

import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  MenuItem,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import CloseIcon from '@material-ui/icons/Close'

import Draggable from 'react-draggable'

import { ROLES } from '../content/annotation-options'
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

  const [formState, setFormState] = React.useState({
    selectedArea: null,
    selectedRole: null,
  })

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
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
    if ( event.target.name === 'selectedArea' ) {
      const newSelection = parseSelectedAreaInput(value)
      if ( newSelection ) {
        onSelectionChange(newSelection)
      }
    }
  }

  const renderSelectedAreaInput = () => {
    const defaultValue = utils.humanReadableSelection(selection)
    const parsedCorrectly = parseSelectedAreaInput(formState.selectedArea)
    return (
      <Grid item xs={6}>
        <TextField
          id="selectedArea"
          name="selectedArea"
          label="Selected area"
          variant="outlined"
          onChange={handleOnChange}
          defaultValue={defaultValue}
          value={formState.selectedArea}
          error={formState.selectedArea && !parsedCorrectly}
          helperText={formState.selectedArea && !parsedCorrectly ? (
            'accepted format: [col][row]:[col][row]'
          ) : ''} />
      </Grid>
    )
  }

  const renderSelectedRoleInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Role"
          id="selectedRole"
          name="selectedRole"
          variant="outlined"
          defaultValue={'Role'}
          value={formState.selectedRole}
          onChange={handleOnChange}>
          {ROLES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    )
  }

  const renderForm = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderSelectedAreaInput()}
          {renderSelectedRoleInput()}
        </Grid>
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
        <IconButton aria-label="close" onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
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
