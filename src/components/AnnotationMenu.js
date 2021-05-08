import React, { useEffect, useRef, useState } from 'react'

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

import WikificationMenu from './WikificationMenu'
import { ROLES, TYPES } from '../content/annotation-options'
import uploadAnnotations from '../utils/uploadAnnotations'
import fetchProperties from '../utils/fetchProperties'
import useStyles from '../styles/annotationMenu'
import * as utils from '../utils/table'


const AnnotationMenu = ({
  file,
  sheet,
  selectedCell,
  selection,
  suggestions,
  annotations,
  selectedAnnotation,
  openMenu,
  hideMenu,
  onSelectionChange,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [formState, setFormState] = useState({
    selectedArea: undefined,
    selectedRole: undefined,
    selectedType: undefined,
    selectedProperty: undefined,
    selectedLanguage: undefined,
    selectedPrecision: undefined,
    selectedCalendar: undefined,
    selectedFormat: undefined,
    selectedUnit: undefined,
  })

  const [properties, setProperties] = useState([])
  const [showWikificationMenu, setShowWikificationMenu] = useState(false)

  useEffect(() => {

    if ( !selectedAnnotation ) {

      // update form state with suggested type, role and property values
      setFormState({
        ...formState,
        selectedRole: !!suggestions['role'] ? suggestions['role'] : '',
        selectedType: !!suggestions['type'] ? suggestions['type'] : '',
        selectedProperty: 'property' in suggestions['children'] ? suggestions['children']['property'] : '',
      })
    } else {

      // reset the form state to all defaults
      setFormState({
        ...formState,
        selectedRole: selectedAnnotation.role,
        selectedType: selectedAnnotation.type,
        selectedProperty: selectedAnnotation.property,
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
      hideMenu(data.annotations)
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
      hideMenu(data.annotations, selectedAnnotation)
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
    if ( event.target.name === 'selectedType' ) {
      if ( value === 'wikibaseitem' ) {
        setShowWikificationMenu(true)
      } else {
        setShowWikificationMenu(false)
      }
    }
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
        clearTimeout(timeoutID.current)
        timeoutID.current = setTimeout(() => {
          fetchProperties(value)
          .then(data => setProperties(data))
          .catch(error => console.log(error))
        }, 250)
      }
    }
  }

  const selectProperty = property => {
    setFormState({
      ...formState,
      selectedProperty: property.qnode,
    })
    setProperties([])
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
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
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
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
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
      if ( !!suggestions['type'] ) {
        defaultValue = suggestions['type']
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
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
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
        return (
          <Grid item xs={12} key={option.value}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  autoCorrect="off"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  label={'Search wikidata property'}
                  id={`selected${option.label}`}
                  name={`selected${option.label}`}
                  value={formState[`selected${option.label}`] || defaultValue}
                  onChange={handleOnChange} />
              </Grid>
              <Grid item xs={12}>
                <ol className={classes.properties}>
                  {properties.map(property => (
                    <li key={property.qnode}
                      onClick={() => selectProperty(property)}>
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
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
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

  const renderAnnotationMenu = () => {
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

  const hideWikificationMenu = () => {
    setShowWikificationMenu(false)
  }

  const renderWikificationMenu = () => {
    if ( !showWikificationMenu ) { return }
    return (
      <WikificationMenu
        selection={selection}
        selectedCell={selectedCell}
        hideMenu={() => hideWikificationMenu()} />
    )
  }

  return (
    <React.Fragment>
      {renderAnnotationMenu()}
      {renderWikificationMenu()}
    </React.Fragment>
  )
}


export default AnnotationMenu
