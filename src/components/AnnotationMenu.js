import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

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

  const getPropertyNode = property => {
    fetchProperties(property, 'exact_match')
    .then(data => {
      if ( !!data.length ) {
        setFormState(formState => {
          return {
            ...formState,
            selectedProperty: data[0],
          }
        })
      }
    })
  }

  useEffect(() => {

    if ( !!suggestions ) {

      // update form state with suggested role and type
      setFormState(formState => {
        return {
          ...formState,
          selectedRole: !!suggestions['role'] ? suggestions['role'] : undefined,
          selectedType: !!suggestions['type'] ? suggestions['type'] : undefined,
          selectedProperty: !!suggestions['children'] ? suggestions['children']['property'] : undefined,
        }
      })
    }

    if ( !!selectedAnnotation ) {

      setFormState(formState => {
        return {
          ...formState,
          selectedRole: selectedAnnotation.role,
          selectedType: selectedAnnotation.type,
        }
      })

      // fetch the suggested property using kgtk search
      if ( selectedAnnotation.property ) {
        getPropertyNode(selectedAnnotation.property)
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

    // check if the selected role can be wikified
    let showWikifyButton = false
    if ( formState.selectedRole ) {
      const ROLE = ROLES.find(role => role.value === formState.selectedRole)
      if ( ROLE && ROLE.wikify ) {
        showWikifyButton = true
      }
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
        {showWikifyButton && <WikifyButton />}
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

    // check if the selected type can be wikified
    let showWikifyButton = false
    if ( formState.selectedType ) {
      const TYPE = TYPES.find(type => type.value === formState.selectedType)
      if ( TYPE && TYPE.wikify ) {
        showWikifyButton = true
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
        {showWikifyButton && <WikifyButton />}
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
        <IconButton>
          {showAdditionalInputs ? <ChevronRightIcon /> : <ExpandMoreIcon />}
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
              <Grid item xs={12} key={option.value}>
                <PropertyInput
                  selectedProperty={formState.selectedProperty}
                  onSelectProperty={handleOnSelectProperty} />
              </Grid>
            )
          }

          if ( showAdditionalInputs ) {
            return (
              <Grid item xs={12} key={option.value}>
                <Grid container>
                  <Grid item xs={1}>
                  </Grid>
                  <Grid item xs={11}>
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

  const renderActionButtons = () => {
    return (
      <Grid item xs={12}>
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
        {renderActionButtons()}
      </Grid>
    </form>
  )
}


export default AnnotationMenu
