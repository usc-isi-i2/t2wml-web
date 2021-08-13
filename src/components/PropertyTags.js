import React, { useCallback, useEffect, useRef, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import uploadEntity from '../utils/uploadEntity'
import { DEFAULT_TAGS } from '../content/tag-options'


const useStyles = makeStyles(theme => ({
  menu: {
    minWidth: '550px',
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(80),
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
    setTags(tags => {
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
    setTags(tags => {
      tags[key] = value || ''

      uploadEntity(entity, file, sheet)
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
    if ( !!formState.newTagKey && !!formState.newTagValue ) {
      tags[formState.newTagKey] = formState.newTagValue
    }

    if ( validateInput('Relevance', tags['Relevance']) ) {
      uploadEntity(entity, file, sheet)
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
  }, [entity, tags, file, sheet, formState, updateEntity])

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
              ) : (
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
