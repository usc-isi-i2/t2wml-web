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

import { ROLES, TYPES } from '../content/annotation-options'
import uploadAnnotations from '../utils/uploadAnnotations'
import * as utils from '../utils/table'


const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}))


const AnnotationMenu = ({
  file,
  sheet,
  selection,
  annotations,
  selectedAnnotation,
  openMenu,
  hideMenu,
  onSelectionChange,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    selectedArea: '',
    selectedRole: '',
    selectedType: '',
    selectedProperty: '',
    selectedLanguage: '',
    selectedPrecision: '',
    selectedCalendar: '',
    selectedFormat: '',
    selectedUnit: '',
  })

  const handleOnSubmit = event => {
    event.preventDefault()

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )
    filteredAnnotations.push({
      selection: {...selection},
      role: formState.selectedRole,
      type: formState.selectedType,
      property: formState.selectedProperty,
      language: formState.selectedLanguage,
      precision: formState.selectedPrecision,
      calendar: formState.selectedCalendar,
      format: formState.selectedFormat,
      unit: formState.selectedUnit,
    })

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      hideMenu(data.annotations)
    }).catch(error => {
      hideMenu()
    })
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

  const handleOnChange = event => {
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
          value={formState.selectedArea || defaultValue}
          error={!!formState.selectedArea && !parsedCorrectly}
          helperText={formState.selectedArea && !parsedCorrectly ? (
            'format: [col][row]:[col][row]'
          ) : ''} />
      </Grid>
    )
  }

  const renderSelectedRoleInput = () => {
    let defaultValue = ''
    if ( selectedAnnotation ) {
      defaultValue = selectedAnnotation.role
    }
    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Role"
          id="selectedRole"
          name="selectedRole"
          variant="outlined"
          value={formState.selectedRole || defaultValue}
          onChange={handleOnChange}>
          {ROLES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    )
  }

  const renderSelectedTypeInput = () => {
    let ROLE = undefined

    if ( formState.selectedRole ) {
      ROLE = ROLES.find(option => (
        option.value === formState.selectedRole
      ))
    }

    if ( selectedAnnotation && selectedAnnotation.role ) {
      ROLE = ROLES.find(option => (
        option.value === selectedAnnotation.role
      ))
    }

    if ( !ROLE || !ROLE.children ) { return }

    let defaultValue = ''
    if ( selectedAnnotation && selectedAnnotation.type ) {
      defaultValue = selectedAnnotation.type
    }

    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Type"
          id="selectedType"
          name="selectedType"
          variant="outlined"
          value={formState.selectedType || defaultValue}
          disabled={!ROLE.children.length}
          onChange={handleOnChange}>
          {ROLE.children.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    )
  }

  const renderSelectedTypeChildren = () => {
    let TYPE = undefined

    if ( formState.selectedType ) {
      TYPE = TYPES.find(option => (
        option.value === formState.selectedType
      ))
    }

    if ( selectedAnnotation && selectedAnnotation.type ) {
      TYPE = TYPES.find(option => (
        option.value === selectedAnnotation.type
      ))
    }

    if ( !TYPE || !TYPE.children ) { return }

    return TYPE.children.map(option => {

      let defaultValue = ''
      if ( selectedAnnotation && selectedAnnotation[option.value] ) {
        defaultValue = selectedAnnotation[option.value]
      }

      return (
        <Grid item xs={12} key={option.value}>
          <TextField
            fullWidth
            variant="outlined"
            label={option.label}
            id={`selected${option.label}`}
            name={`selected${option.label}`}
            value={formState[`selected${option.label}`] || defaultValue}
            onChange={handleOnChange} />
        </Grid>
      )
    })
  }

  const renderForm = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderSelectedAreaInput()}
          {renderSelectedRoleInput()}
          {renderSelectedTypeInput()}
          {renderSelectedTypeChildren()}
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
          disabled={(!formState.selectedRole && !selectedAnnotation) || (!!selectedAnnotation && !selectedAnnotation.role)}
          onClick={handleOnSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}


export default AnnotationMenu
