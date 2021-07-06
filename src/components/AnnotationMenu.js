import React, { useCallback, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import PropertyInput from './PropertyInput'
import { ROLES, TYPES } from '../content/annotation-options'
import uploadAnnotations from '../utils/uploadAnnotations'
import uploadWikinodes from '../utils/uploadWikinodes'
import wikifyRegion from '../utils/wikifyRegion'
import useStyles from '../styles/annotationMenu'
import * as utils from '../utils/table'


const AnnotationMenu = ({
  file,
  sheet,
  selection,
  annotations,
  hideOverlayMenu,
  updateAnnotation,
  onSelectionChange,
  selectedAnnotation,
  suggestedAnnotation,
  updateTableDataLayers,
  setMessage,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    range: '',
    role: '',
    type: '',
    property: '',
    language: '',
    precision: '',
    calendar: '',
    format: '',
    unit: '',
  })

  const [suggestion, setSuggestion] = useState({
    role: '',
    type: '',
    property: '',
  })

  const [annotation, setAnnotation] = useState({
    role: '',
    type: '',
    property: '',
  })

  const [userChangedFormState, setUserChangedFormState] = useState(false)
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false)

  useEffect(() => {
    if ( !suggestedAnnotation ) { return }
    setSuggestion(suggestion => {
      return {
        ...suggestion,
        role: !!suggestedAnnotation['role'] ? suggestedAnnotation['role'] : '',
        type: !!suggestedAnnotation['type'] ? suggestedAnnotation['type'] : '',
        property: !!suggestedAnnotation['children'] ? suggestedAnnotation['children']['property'] : '',
      }
    })
  }, [suggestedAnnotation])

  useEffect(() => {
    if ( !selectedAnnotation ) { return }
    setAnnotation(annotation => {
      return {
        ...annotation,
        id: selectedAnnotation.id,
        role: selectedAnnotation.role,
        type: selectedAnnotation.type,
        property: selectedAnnotation.property,
      }
    })
  }, [selectedAnnotation])

  const getFormValue = useCallback(field => {
    if ( !!formState[field] || typeof formState[field] === 'undefined' ) {
      return formState[field]
    }

    if ( !!annotation[field] && !userChangedFormState ) {
      return annotation[field]
    }

    if ( !!suggestion[field] && !userChangedFormState ) {
      return suggestion[field]
    }

    return ''
  }, [annotation, formState, suggestion, userChangedFormState])

  useEffect(() => {

    // skip if the form state is empty (on init)
    if ( Object.keys(formState).map(key => !!formState[key]).every(x => !x) ) {
      return
    }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    const role = getFormValue('role')
    const type = getFormValue('type')
    const property = getFormValue('property')
    const language = getFormValue('language')
    const precision = getFormValue('precision')
    const calendar = getFormValue('calendar')
    const format = getFormValue('format')
    const unit = getFormValue('unit')
    const id = annotation.id

    filteredAnnotations.push({
      selection: {...selection},
      role: role,
      type: type,
      property: property,
      language: language,
      precision: precision,
      calendar: calendar,
      format: format,
      unit: unit,
      id: id,
    })
    uploadAnnotations(file, sheet, filteredAnnotations, () => {})
    .then(data => {
      updateAnnotation(data.annotations)
      if ( utils.isWikifyable({role: getFormValue('role')}) ) {
        if ( getFormValue('role') === 'mainSubject' ) {
          wikifyRegion(file, sheet, selection)
          .then(layers => updateTableDataLayers(layers))
        } else {
          uploadWikinodes(file, sheet, selection, role === 'property', 'string')
          .then(layers => updateTableDataLayers(layers))
        }
      }
    })
    .catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  const handleOnDelete = () => {
    if ( !annotation.role ) { return }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      updateAnnotation(data.annotations, selectedAnnotation)
      hideOverlayMenu()
    }).catch(error => {
      hideOverlayMenu()
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  const handleOnSubmitPropertyCells = selection => {
    annotations.push({
      selection: {...selection},
      role: 'property',
    })
    uploadAnnotations(file, sheet, annotations, () => {}).then(data => {
      updateAnnotation(data.annotations)
    }).catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  const handleOnSubmitUnitCells = selection => {
    annotations.push({
      selection: {...selection},
      role: 'unit',
    })
    uploadAnnotations(file, sheet, annotations, () => {}).then(data => {
      updateAnnotation(data.annotations)
    }).catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
    if ( event.target.name === 'role' ) {
      setUserChangedFormState(true)
    }
    if ( event.target.name === 'range' ) {
      const newSelection = utils.parseSelectedRangeInput(value)
      if ( newSelection ) {
        onSelectionChange(newSelection)
      }
    }
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to provide annotations for the selected range in the table
        </FormHelperText>
      </Grid>
    )
  }

  const renderSelectedRangeInput = () => {
    const defaultValue = utils.humanReadableSelection(selection)
    const parsedCorrectly = utils.parseSelectedRangeInput(formState.range)
    return (
      <Grid item xs={6}>
        <TextField
          id="range"
          name="range"
          label="Selected range"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.range || defaultValue}
          error={!!formState.range && !parsedCorrectly}
          helperText={formState.range && !parsedCorrectly ? (
            'format: [col][row](:[col][row])?'
          ) : ''} />
      </Grid>
    )
  }

  const renderSelectedRoleInput = () => {
    const currentRole = getFormValue('role')

    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Role"
          id="role"
          name="role"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          value={currentRole}
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
    const currentRole = getFormValue('role')
    const currentType = getFormValue('type')

    let ROLE = undefined
    if ( currentRole ) {
      ROLE = ROLES.find(option => (
        option.value === currentRole
      ))
    }

    if ( !ROLE || !ROLE.children ) { return }

    return (
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label="Type"
          id="type"
          name="type"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          value={currentType}
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
      property: node,
    })
  }

  const handleOnSelectUnit = node => {
    setFormState({
      ...formState,
      unit: node,
    })
  }

  const renderAdditionalInputs = () => {
    const currentType = getFormValue('type')

    let TYPE = undefined
    if ( currentType ) {
      TYPE = TYPES.find(option => (
        option.value === currentType
      ))
    }

    if ( !TYPE || !TYPE.children ) { return }

    return (
      <React.Fragment>
        {TYPE.children.length > 1 && renderAdditionalInputsToggle()}
        {TYPE.children.map(option => {

          if ( option.value === 'property' ) {
            return (
              <Grid item xs={12} key={option.value}>
                <PropertyInput
                  file={file}
                  sheet={sheet}
                  selectedProperty={getFormValue('property')}
                  onSelectProperty={handleOnSelectProperty}
                  onSubmitPropertyCells={handleOnSubmitPropertyCells} />
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
                      id={option.value}
                      name={option.value}
                      value={getFormValue(option.value)}
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
          </Grid>
          <Grid item>
            {!!selectedAnnotation && (
              <Button
                onClick={handleOnDelete}
                className={classes.deleteButton}>
                DELETE THIS ANNOTATION
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={3}
      className={classes.wrapper}>
      {renderFormInstructions()}
      {renderSelectedRangeInput()}
      {renderSelectedRoleInput()}
      {renderSelectedTypeInput()}
      {renderAdditionalInputs()}
      {renderActionButtons()}
    </Grid>
  )
}


export default AnnotationMenu
