import React, { useCallback, useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CheckIcon from '@material-ui/icons/Check'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import uploadEntity from '../utils/uploadEntity'
import { DEFAULT_TAGS } from '../content/tag-options'
import { TOOLTIPS } from '../content/tooltips'


const useStyles = makeStyles(theme => ({
  menu: {
    minWidth: '550px',
    position: 'absolute',
    top: '5vh',
    left: '5vw',
  },
  noOptionsLabel: {
    color: 'red',
    display: 'block',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  createButton: {
    '&:hover': {
      color: 'red',
      transition: 'color 150ms ease',
    },
  },
  menuItem: {
    position: 'relative',
    width: '100%',
  },
  tooltip: {
    marginRight: theme.spacing(3),
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: theme.spacing(1),
  },
}))


const PropertyTags = ({
  file,
  sheet,
  entity,
  updateEntity,
  setMessage,
  hideMenu,
}) => {

  const classes = useStyles()

  const timeoutID = useRef(null)

  const [tags, setTags] = useState({})
  const [formState, setFormState] = useState({
    newTagKey: '',
    newTagValue: '',
  })

  const [factorClassValue, setFactorClassValue] = useState('')
  const [unitsValue, setUnitsValue] = useState('')

  useEffect(() => {
    if ( !!entity.tags ) {
      setTags(entity.tags)
    }
  }, [entity])

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
  }

  const handleOnTagChange = (event, key) => {
    const value = event.target.value
    setTags(prevTags => {
      const tags = {...prevTags}
      tags[key] = value
      return tags
    })

    // submit changes after a 1 second timeout
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      updateTags()
    }, 1000)
  }

  const handleOnSelectTagValue = (key, value) => {
    setTags(prevTags => {
      const tags = {...prevTags}
      tags[key] = value || ''

      uploadEntity(entity, tags, file, sheet)
      .then(entity => {
        updateEntity(entity)

        // Show a success message
        setMessage({
          type: 'success',
          text: 'Property tags were updated!',
        })
      })
      .catch(error => {
        setMessage({
          type: 'error',
          title: `${error.errorCode} - ${error.errorTitle}`,
          text: error.errorDescription,
        })
      })

      return tags
    })
  }

  const updateTags = useCallback(() => {
    setTags(prevTags => {
      const tags = {...prevTags}

      if ( !!formState.newTagKey && !!formState.newTagValue ) {
        tags[formState.newTagKey] = formState.newTagValue
      }

      if ( validateInput('Relevance', tags['Relevance']) ) {
        uploadEntity(entity, tags, file, sheet)
        .then(entity => {
          updateEntity(entity)

          // clear out the new tag create form
          if ( !!formState.newTagKey && !!formState.newTagValue ) {
            setFormState({
              newTagKey: '',
              newTagValue: '',
            })
          }

          // Show a success message
          setMessage({
            type: 'success',
            text: 'New property tag was saved!',
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

      return tags
    })
  }, [entity, file, sheet, formState, updateEntity, setMessage])

  const handleOnKeyDown = useCallback(event => {

    // submit changes when users hit the Enter or NumpadEnter keys
    if ( event.code === 'Enter' || event.code === 'NumpadEnter' ) {
      updateTags()
    }
  }, [updateTags])

  useEffect(() => {
    // component did mount
    document.addEventListener('keydown', handleOnKeyDown)

    // component will unmount
    return () => {
      document.removeEventListener('keydown', handleOnKeyDown)
    }
  }, [handleOnKeyDown])

  const handleOnCreateFactorClass = () => {
    setTags(prevTags => {
      const tags = {...prevTags}
      tags['FactorClass'] = factorClassValue

      uploadEntity(entity, tags, file, sheet)
      .then(entity => {
        updateEntity(entity)

        // Show a success message
        setMessage({
          type: 'success',
          text: 'Property tags were updated!',
        })
      })
      .catch(error => {
        setMessage({
          type: 'error',
          title: `${error.errorCode} - ${error.errorTitle}`,
          text: error.errorDescription,
        })
      })

      return tags
    })
  }

  const handleOnCreateUnit = () => {
    setTags(prevTags => {
      const tags = {...prevTags}
      tags['Units'] = unitsValue

      uploadEntity(entity, tags, file, sheet)
      .then(entity => {
        updateEntity(entity)

        // Show a success message
        setMessage({
          type: 'success',
          text: 'Property tags were updated!',
        })
      })
      .catch(error => {
        setMessage({
          type: 'error',
          title: `${error.errorCode} - ${error.errorTitle}`,
          text: error.errorDescription,
        })
      })

      return tags
    })
  }

  const validateInput = (key, value) => {
    if ( key === 'Relevance' ) {
      if ( !value ) {
        return true
      }
      const floatValue = parseFloat(value)
      if ( floatValue >= -1 && floatValue <= 1) {
        return true
      }
      return false
    }
    return true
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        Property Tags - {entity.label}
        <IconButton onClick={hideMenu}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to edit property tags
        </FormHelperText>
      </Grid>
    )
  }

  const renderNewTagInputs = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormHelperText component="p">
              Alternatively, you may want to create new property tags using the form below
            </FormHelperText>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              id="newTagKey"
              name="newTagKey"
              label="Key"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={handleOnChange}
              onBlur={updateTags}
              value={formState.newTagKey} />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              size="small"
              id="newTagValue"
              name="newTagValue"
              label="Value"
              variant="outlined"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              inputProps={{'data-lpignore': 'true'}}
              onChange={handleOnChange}
              onBlur={updateTags}
              value={formState.newTagValue} />
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderFactorClassInput = (key, value, input) => {
    return (
      <Autocomplete
        id="factor-class-input"
        selectOnFocus
        handleHomeEndKeys
        fullWidth={true}
        clearOnBlur={false}
        options={DEFAULT_TAGS[key]}
        value={value}
        onChange={(event, newValue) => {
          if ( typeof newValue === 'string' ) {
            setFactorClassValue(newValue)
            handleOnSelectTagValue(key, newValue)
          } else if ( newValue && newValue.inputValue ) {
            // Create a new value from the user input
            setFactorClassValue(newValue.inputValue)
          } else {
            setFactorClassValue(newValue)
          }
        }}
        onClose={(event, newValue) => {
          if ( typeof event.target.value === 'string' ) {
            setFactorClassValue(event.target.value)
            handleOnSelectTagValue(key, event.target.value)
          }
        }}
        getOptionLabel={option => option}
        noOptionsText={
          <span>
            <Typography variant="body1" className={classes.noOptionsLabel}>
              This is not one of the pre-defined FactorClass options - would you like to create a new one?
            </Typography>
            <Button
              startIcon={<CheckIcon />}
              onMouseDown={handleOnCreateFactorClass}
              className={classes.createButton}>
              Yes, create a new Factor Class
            </Button>
          </span>
        }
        renderOption={option => (
          <Typography variant="body1" key={option}>
            {option}
          </Typography>
        )}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            size="small"
            name="value"
            label="Value"
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={event => setFactorClassValue(event.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }} />
        )}
      />
    )
  }

  const renderNormalizerInput = (key, value, input) => {
    return (
      <Autocomplete
        fullWidth={true}
        clearOnBlur={false}
        selectOnFocus={false}
        options={DEFAULT_TAGS[key]}
        onChange={(event, option) => handleOnSelectTagValue(key, option)}
        noOptionsText={'No options available'}
        value={value || null}
        renderOption={option => (
          <div className={classes.menuItem}>
            {option}
            <Tooltip
              arrow
              placement="right"
              className={classes.tooltip}
              title={TOOLTIPS[`${key.toLowerCase()}_${option.toLowerCase()}`]}>
              <HelpOutlineIcon fontSize="small" className={classes.help} />
            </Tooltip>
          </div>
        )}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            size="small"
            name="value"
            label="Value"
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }} />
        )}
      />
    )
  }

  const renderUnitsInput = (key, value, input) => {
    return (
      <Autocomplete
        id="units-input"
        selectOnFocus
        handleHomeEndKeys
        fullWidth={true}
        clearOnBlur={false}
        options={DEFAULT_TAGS[key]}
        value={value}
        onChange={(event, newValue) => {
          if ( typeof newValue === 'string' ) {
            setUnitsValue(newValue)
            handleOnSelectTagValue(key, newValue)
          } else if ( newValue && newValue.inputValue ) {
            // Create a new value from the user input
            setUnitsValue(newValue.inputValue)
          } else {
            setUnitsValue(newValue)
          }
        }}
        onClose={(event, newValue) => {
          if ( typeof event.target.value === 'string' ) {
            setFactorClassValue(event.target.value)
            handleOnSelectTagValue(key, event.target.value)
          }
        }}
        getOptionLabel={option => option}
        noOptionsText={
          <span>
            <Typography variant="body1" className={classes.noOptionsLabel}>
              This is not one of the pre-defined unit options - would you like to create a new one?
            </Typography>
            <Button
              startIcon={<CheckIcon />}
              onMouseDown={handleOnCreateUnit}
              className={classes.createButton}>
              Yes, create a new unit
            </Button>
          </span>
        }
        renderOption={option => (
          <Typography variant="body1" key={option}>
            {option}
          </Typography>
        )}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            size="small"
            name="value"
            label="Value"
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={event => setUnitsValue(event.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }} />
        )}
      />
    )
  }

  const renderAutocompleteInput = (key, value, options) => {
    if ( key === 'FactorClass' ) {
      return renderFactorClassInput(key, value, options)
    }
    if ( key === 'Normalizer' ) {
      return renderNormalizerInput(key, value, options)
    }
    if ( key === 'Units' ) {
      return renderUnitsInput(key, value, options)
    }
    return (
      <Autocomplete
        fullWidth={true}
        clearOnBlur={false}
        selectOnFocus={false}
        options={DEFAULT_TAGS[key]}
        onChange={(event, option) => handleOnSelectTagValue(key, option)}
        noOptionsText={'No options available'}
        value={value || null}
        renderOption={option => (
          <Typography variant="body1" key={option}>
            {option}
          </Typography>
        )}
        renderInput={params => (
          <TextField {...params}
            fullWidth
            size="small"
            name="value"
            label="Value"
            variant="outlined"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }} />
        )}
      />
    )
  }

  const renderTextFieldInput = (key, value) => {
    return (
      <TextField
        fullWidth
        size="small"
        name="value"
        label="Value"
        variant="outlined"
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        inputProps={{'data-lpignore': 'true'}}
        onChange={event => handleOnTagChange(event, key)}
        onBlur={updateTags}
        error={!validateInput(key, value)}
        helperText={key === 'Relevance' ? (
          'value must be greater than or equal to -1 and less than or equal to 1'
        ) : ''}
        defaultValue={value} />
    )
  }

  const renderPropertyTags = () => {
    return Object.entries(tags).map(tag => {
      const key = tag[0]
      const value = tag[1]
      return (
        <Grid item xs={12} key={key}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                name="key"
                label="Key"
                variant="outlined"
                autoCorrect="off"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                inputProps={{'data-lpignore': 'true'}}
                InputProps={{
                  readOnly: key in DEFAULT_TAGS,
                }}
                onChange={event => handleOnTagChange(event, key)}
                onBlur={updateTags}
                defaultValue={key} />
            </Grid>
            <Grid item xs={8}>
              {key in DEFAULT_TAGS && !!DEFAULT_TAGS[key].length ? (
                renderAutocompleteInput(key, value, DEFAULT_TAGS[key])
              ) : (
                renderTextFieldInput(key, value)
              )}
            </Grid>
          </Grid>
        </Grid>
      )
    })
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {renderFormInstructions()}
        {renderPropertyTags()}
        {renderNewTagInputs()}
      </Grid>
    )
  }

  const renderButtons = () => {}

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-property-tags-handle'}}>
      <DialogTitle classes={{ root: 'draggable-property-tags-handle' }}>
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


export default PropertyTags
