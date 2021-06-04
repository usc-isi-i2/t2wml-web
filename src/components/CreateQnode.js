import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'

import DraggablePaper from './DraggablePaper'
import uploadQnode from '../utils/uploadQnode'


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


const CreateQnode = ({ file, sheet, selectQnode, hideMenu }) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    qnodeLabel: '',
    qnodeDescription: '',
  })

  const handleOnSubmit = () => {
    if ( !formState.qnodeLabel ) { return }
    uploadQnode(file, sheet, formState).then(qnode => {
      selectQnode(qnode)
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
        <Typography variant="body1">
          <b>Create a new wikidata item</b>
        </Typography>
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
          Use this form to create a new wikidata item
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
      PaperProps={{handle: '.draggable-qnode-handle'}}>
      <DialogTitle classes={{ root: 'draggable-qnode-handle' }}>
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


export default CreateQnode
