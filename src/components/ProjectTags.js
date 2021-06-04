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
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'


const useStyles = makeStyles(theme => ({
  projectTags: {
    position: 'absolute',
    top: theme.spacing(12),
    left: theme.spacing(8),
  },
}))


const ProjectTags = ({
  tags,
  setTags,
  hideProjectTags,
}) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    newTagKey: '',
    newTagValue: '',
  })

  const handleOnSubmit = () => {
    setTags(tags)
    hideProjectTags()
  }

  const handleOnChange = event => {
    const value = event.target.value
    setFormState({
      ...formState,
      [event.target.name]: value,
    })
  }

  const saveNewTag = () => {
    if ( !formState.newTagKey || !formState.newTagValue ) { return }
    setTags(tags => [...tags, {...formState}])
  }

  const renderTitle = () => {
    return (
      <React.Fragment>
        Project Tags
        <IconButton onClick={hideProjectTags}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }

  const renderFormInstructions = () => {
    return (
      <Grid item xs={12}>
        <FormHelperText component="p">
          Use this form to edit project tags
        </FormHelperText>
      </Grid>
    )
  }

  const renderNewTagInputs = () => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
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
              value={formState.newTagKey} />
          </Grid>
          <Grid item xs={5}>
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
              value={formState.newTagValue} />
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={saveNewTag}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderProjectTags = () => {}

  const renderContent = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderFormInstructions()}
          {renderNewTagInputs()}
          {renderProjectTags()}
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
      onClose={hideProjectTags}
      classes={{paper: classes.projectTags}}
      aria-labelledby='dialog-modal-title'
      PaperComponent={DraggablePaper}
      PaperProps={{handle: '.draggable-project-tags-handle'}}>
      <DialogTitle classes={{ root: 'draggable-project-tags-handle' }}>
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


export default ProjectTags
