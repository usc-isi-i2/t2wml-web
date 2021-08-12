import React, { useEffect, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import ConfirmationDialog from './ConfirmationDialog'
import uploadProperty from '../utils/uploadProperty'


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
}))


const CreateProperty = ({
  file,
  sheet,
  dataType,
  selectProperty,
  setMessage,
  hideMenu,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    qnodeLabel: '',
    qnodeDescription: '',
  })

  const [confirmation, setConfirmation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

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
    uploadProperty(file, sheet, formState, dataType)
    .then(property => {
      selectProperty(property)
      hideMenu()

      // Show a success message
      setMessage({
        type: 'success',
        text: 'New property is created!',
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
        Create a new property
        <IconButton onClick={handleOnClose}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to create a new property
        </FormHelperText>
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
        onClick={handleOnSubmit}>
        Submit new Property
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
