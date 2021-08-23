import React, { useState } from 'react'

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
import uploadUnit from '../utils/uploadUnit'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: '10vh',
    right: '10vw',
  },
  form: {
    minHeight: '50px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))


const CreateUnit = ({ file, sheet, selectUnit, hideMenu }) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    unitLabel: '',
    unitDescription: '',
  })

  const handleOnSubmit = () => {
    if ( !formState.unitLabel ) { return }
    uploadUnit(file, sheet, formState).then(unit => {
      selectUnit(unit)
      hideMenu()
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
        Create a new Unit
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
          Use this form to create a new Unit
        </FormHelperText>
      </Grid>
    )
  }

  const renderLabelInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="unitLabel"
          name="unitLabel"
          label="Label"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.unitLabel} />
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
          id="unitDescription"
          name="unitDescription"
          label="Description"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.unitDescription} />
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
        Submit
      </Button>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideMenu}
      classes={{paper: classes.menu}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-unit-handle'}}>
      <DialogTitle classes={{ root: 'draggable-unit-handle' }}>
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


export default CreateUnit
