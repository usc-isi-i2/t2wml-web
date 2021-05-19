import React, { useEffect, useState } from 'react'

import {
  Grid,
  Button,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  FormHelperText,
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import WikifyButton from './WikifyButton'
import PropertyInput from './PropertyInput'
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
  hideOverlayMenu,
  selectedAnnotation,
  onSelectionChange,
}) => {

  const classes = useStyles()

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

  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false)

  useEffect(() => {

    if ( !selectedAnnotation ) {

      // fetch the suggested property using kgtk search
      if ( 'property' in suggestions.children ) {
        fetchProperties(suggestions.children.property, 'exact_match')
        .then(data => {
          if ( !!data.length ) {
            setFormState(formState => {
              return {
              ...formState,
              selectedRole: !!suggestions['role'] ? suggestions['role'] : undefined,
              selectedType: !!suggestions['type'] ? suggestions['type'] : undefined,
              selectedProperty: data[0],
              }
            })
          }
        })
      } else {
        // update form state with suggested type, role and property values
        setFormState(formState => {
          return {
            ...formState,
            selectedRole: !!suggestions['role'] ? suggestions['role'] : undefined,
            selectedType: !!suggestions['type'] ? suggestions['type'] : undefined,
          }
        })
      }
    } else {

      // fetch the suggested property using kgtk search
      if ( selectedAnnotation.property ) {
        fetchProperties(selectedAnnotation.property, 'exact_match')
        .then(data => {
          if ( !!data.length ) {
            setFormState(formState => {
              return {
                ...formState,
                selectedRole: selectedAnnotation.role,
                selectedType: selectedAnnotation.type,
                selectedProperty: data[0],
              }
            })
          }
        })
      } else {
        setFormState(formState => {
          return {
            ...formState,
            selectedRole: selectedAnnotation.role,
            selectedType: selectedAnnotation.type,
          }
        })
      }
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
      property: formState.selectedProperty ? formState.selectedProperty.qnode : '',
      language: formState.selectedLanguage,
      precision: formState.selectedPrecision,
      calendar: formState.selectedCalendar,
      format: formState.selectedFormat,
      unit: formState.selectedUnit,
    })

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      hideOverlayMenu(data.annotations)
    }).catch(error => {
      hideOverlayMenu()
    })
  }

  const handleOnDelete = () => {
    if ( ( !formState.selectedRole && !selectedAnnotation ) || ( !!selectedAnnotation && !selectedAnnotation.role ) ) { return }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      hideOverlayMenu(data.annotations, selectedAnnotation)
    }).catch(error => {
      hideOverlayMenu()
    })
  }

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
    if ( event.target.name === 'selectedArea' ) {
      const newSelection = utils.parseSelectedAreaInput(value)
      if ( newSelection ) {
        onSelectionChange(newSelection)
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
    const parsedCorrectly = utils.parseSelectedAreaInput(formState.selectedArea)
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
            'format: [col][row](:[col][row])?'
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
        {formState.selectedRole === 'mainSubject' && (
          <WikifyButton />
        )}
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
        {formState.selectedType === 'wikibaseitem' && (
          <WikifyButton />
        )}
      </Grid>
    )
  }

  const toggleAdditionalInputs = () => {
    setShowAdditionalInputs(showAdditionalInputs => !showAdditionalInputs)
  }

  const renderAdditionalInputsToggle = () => {
    return (
      <Grid className={classes.additionalFieldsToggle}
        onClick={toggleAdditionalInputs}>
        <IconButton className={classes.removeButton}>
          {showAdditionalInputs ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="inherit">
          {showAdditionalInputs ? 'Hide additional inputs' : 'Show additional inputs'}
        </Typography>
      </Grid>
    )
  }

  const handleOnSelectProperty = node => {
    setFormState({
      ...formState,
      selectedProperty: node,
    })
  }

  const renderAdditionalInputs = () => {
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


    return (
      <React.Fragment>
        {TYPE.children.length > 1 && renderAdditionalInputsToggle()}
        {TYPE.children.map(option => {

          let defaultValue = ''
          if ( selectedAnnotation && selectedAnnotation[option.value] ) {
            defaultValue = selectedAnnotation[option.value]
          }

          if ( option.value === 'property' ) {
            return (
              <PropertyInput key={option.value}
                selectedProperty={formState.selectedProperty}
                onSelectProperty={handleOnSelectProperty} />
            )
          }

          if ( showAdditionalInputs ) {
            return (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={1} key={option.value}>
                  </Grid>
                  <Grid item xs={11} key={option.value}>
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
                </Grid>
              </Grid>
            )
          }

          return null
        })}
      </React.Fragment>
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
    <form noValidate autoComplete="off"
      className={classes.form}
      onSubmit={handleOnSubmit}>
      <Grid container spacing={3}>
        {renderFormInstructions()}
        {renderSelectedAreaInput()}
        {renderSelectedRoleInput()}
        {renderSelectedTypeInput()}
        {renderAdditionalInputs()}
      </Grid>
      {renderButtons()}
    </form>
  )
}


export default AnnotationMenu
