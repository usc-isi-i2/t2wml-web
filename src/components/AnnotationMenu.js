import React, { useCallback, useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputAdornment from '@material-ui/core/InputAdornment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import ListAltIcon from '@material-ui/icons/ListAlt'

import Dropdown from './Dropdown'
import PropertyTags from './PropertyTags'
import PropertyInput from './PropertyInput'
import { ROLES, TYPES } from '../content/annotation-options'
import uploadAnnotations from '../utils/uploadAnnotations'
import uploadWikinodes from '../utils/uploadWikinodes'
import wikifyRegion from '../utils/wikifyRegion'
import fetchEntity from '../utils/fetchEntity'
import useStyles from '../styles/annotationMenu'
import * as utils from '../utils/table'


const DEFAULT_FORMSTATE = {
  range: '',
  role: '',
  type: '',
  property: '',
  language: '',
  precision: '',
  format: '',
}


const AnnotationMenu = ({
  file,
  sheet,
  selection,
  annotations,
  hideOverlayMenu,
  updateAnnotations,
  onSelectionChange,
  selectedAnnotation,
  suggestedAnnotation,
  submitNewAnnotation,
  updateOutputPreview,
  updateTableDataLayers,
  setMessage,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState(DEFAULT_FORMSTATE)

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
  const [showPropertyTagsMenu, setShowPropertyTagsMenu] = useState(false)
  const [entity, setEntity] = useState([])

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

    // user selected a different annotation block, reset form state
    setUserChangedFormState(false)
    setFormState(DEFAULT_FORMSTATE)

    setAnnotation(annotation => {
      return {
        ...annotation,
        id: selectedAnnotation.id,
        role: selectedAnnotation.role,
        type: selectedAnnotation.type,
        property: selectedAnnotation.property,
        precision: selectedAnnotation.precision,
        format: selectedAnnotation.format,
      }
    })
  }, [selectedAnnotation])

  const handleOnSubmit = event => {
    event.preventDefault()

    if ( !selectedAnnotation ) {
      submitNewAnnotation(userChangedFormState ? formState : {})
    } else {
      saveAnnotationChanges()
    }
  }

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

  const saveAnnotationChanges = () => {
    // get a list of all other annotations
    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    const role = getFormValue('role')
    const type = getFormValue('type')
    const property = getFormValue('property')
    const language = getFormValue('language')
    const precision = getFormValue('precision')
    const format = getFormValue('format')
    const id = annotation.id

    // add updated annotation to the list with the others
    filteredAnnotations.push({
      selection: {...selection},
      role: role,
      type: type,
      property: property,
      language: language,
      precision: precision,
      format: format,
      id: id,
    })
    uploadAnnotations(file, sheet, filteredAnnotations, () => {})
    .then(data => {

      // update annotations in the table component
      updateAnnotations(data.annotations)

      if ( utils.isWikifyable({role: getFormValue('role')}) ) {
        if ( getFormValue('role') === 'mainSubject' ) {
          wikifyRegion(file, sheet, selection)
          .then(layers => updateTableDataLayers(layers))
        } else {
          uploadWikinodes(file, sheet, selection, role === 'property', 'string')
          .then(layers => updateTableDataLayers(layers))
        }
      }

      // Show a success message
      setMessage({
        type: 'success',
        text: 'Your changes have been saved!',
      })
    })
    .catch(error => {
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  useEffect(() => {
    // form state has changed, update selected annotation
    if ( !selectedAnnotation ) { return }

    // skip if the form state is empty (on init)
    if ( Object.keys(formState).map(key => !!formState[key]).every(x => !x) ) {
      return
    }

    // save annotation changes
    saveAnnotationChanges()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  const handleOnDelete = () => {
    if ( !annotation.role ) { return }

    const filteredAnnotations = annotations.filter(
      annotation => annotation !== selectedAnnotation
    )

    uploadAnnotations(file, sheet, filteredAnnotations, () => {}).then(data => {
      updateAnnotations(data.annotations, selectedAnnotation)
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

  const handleOnChangeSelectedRange = useCallback(event => {
    const value = event.target.value
    const newSelection = utils.parseSelectedRangeInput(value)
    if ( newSelection ) {
      onSelectionChange(newSelection)

      // update selected range on the form state
      setFormState({
        ...formState,
        [event.target.name]: value,
      })
    }
  }, [formState, onSelectionChange])

  const handleOnKeyDown = useCallback(event => {

    // submit changes when users hit the Enter or NumpadEnter keys
    if ( event.code === 'Enter' || event.code === 'NumpadEnter' ) {

      // but only for the range selection input
      if ( event.target.name === 'range' ) {
        handleOnChangeSelectedRange(event)
      }
    }
  }, [handleOnChangeSelectedRange])

  useEffect(() => {
    // component did mount
    document.addEventListener('keydown', handleOnKeyDown)

    // component will unmount
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [handleOnKeyDown])

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
    if ( event.target.name === 'role' ) {
      setUserChangedFormState(true)
    }
  }

  const updateEntity = entity => {
    setEntity(entity)
    updateOutputPreview()
  }

  const openPropertyTagsMenu = () => {
    const property = getFormValue('property')
    if ( !property ) { return }
    fetchEntity(property, file, sheet).then(entity => {
      setEntity(entity)
      setShowPropertyTagsMenu(true)
    })
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
      <Grid item xs={12}>
        <TextField
          id="range"
          name="range"
          fullWidth
          label="Selected range"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          defaultValue={formState.range || defaultValue}
          onBlur={handleOnChangeSelectedRange}
          error={!!formState.range && !parsedCorrectly}
          helperText={formState.range && !parsedCorrectly ? (
            'format: [col][row](:[col][row])?'
          ) : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip arrow placement="right" className={classes.tooltip}
                  title={<div>This input field can be used to manually adjust the selected area.<br/><br/>Accepted input format can be either one cell (e.g. A1) or a range of cells (e.g. A1:B12).</div>}>
                  <HelpOutlineIcon fontSize="small" className={classes.help} />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
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

  const handleOnSelectAdditionalInput = (option, newValue) => {
    if ( typeof newValue === 'string' ) {
      setFormState(prevState => {
        const formState = {...prevState}
        formState[option.value] = newValue
        return formState
      })
    } else if ( newValue && newValue.value ) {
      setFormState(prevState => {
        const formState = {...prevState}
        formState[option.value] = newValue.value
        return formState
      })
    }
  }

  const renderAdditionalInputs = () => {
    const currentRole = getFormValue('role')
    const currentType = getFormValue('type')
    const property = getFormValue('property')

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

          if ( !!selectedAnnotation &&
               currentRole !== 'property' &&
               option.value === 'property' ) {
            return (
              <Grid item xs={12} key={option.value}>
                <PropertyInput
                  file={file}
                  sheet={sheet}
                  dataType={currentType}
                  setMessage={setMessage}
                  annotations={annotations}
                  selectedAnnotation={selectedAnnotation}
                  selectedProperty={getFormValue('property')}
                  onSelectProperty={handleOnSelectProperty} />
                <br />
                {currentRole === 'dependentVar' && !!property && (
                  <Button
                    color="primary"
                    variant="contained"
                    startIcon={<ListAltIcon />}
                    onClick={openPropertyTagsMenu}>
                    Show Property Tags
                  </Button>
                )}
              </Grid>
            )
          }

          if ( showAdditionalInputs ) {

            // find the selected option from the list
            const value = getFormValue(option.value)
            const selectedOption = option.children.find(option => option.value === value)

            return (
              <Grid item xs={12} key={option.value}>
                <Grid container>
                  <Grid item xs={1}>
                  </Grid>
                  <Grid item xs={11}>
                    <Dropdown
                      label={option.label}
                      options={option.children}
                      selected={getFormValue(option.value)}
                      onSelect={newValue =>
                        handleOnSelectAdditionalInput(option, newValue)}
                    />
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

  const renderPropertyTagsMenu = () => {
    if ( !showPropertyTagsMenu ) { return }
    return (
      <PropertyTags
        file={file}
        sheet={sheet}
        entity={entity}
        updateEntity={updateEntity}
        hideMenu={() => setShowPropertyTagsMenu(false)} />
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
              onClick={handleOnSubmit}>
              {!!selectedAnnotation ? (
                <span>Save changes</span>
              ) : (
                <span>Submit new annotation</span>
              )}
            </Button>
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
      {renderPropertyTagsMenu()}
      {renderActionButtons()}
    </Grid>
  )
}


export default AnnotationMenu
