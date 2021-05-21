import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
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

import Draggable from 'react-draggable'


const useStyles = makeStyles(theme => ({
  menu: {
    position: 'absolute',
    top: theme.spacing(55),
    right: theme.spacing(15),
  },
  form: {
    minHeight: '50px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))


const CreateQnode = ({ hideMenu }) => {

  const classes = useStyles()

  const [formState, setFormState] = useState({
    qnodeID: '',
    qnodeLabel: '',
  })

  const handleOnSubmit = () => {}

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
          Create a new Qnode
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
          Use this form to create a new qnode
        </FormHelperText>
      </Grid>
    )
  }

  const renderIDInput = () => {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="qnodeID"
          name="qnodeID"
          label="Qnode ID"
          variant="outlined"
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          inputProps={{'data-lpignore': 'true'}}
          onChange={handleOnChange}
          value={formState.qnodeID} />
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

  const renderContent = () => {
    return (
      <form noValidate autoComplete="off"
        className={classes.form}
        onSubmit={handleOnSubmit}>
        <Grid container spacing={3}>
          {renderFormInstructions()}
          {renderIDInput()}
          {renderLabelInput()}
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
      PaperComponent={props => (
        <Draggable handle='.draggable-qnode-handle'>
          <Paper {...props} />
        </Draggable>
      )}>
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
