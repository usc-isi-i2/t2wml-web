import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import ConfirmationDialog from './ConfirmationDialog'
import uploadProperty from '../utils/uploadProperty'
import uploadEntity from '../utils/uploadEntity'
import classNames from '../utils/classNames'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(54),
    right: theme.spacing(80),
  },
  form: {
    minHeight: '50px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submitButton: {
    marginRight: theme.spacing(10),
    position: 'relative',
    '& .MuiCircularProgress-root': {
      display: 'none',
    },
    '&.active .MuiCircularProgress-root': {
      display: 'block',
    },
  },
}))


const CreateProperty = ({
  file,
  sheet,
  dataType,
  selectProperty,
  selectedProperty,
  setMessage,
  hideMenu,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    qnodeLabel: '',
    qnodeDescription: '',
  })

  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    setFormState({
      qnodeLabel: selectedProperty.label,
      qnodeDescription: selectedProperty.description,
    })
  }, [selectedProperty])

  const handleOnClose = () => {
    if ( !!formState.qnodeLabel || !!formState.qnodeDescription ) {
      setShowConfirmation(true)
    } else {
      hideMenu()
    }
  }

  useEffect(() => {
    if ( confirmation ) {
      setConfirmation(false)
      setShowConfirmation(false)
      hideMenu()
    }
  }, [confirmation, hideMenu])


  const handleOnSubmit = () => {
    if ( !formState.qnodeLabel ) { return }

    if ( !!selectedProperty ) {
      updateSelectedProperty()
    } else {
      submitNewProperty()
    }
  }

  const updateSelectedProperty = () => {
    const entity = {
      ...selectedProperty,
      label: formState.qnodeLabel,
      description: formState.qnodeDescription,
    }

    setLoading(true)
    uploadEntity(entity, {}, file, sheet)
    .then(entity => {
      selectProperty(entity)
      setLoading(false)
      hideMenu()

      // Show a success message
      setMessage({
        type: 'success',
        text: 'Property is updated!',
      })
    })
    .catch(error => {
      setLoading(false)
      setMessage({
        type: 'error',
        title: `${error.errorCode} - ${error.errorTitle}`,
        text: error.errorDescription,
      })
    })
  }

  const submitNewProperty = () => {
    setLoading(true)
    uploadProperty(file, sheet, formState, dataType)
    .then(property => {
      selectProperty(property)
      setLoading(false)
      hideMenu()

      // Show a success message
      setMessage({
        type: 'success',
        text: 'New property is created!',
      })
    })
    .catch(error => {
      setLoading(false)
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
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        {!!selectedProperty ? (
          <span>Edit property</span>
        ) : (
          <span>Create a new property</span>
        )}
        <IconButton onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        {!!selectedProperty ? (
          <FormHelperText component="p">
            Use this form to edit property label and/or description
          </FormHelperText>
        ) : (
          <FormHelperText component="p">
            Use this form to create a new property
          </FormHelperText>
        )}
      </Grid>
    )
  }

  const renderLabelInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="qnodeLabel"
          name="qnodeLabel"
          label="Label"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.qnodeLabel} />
      </Grid>
    )
  }

  const renderDescriptionInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          id="qnodeDescription"
          name="qnodeDescription"
          label="Description"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.qnodeDescription} />
      </Grid>
    )
  }

  const renderContent = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderFormInstructions()}
          {renderLabelInput()}
          {renderDescriptionInput()}
        </Grid>
      </form>
    )
  }

  const renderButtons = () => {
    return (
      <Button
        color="primary"
        variant="contained"
        disabled={loading}
        className={classNames(classes.submitButton, {
          active: loading,
        })}
        endIcon={<CircularProgress color="inherit" size={16} />}
        onClick={handleOnSubmit}>
        {!!selectedProperty ? (
          <span>Save Changes</span>
        ) : (
          <span>Submit new Property</span>
        )}
      </Button>
    )
  }

  const renderCreatePropertyDialog = () => {
    return (
      <Dialog
        open={true}
        onClose={handleOnClose}
        classes={{paper: classes.menu}}
        aria-labelledby='dialog-modal-title'
        PaperComponent={DraggablePaper}
        PaperProps={{handle: '.draggable-property-handle'}}>
        <DialogTitle classes={{ root: 'draggable-property-handle' }}>
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

  const renderConfirmationDialog = () => {
    return (
      <ConfirmationDialog
        open={showConfirmation}
        text={'Submit the form to save this new property.'}
        close={() => setShowConfirmation(false)}
        onConfirm={() => setConfirmation(true)} />
    )
  }

  return (
    <React.Fragment>
      {renderCreatePropertyDialog()}
      {renderConfirmationDialog()}
    </React.Fragment>
  )
}


export default CreateProperty
