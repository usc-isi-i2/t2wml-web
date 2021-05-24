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
import useStyles from '../styles/annotationMenu'
import * as utils from '../utils/table'


const AnnotationMenu = ({
  file,
  sheet,
  selectedCell,
  selection,
  annotations,
  hideOverlayMenu,
  onSelectionChange,
  selectedAnnotation,
  suggestedAnnotation,
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
        role: selectedAnnotation.role,
        type: selectedAnnotation.type,
        property: selectedAnnotation.property,
      }
    })
  }, [selectedAnnotation])

  const handleOnSubmit = event => {
    event.preventDefault()

    if ( ( !formState.role ) || ( !annotation.role ) ) { return }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )
    filteredAnnotations.push({
      selection: {...selection},
      role: formState.role,
      type: formState.type,
      property: formState.property ? formState.property.qnode : '',
      language: formState.language,
      precision: formState.precision,
      calendar: formState.calendar,
      format: formState.format,
      unit: formState.unit,
    })

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      hideOverlayMenu(data.annotations)
    }).catch(error => {
      hideOverlayMenu()
    })
  }

  const handleOnDelete = () => {
    if ( ( !formState.role ) || ( !annotation.role ) ) { return }

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
    if ( event.target.name === 'range' ) {
      const newSelection = utils.parseSelectedRangeInput(value)
      if ( newSelection ) {
        onSelectionChange(newSelection)
      }
    }
  }

  const getFormValue = field => {
    if ( !!formState[field] ) {
      return formState[field]
    }

    if ( !!annotation[field] ) {
      return annotation[field]
    }

    if ( !!suggestion[field] ) {
      return suggestion[field]
    }

    return ''
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

    // check if the selected role can be wikified
    let showWikifyButton = false
    if ( formState.role ) {
      const ROLE = ROLES.find(role => role.value === currentRole)
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
        {showWikifyButton && <WikifyButton />}
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

    // check if the selected type can be wikified
    let showWikifyButton = false
    if ( currentType ) {
      const TYPE = TYPES.find(type => type.value === currentType)
      if ( TYPE && TYPE.wikify ) {
        showWikifyButton = true
      }
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
      property: node,
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
                  selectedProperty={getFormValue('property')}
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
            <Button
              autoFocus
              color="primary"
              variant="contained"
              disabled={
                (!formState.role && !selectedAnnotation) ||
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
        {renderSelectedRangeInput()}
        {renderSelectedRoleInput()}
        {renderSelectedTypeInput()}
        {renderAdditionalInputs()}
        {renderActionButtons()}
      </Grid>
    </form>
  )
}


export default AnnotationMenu
