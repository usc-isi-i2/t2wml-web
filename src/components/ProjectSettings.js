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


const useStyles = makeStyles(theme => ({
  projectSettings: {
    position: 'absolute',
    top: theme.spacing(10),
    left: theme.spacing(5),
  },
}))


const ProjectSettings = ({
  hideProjectSettings,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    projectTitle: '',
    projectDescription: '',
    projectDataSource: '',
  })

  const handleOnSubmit = () => {
    hideProjectSettings()
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
        Project Settings
        <IconButton onClick={hideProjectSettings}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to update project settings
        </FormHelperText>
      </Grid>
    )
  }

  const renderTitleInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="projectTitle"
          name="projectTitle"
          label="Title"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.projectTitle} />
      </Grid>
    )
  }

  const renderDescriptionInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="projectDescription"
          name="projectDescription"
          label="Description"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.projectDescription} />
      </Grid>
    )
  }

  const renderDataSourceInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="projectDataSource"
          name="projectDataSource"
          label="Data Source URL"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.projectDataSource} />
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
          {renderTitleInput()}
          {renderDescriptionInput()}
          {renderDataSourceInput()}
        </Grid>
      </form>
    )
  }

  const renderButtons = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={3} justify="space-between">
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={handleOnSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Dialog
      open={true}
      onClose={hideProjectSettings}
      classes={{paper: classes.projectSettings}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-project-settings-handle'}}>
      <DialogTitle classes={{ root: 'draggable-project-settings-handle' }}>
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


export default ProjectSettings
