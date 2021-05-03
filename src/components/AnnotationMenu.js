import React, { useEffect, useState } from 'react'

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
  FormHelperText,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import Draggable from 'react-draggable'

import { ROLES, TYPES } from '../content/annotation-options'
import uploadAnnotations from '../utils/uploadAnnotations'
import fetchProperties from '../utils/fetchProperties'
import useStyles from '../styles/annotationMenu'
import * as utils from '../utils/table'


const AnnotationMenu = ({
  file,
  sheet,
  selection,
  suggestions,
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

  const [properties, setProperties] = useState([])

  useEffect(() => {

    if ( !selectedAnnotation ) {

      // update form state with suggested type, role and property values
      setFormState({
        ...formState,
        selectedRole: !!suggestions['roles'].length ? suggestions['roles'][0] : '',
        selectedType: !!suggestions['types'].length ? suggestions['types'][0] : '',
        selectedProperty: 'property' in suggestions['children'] ? suggestions['children']['property'] : '',
      })
    } else {

      // reset the form state to all defaults
      setFormState({
        ...formState,
        selectedRole: '',
        selectedType: '',
        selectedProperty: '',
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAnnotation, suggestions])

  const handleOnSubmit = event => {
    event.preventDefault()

    if ( ( !formState.selectedRole && !selectedAnnotation ) || ( !!selectedAnnotation && !selectedAnnotation.role ) ) { return }

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
      hideMenu(data.annotations, data.partialCsv)
    }).catch(error => {
      hideMenu()
    })
  }

  const handleOnDelete = () => {
    if ( ( !formState.selectedRole && !selectedAnnotation ) || ( !!selectedAnnotation && !selectedAnnotation.role ) ) { return }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      hideMenu(data.annotations, data.partialCsv, selectedAnnotation)
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
    if ( event.target.name === 'selectedProperty' ) {
      if ( !value ) {
        setProperties([])
      } else {
        fetchProperties(value)
        .then(data => setProperties(data))
        .catch(error => console.log(error))
      }
    }
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to provide annotations for the selected area in the table
        </FormHelperText>
      </Grid>
    )
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
          inputProps={{'data-lpignore': 'true'}}
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
    } else {
      if ( !!suggestions['types'].length ) {
        defaultValue = suggestions['types'][0]
      }
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

      if  ( option.value === 'property' ) {
        const parsedCorrectly = parseSelectedAreaInput(formState.selectedPropertyCells)
        return (
          <Grid item xs={12} key={option.value}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  id={'selectedPropertyCells'}
                  name={'selectedPropertyCells'}
                  label={'Select property cells'}
                  value={formState.selectedPropertyCells}
                  error={!!formState.selectedPropertyCells && !parsedCorrectly}
                  helperText={formState.selectedPropertyCells && !parsedCorrectly ? (
                    'format: [col][row]:[col][row]'
                  ) : ''}
                  onChange={handleOnChange} />
              </Grid>
              <Grid item xs={6}>
                <FormHelperText component="p" style={{marginTop: '0'}}>
                  You can select property cells in the table or search wikidata for a property in the search box below
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={'Search wikidata property'}
                  id={`selected${option.label}`}
                  name={`selected${option.label}`}
                  value={formState[`selected${option.label}`] || defaultValue}
                  onChange={handleOnChange} />
              </Grid>
              <Grid item xs={12}>
                <ol className={classes.properties}>
                  {properties.map(property => (
                    <li key={property.qnode}>
                      {`${property.label[0]} (${property.qnode})`}
                    </li>
                  ))}
                </ol>
              </Grid>
            </Grid>
          </Grid>
        )
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

  const renderTitle = () => {
    return (
      <React.Fragment>
        {`Annotate this ${utils.isBlock(selection) ? 'block' : 'cell'}`}
        <IconButton aria-label="close" onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderContent = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderFormInstructions()}
          {renderSelectedAreaInput()}
          {renderSelectedRoleInput()}
          {renderSelectedTypeInput()}
          {renderSelectedTypeChildren()}
        </Grid>
      </form>
    )
  }

  const renderButtons = () => {
    return (
      <Grid container spacing={3} justify="space-between">
        <Grid item>
          <Button
            autoFocus
            color="primary"
            variant="contained"
            disabled={
              (!formState.selectedRole && !selectedAnnotation) ||
              (!!selectedAnnotation && !selectedAnnotation.role)
            }
            onClick={handleOnSubmit}>
            Submit
          </Button>
        </Grid>
        <Grid item>
          {!!selectedAnnotation && (
            <Button
              onClick={handleOnDelete}
              className={classes.deleteButton}>
              DELETE
            </Button>
          )}
        </Grid>
      </Grid>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{ paper: classes.menu }}
      aria-labelledby='dialog-modal-title'
      PaperProps={{ tabIndex: -1 }}
      TransitionComponent={Draggable}
      TransitionProps={{ handle: '.draggable-handle' }}>
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


export default AnnotationMenu
